import httpStatus from "http-status";
import { stripe } from "../../config/stripe.config.js";
import { envVars } from "../../config/env.js";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { SubscriptionPlan, SubscriptionStatus } from "../../../generated/enums.js";
const DEFAULT_PLAN_CONFIG = {
    FREE: { amount: 0, durationDays: 0, label: "Free" },
    MONTHLY: { amount: 9.99, durationDays: 30, label: "Monthly" },
    YEARLY: { amount: 99.99, durationDays: 365, label: "Yearly" },
};
const DEFAULT_PLAN_FEATURES = {
    FREE: [
        "Access to free titles",
        "Public reviews and watchlist support",
    ],
    MONTHLY: [
        "30 days premium streaming access",
        "Unlock premium-only titles",
        "Priority access to new releases",
    ],
    YEARLY: [
        "365 days premium streaming access",
        "Unlock premium-only titles",
        "Priority access to new releases",
        "Best value annual billing",
    ],
};
const PLAN_ORDER = [
    SubscriptionPlan.FREE,
    SubscriptionPlan.MONTHLY,
    SubscriptionPlan.YEARLY,
];
const ensureSubscriptionPlanSettings = async () => {
    await Promise.all(PLAN_ORDER.map((plan) => prisma.subscriptionPlanSetting.upsert({
        where: { plan },
        update: {},
        create: {
            plan,
            label: DEFAULT_PLAN_CONFIG[plan].label,
            price: DEFAULT_PLAN_CONFIG[plan].amount,
            durationDays: DEFAULT_PLAN_CONFIG[plan].durationDays,
            currency: "usd",
            features: DEFAULT_PLAN_FEATURES[plan],
            isActive: true,
        },
    })));
    return prisma.subscriptionPlanSetting.findMany({
        orderBy: { createdAt: "asc" },
    });
};
const mapPlanSettingToResponse = (setting) => ({
    plan: setting.plan,
    price: setting.price,
    amount: setting.price,
    duration: setting.durationDays > 0 ? `${setting.durationDays} days` : "Lifetime",
    durationDays: setting.durationDays,
    label: setting.label,
    currency: setting.currency,
    features: setting.features,
    isActive: setting.isActive,
});
const getPlanSettingOrThrow = async (plan) => {
    const settings = await ensureSubscriptionPlanSettings();
    const setting = settings.find((item) => item.plan === plan);
    if (!setting) {
        throw new AppError(httpStatus.NOT_FOUND, "Subscription plan not found");
    }
    return setting;
};
const getSubscriptionPlans = async () => {
    const settings = await ensureSubscriptionPlanSettings();
    return PLAN_ORDER
        .map((plan) => settings.find((item) => item.plan === plan))
        .filter((setting) => Boolean(setting))
        .map(mapPlanSettingToResponse);
};
const updateSubscriptionPlan = async (plan, payload) => {
    if (!Object.keys(payload).length) {
        throw new AppError(httpStatus.BAD_REQUEST, "No plan changes provided");
    }
    const currentSetting = await getPlanSettingOrThrow(plan);
    const nextDurationDays = payload.durationDays ?? currentSetting.durationDays;
    const nextPrice = payload.price ?? currentSetting.price;
    if (plan === SubscriptionPlan.FREE) {
        if (nextPrice !== 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "FREE plan price must remain 0");
        }
        if (nextDurationDays !== 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "FREE plan duration must remain 0 days");
        }
    }
    if (plan !== SubscriptionPlan.FREE && nextDurationDays <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Paid plans must have a duration greater than 0 days");
    }
    const updated = await prisma.subscriptionPlanSetting.update({
        where: { plan: plan },
        data: {
            ...(payload.label !== undefined ? { label: payload.label.trim() } : {}),
            ...(payload.price !== undefined ? { price: payload.price } : {}),
            ...(payload.durationDays !== undefined ? { durationDays: payload.durationDays } : {}),
            ...(payload.features !== undefined ? { features: payload.features } : {}),
            ...(payload.isActive !== undefined ? { isActive: payload.isActive } : {}),
        },
    });
    return mapPlanSettingToResponse(updated);
};
const getMySubscription = async (userId) => {
    const sub = await prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    if (!sub) {
        return {
            plan: SubscriptionPlan.FREE,
            status: SubscriptionStatus.ACTIVE,
            startDate: null,
            endDate: null,
            amount: 0,
            currency: "usd",
        };
    }
    const now = new Date();
    if (sub.status === SubscriptionStatus.ACTIVE && sub.endDate && sub.endDate < now) {
        const expired = await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: SubscriptionStatus.EXPIRED },
        });
        return { ...expired, currency: "usd" };
    }
    return { ...sub, currency: "usd" };
};
const createCheckoutSession = async (userId, plan) => {
    if (plan !== SubscriptionPlan.MONTHLY && plan !== SubscriptionPlan.YEARLY) {
        throw new AppError(httpStatus.BAD_REQUEST, "Only MONTHLY or YEARLY plans are allowed for checkout");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const config = await getPlanSettingOrThrow(plan);
    const amountInCents = Math.round(config.price * 100);
    if (!config.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "This subscription plan is currently unavailable");
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: amountInCents,
                    product_data: {
                        name: `CineTube ${config.label} Subscription`,
                        description: `${config.durationDays} days premium access`,
                    },
                },
                quantity: 1,
            },
        ],
        metadata: {
            type: "subscription",
            userId,
            plan,
            durationDays: String(config.durationDays),
            amount: String(config.price),
        },
        success_url: `${envVars.FRONTEND_URL}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envVars.FRONTEND_URL}/dashboard/subscription?canceled=true`,
    });
    return { checkoutUrl: session.url, sessionId: session.id };
};
const verifyCheckoutSession = async (userId, sessionId) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.type !== "subscription") {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid subscription checkout session");
    }
    if (!session.metadata?.userId || session.metadata.userId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to verify this checkout session");
    }
    if (session.payment_status !== "paid") {
        return {
            verified: false,
            paymentStatus: session.payment_status,
        };
    }
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;
    if (!paymentIntentId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment intent not found for this checkout session");
    }
    const existing = await prisma.subscription.findFirst({
        where: {
            userId,
            stripePaymentId: paymentIntentId,
            status: SubscriptionStatus.ACTIVE,
        },
        orderBy: { createdAt: "desc" },
    });
    if (existing) {
        return {
            verified: true,
            paymentStatus: session.payment_status,
            subscription: existing,
        };
    }
    const plan = session.metadata.plan;
    if (!plan || (plan !== SubscriptionPlan.MONTHLY && plan !== SubscriptionPlan.YEARLY)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid subscription plan in checkout metadata");
    }
    const configuredPlan = await getPlanSettingOrThrow(plan);
    const durationDaysFromMetadata = Number(session.metadata.durationDays || "0");
    const durationDays = durationDaysFromMetadata > 0 ? durationDaysFromMetadata : configuredPlan.durationDays;
    const amountFromMetadata = Number(session.metadata.amount || "0");
    const amount = amountFromMetadata > 0 ? amountFromMetadata : configuredPlan.price;
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    await prisma.subscription.updateMany({
        where: {
            userId,
            status: SubscriptionStatus.ACTIVE,
        },
        data: {
            status: SubscriptionStatus.EXPIRED,
            endDate: new Date(),
        },
    });
    const created = await prisma.subscription.create({
        data: {
            userId,
            plan,
            status: SubscriptionStatus.ACTIVE,
            startDate,
            endDate,
            amount,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            stripePaymentId: paymentIntentId,
        },
    });
    return {
        verified: true,
        paymentStatus: session.payment_status,
        subscription: created,
    };
};
const cancelSubscription = async (userId) => {
    const activeSub = await prisma.subscription.findFirst({
        where: {
            userId,
            status: SubscriptionStatus.ACTIVE,
        },
        orderBy: { createdAt: "desc" },
    });
    if (!activeSub) {
        throw new AppError(httpStatus.NOT_FOUND, "No active subscription found");
    }
    await prisma.subscription.update({
        where: { id: activeSub.id },
        data: {
            status: SubscriptionStatus.CANCELLED,
            endDate: new Date(),
        },
    });
    return null;
};
export const SubscriptionService = {
    getSubscriptionPlans,
    updateSubscriptionPlan,
    getMySubscription,
    createCheckoutSession,
    verifyCheckoutSession,
    cancelSubscription,
};
//# sourceMappingURL=subscription.service.js.map