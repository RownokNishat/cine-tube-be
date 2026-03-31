import httpStatus from "http-status";
import { stripe } from "../../config/stripe.config.js";
import { envVars } from "../../config/env.js";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { PricingType, SubscriptionPlan, SubscriptionStatus, PurchaseType } from "../../../generated/enums.js";
// Rental pricing configuration
const RENTAL_PRICES = {
    "7": 2.99, // 7-day rental
    "30": 5.99, // 30-day rental
};
const RENTAL_DURATIONS = [7, 30]; // Available rental durations in days
const createCheckoutSession = async (userId, mediaId, purchaseType = "PURCHASE", rentalDays) => {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) {
        throw new AppError(httpStatus.NOT_FOUND, "Media not found");
    }
    if (media.pricingType !== PricingType.PREMIUM) {
        throw new AppError(httpStatus.BAD_REQUEST, "This media is free and does not require purchase");
    }
    // Check if user already has a completed purchase (for purchase type only)
    if (purchaseType === "PURCHASE") {
        const existingPurchase = await prisma.purchase.findFirst({
            where: { userId, mediaId, status: "COMPLETED", purchaseType: "PURCHASE" },
        });
        if (existingPurchase) {
            throw new AppError(httpStatus.CONFLICT, "You have already purchased this media");
        }
    }
    // Determine price based on purchase type
    let amount;
    let productName;
    let description;
    if (purchaseType === "RENTAL") {
        if (!rentalDays || !RENTAL_DURATIONS.includes(rentalDays)) {
            throw new AppError(httpStatus.BAD_REQUEST, `Invalid rental duration. Allowed: ${RENTAL_DURATIONS.join(", ")} days`);
        }
        amount = RENTAL_PRICES[rentalDays.toString()] ?? 3.99;
        productName = `${media.title} (${rentalDays}-day Rental)`;
        description = `Rent ${media.title} for ${rentalDays} days`;
    }
    else {
        amount = media.price ?? 9.99;
        productName = media.title;
        description = media.synopsis.slice(0, 255);
    }
    const unitAmount = Math.round(amount * 100); // convert to cents
    const frontendUrl = envVars.FRONTEND_URL;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: productName,
                        description: description,
                        images: media.posterUrl ? [media.posterUrl] : [],
                    },
                    unit_amount: unitAmount,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/media/${mediaId}`,
        metadata: { userId, mediaId, purchaseType, rentalDays: rentalDays?.toString() || "" },
    });
    const rentalDaysValue = purchaseType === "RENTAL" ? (rentalDays ?? null) : null;
    // Create or update purchase record
    await prisma.purchase.upsert({
        where: { userId_mediaId: { userId, mediaId } },
        create: {
            userId,
            mediaId,
            stripeSessionId: session.id,
            amount,
            currency: "usd",
            status: "PENDING",
            purchaseType: purchaseType,
            rentalDays: rentalDaysValue,
        },
        update: {
            stripeSessionId: session.id,
            status: "PENDING",
            stripePaymentId: null,
            purchaseType: purchaseType,
            rentalDays: rentalDaysValue,
        },
    });
    return { checkoutUrl: session.url, sessionId: session.id };
};
const getMyPurchases = async (userId) => {
    const purchases = await prisma.purchase.findMany({
        where: { userId, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        include: {
            media: {
                include: {
                    genres: { include: { genre: true } },
                },
            },
        },
    });
    return purchases.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        purchasedAt: p.createdAt,
        media: {
            ...p.media,
            genres: p.media.genres.map((mg) => mg.genre),
        },
    }));
};
const handleWebhookEvent = async (event) => {
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const metadataType = session.metadata?.type;
        if (metadataType === "subscription") {
            const userId = session.metadata?.userId;
            const plan = session.metadata?.plan;
            const amount = Number(session.metadata?.amount || 0);
            const durationDays = Number(session.metadata?.durationDays || 0);
            if (userId &&
                plan &&
                (plan === SubscriptionPlan.MONTHLY || plan === SubscriptionPlan.YEARLY)) {
                const startDate = new Date();
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + durationDays);
                await prisma.subscription.create({
                    data: {
                        userId,
                        plan,
                        status: SubscriptionStatus.ACTIVE,
                        amount,
                        stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
                        stripePaymentId: session.payment_intent,
                        startDate,
                        endDate,
                    },
                });
            }
            return;
        }
        // Handle purchase/rental completion
        const purchase = await prisma.purchase.findFirst({
            where: { stripeSessionId: session.id },
        });
        if (purchase) {
            let updateData = {
                status: "COMPLETED",
                stripePaymentId: session.payment_intent,
            };
            // If rental, set expiration date
            if (purchase.purchaseType === "RENTAL" && purchase.rentalDays) {
                const rentalExpiresAt = new Date();
                rentalExpiresAt.setDate(rentalExpiresAt.getDate() + purchase.rentalDays);
                updateData.rentalExpiresAt = rentalExpiresAt;
            }
            await prisma.purchase.update({
                where: { id: purchase.id },
                data: updateData,
            });
        }
    }
    if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        await prisma.purchase.updateMany({
            where: { stripeSessionId: session.id, status: "PENDING" },
            data: { status: "FAILED" },
        });
    }
};
const checkAccessBySession = async (sessionId) => {
    console.log(`[Purchase] Verifying session: ${sessionId}`);
    if (!sessionId || typeof sessionId !== "string" || sessionId.trim() === "") {
        return { hasAccess: false, purchase: null, debug: "Invalid sessionId" };
    }
    // First check DB for existing purchase
    let purchase = await prisma.purchase.findUnique({
        where: { stripeSessionId: sessionId },
        include: {
            media: {
                include: { genres: { include: { genre: true } } },
            },
        },
    });
    console.log(`[Purchase] DB result: ${purchase ? `Found (status: ${purchase.status})` : "Not found"}`);
    // If not in DB or still pending, verify with Stripe
    if (!purchase || purchase.status !== "COMPLETED") {
        try {
            const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
            console.log(`[Purchase] Stripe session retrieved. Payment status: ${stripeSession.payment_status}`);
            if (stripeSession.payment_status === "paid") {
                // Proactively complete the purchase in DB
                const updated = await prisma.purchase.updateMany({
                    where: { stripeSessionId: sessionId, status: { not: "COMPLETED" } },
                    data: {
                        status: "COMPLETED",
                        stripePaymentId: stripeSession.payment_intent,
                    },
                });
                console.log(`[Purchase] Marked as COMPLETED. Updated ${updated.count} record(s).`);
                // Fetch the updated record
                purchase = await prisma.purchase.findUnique({
                    where: { stripeSessionId: sessionId },
                    include: {
                        media: {
                            include: { genres: { include: { genre: true } } },
                        },
                    },
                });
            }
            else {
                console.log(`[Purchase] Stripe payment_status not 'paid': ${stripeSession.payment_status}`);
            }
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error(`[Purchase] Stripe API error: ${msg}`);
            // Fall through — let DB check result speak
        }
    }
    if (!purchase || purchase.status !== "COMPLETED") {
        return { hasAccess: false, purchase: null };
    }
    return {
        hasAccess: true,
        purchase: {
            ...purchase,
            media: {
                ...purchase.media,
                genres: purchase.media.genres.map((mg) => mg.genre),
            },
        },
    };
};
const normalizePeriodDays = (periodDays) => {
    const allowed = [7, 30, 90, 365];
    return allowed.includes(periodDays) ? periodDays : 30;
};
const getDashboardAnalytics = async (periodDays = 30) => {
    const normalizedPeriodDays = normalizePeriodDays(periodDays);
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - normalizedPeriodDays);
    const [periodCompletedPurchases, periodCompletedSubscriptions, purchaseStatusCounts, subscriptionStatusCounts,] = await Promise.all([
        prisma.purchase.findMany({
            where: {
                status: "COMPLETED",
                createdAt: { gte: periodStart },
            },
            include: {
                media: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.subscription.findMany({
            where: {
                status: "ACTIVE",
                createdAt: { gte: periodStart },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.purchase.groupBy({
            by: ["status"],
            _count: { status: true },
        }),
        prisma.subscription.groupBy({
            by: ["status"],
            _count: { status: true },
        }),
    ]);
    const purchaseRevenue = periodCompletedPurchases.reduce((sum, p) => sum + (p.amount || 0), 0);
    const subscriptionRevenue = periodCompletedSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
    const rentalRevenue = periodCompletedPurchases
        .filter((purchase) => purchase.purchaseType === PurchaseType.RENTAL)
        .reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    const totalRevenue = purchaseRevenue + subscriptionRevenue;
    const distinctUserIds = new Set();
    periodCompletedPurchases.forEach((purchase) => distinctUserIds.add(purchase.userId));
    periodCompletedSubscriptions.forEach((subscription) => distinctUserIds.add(subscription.userId));
    const dailyMap = new Map();
    periodCompletedPurchases.forEach((purchase) => {
        const key = purchase.createdAt.toISOString().split("T")[0];
        const existing = dailyMap.get(key) || { revenue: 0, count: 0 };
        dailyMap.set(key, {
            revenue: existing.revenue + (purchase.amount || 0),
            count: existing.count + 1,
        });
    });
    periodCompletedSubscriptions.forEach((subscription) => {
        const key = subscription.createdAt.toISOString().split("T")[0];
        const existing = dailyMap.get(key) || { revenue: 0, count: 0 };
        dailyMap.set(key, {
            revenue: existing.revenue + (subscription.amount || 0),
            count: existing.count + 1,
        });
    });
    const barChartData = Array.from(dailyMap.entries())
        .map(([day, value]) => ({ day, ...value }))
        .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
    const mediaMap = new Map();
    periodCompletedPurchases.forEach((purchase) => {
        const mediaId = purchase.media.id;
        const existing = mediaMap.get(mediaId) || {
            mediaId,
            title: purchase.media.title,
            purchases: 0,
            revenue: 0,
        };
        mediaMap.set(mediaId, {
            ...existing,
            purchases: existing.purchases + 1,
            revenue: existing.revenue + (purchase.amount || 0),
        });
    });
    const topMedia = Array.from(mediaMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    const purchaseStatusBreakdown = purchaseStatusCounts.map((item) => ({
        status: item.status,
        count: item._count.status,
    }));
    const subscriptionStatusBreakdown = subscriptionStatusCounts.map((item) => ({
        status: item.status,
        count: item._count.status,
    }));
    return {
        overview: {
            periodDays: normalizedPeriodDays,
            paymentCount: periodCompletedPurchases.length + periodCompletedSubscriptions.length,
            userCount: distinctUserIds.size,
            purchaseRevenue,
            subscriptionRevenue,
            rentalRevenue,
            totalRevenue,
        },
        barChartData,
        topMedia,
        purchaseStatusBreakdown,
        subscriptionStatusBreakdown,
    };
};
const getPaymentTransactions = async ({ page = 1, limit = 20 }) => {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;
    const [purchases, subscriptions, totalPurchases, totalSubscriptions] = await Promise.all([
        prisma.purchase.findMany({
            skip,
            take: safeLimit,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, email: true } },
                media: { select: { id: true, title: true } },
            },
        }),
        prisma.subscription.findMany({
            skip,
            take: safeLimit,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        }),
        prisma.purchase.count(),
        prisma.subscription.count(),
    ]);
    const purchaseTransactions = purchases.map((purchase) => ({
        id: purchase.id,
        type: "PURCHASE",
        status: purchase.status,
        amount: purchase.amount,
        currency: purchase.currency,
        createdAt: purchase.createdAt,
        user: purchase.user,
        media: purchase.media,
        purchaseType: purchase.purchaseType,
    }));
    const subscriptionTransactions = subscriptions.map((subscription) => ({
        id: subscription.id,
        type: "SUBSCRIPTION",
        status: subscription.status,
        amount: subscription.amount,
        currency: "usd",
        createdAt: subscription.createdAt,
        user: subscription.user,
        plan: subscription.plan,
    }));
    const merged = [...purchaseTransactions, ...subscriptionTransactions]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, safeLimit);
    return {
        data: merged,
        meta: {
            page: safePage,
            limit: safeLimit,
            total: totalPurchases + totalSubscriptions,
            totalPages: Math.ceil((totalPurchases + totalSubscriptions) / safeLimit),
        },
    };
};
export const PurchaseService = {
    createCheckoutSession,
    getMyPurchases,
    handleWebhookEvent,
    checkAccessBySession,
    getDashboardAnalytics,
    getPaymentTransactions,
};
//# sourceMappingURL=purchase.service.js.map