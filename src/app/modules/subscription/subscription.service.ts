import httpStatus from "http-status";
import { stripe } from "../../config/stripe.config.js";
import { envVars } from "../../config/env.js";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { SubscriptionPlan, SubscriptionStatus } from "../../../generated/enums.js";

const PLAN_CONFIG: Record<SubscriptionPlan, { amount: number; durationDays: number; label: string }> = {
    FREE: { amount: 0, durationDays: 0, label: "Free" },
    MONTHLY: { amount: 9.99, durationDays: 30, label: "Monthly" },
    YEARLY: { amount: 99.99, durationDays: 365, label: "Yearly" },
};

const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
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

const getSubscriptionPlans = async () => {
    return [
        {
            plan: SubscriptionPlan.FREE,
            price: PLAN_CONFIG.FREE.amount,
            amount: PLAN_CONFIG.FREE.amount,
            duration: "Lifetime",
            durationDays: PLAN_CONFIG.FREE.durationDays,
            label: PLAN_CONFIG.FREE.label,
            currency: "usd",
            features: PLAN_FEATURES.FREE,
        },
        {
            plan: SubscriptionPlan.MONTHLY,
            price: PLAN_CONFIG.MONTHLY.amount,
            amount: PLAN_CONFIG.MONTHLY.amount,
            duration: "30 days",
            durationDays: PLAN_CONFIG.MONTHLY.durationDays,
            label: PLAN_CONFIG.MONTHLY.label,
            currency: "usd",
            features: PLAN_FEATURES.MONTHLY,
        },
        {
            plan: SubscriptionPlan.YEARLY,
            price: PLAN_CONFIG.YEARLY.amount,
            amount: PLAN_CONFIG.YEARLY.amount,
            duration: "365 days",
            durationDays: PLAN_CONFIG.YEARLY.durationDays,
            label: PLAN_CONFIG.YEARLY.label,
            currency: "usd",
            features: PLAN_FEATURES.YEARLY,
        },
    ];
};

const getMySubscription = async (userId: string) => {
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

const createCheckoutSession = async (userId: string, plan: "MONTHLY" | "YEARLY") => {
    if (plan !== SubscriptionPlan.MONTHLY && plan !== SubscriptionPlan.YEARLY) {
        throw new AppError(httpStatus.BAD_REQUEST, "Only MONTHLY or YEARLY plans are allowed for checkout");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const config = PLAN_CONFIG[plan as SubscriptionPlan];
    const amountInCents = Math.round(config.amount * 100);

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
            amount: String(config.amount),
        },
        success_url: `${envVars.FRONTEND_URL}/dashboard/subscriptions?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envVars.FRONTEND_URL}/dashboard/subscriptions?canceled=true`,
    });

    return { checkoutUrl: session.url, sessionId: session.id };
};

const cancelSubscription = async (userId: string) => {
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
    getMySubscription,
    createCheckoutSession,
    cancelSubscription,
};
