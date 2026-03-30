import httpStatus from "http-status";
import Stripe from "stripe";
import { stripe } from "../../config/stripe.config.js";
import { envVars } from "../../config/env.js";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { PricingType } from "../../../generated/enums.js";

const createCheckoutSession = async (userId: string, mediaId: string) => {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) {
        throw new AppError(httpStatus.NOT_FOUND, "Media not found");
    }

    if (media.pricingType !== PricingType.PREMIUM) {
        throw new AppError(httpStatus.BAD_REQUEST, "This media is free and does not require purchase");
    }

    // Check if user already has a completed purchase
    const existingPurchase = await prisma.purchase.findFirst({
        where: { userId, mediaId, status: "COMPLETED" },
    });
    if (existingPurchase) {
        throw new AppError(httpStatus.CONFLICT, "You have already purchased this media");
    }

    const unitAmount = Math.round((media.price ?? 9.99) * 100); // convert to cents
    const frontendUrl = envVars.FRONTEND_URL;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: media.title,
                        description: media.synopsis.slice(0, 255),
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
        metadata: { userId, mediaId },
    });

    // Upsert using userId_mediaId so re-checkout attempts after abandonment are handled
    // cleanly — this updates the existing PENDING record with the new session ID
    await prisma.purchase.upsert({
        where: { userId_mediaId: { userId, mediaId } },
        create: {
            userId,
            mediaId,
            stripeSessionId: session.id,
            amount: media.price ?? 9.99,
            currency: "usd",
            status: "PENDING",
        },
        update: {
            stripeSessionId: session.id,
            status: "PENDING",
            stripePaymentId: null,
        },
    });

    return { checkoutUrl: session.url, sessionId: session.id };
};

const getMyPurchases = async (userId: string) => {
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

const handleWebhookEvent = async (event: Stripe.Event) => {
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        await prisma.purchase.updateMany({
            where: { stripeSessionId: session.id },
            data: {
                status: "COMPLETED",
                stripePaymentId: session.payment_intent as string | null,
            },
        });
    }

    if (event.type === "checkout.session.expired") {
        const session = event.data.object as Stripe.Checkout.Session;
        await prisma.purchase.updateMany({
            where: { stripeSessionId: session.id, status: "PENDING" },
            data: { status: "FAILED" },
        });
    }
};

const checkAccessBySession = async (sessionId: string) => {
    const purchase = await prisma.purchase.findUnique({
        where: { stripeSessionId: sessionId },
        include: {
            media: {
                include: { genres: { include: { genre: true } } },
            },
        },
    });

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

export const PurchaseService = {
    createCheckoutSession,
    getMyPurchases,
    handleWebhookEvent,
    checkAccessBySession,
};
