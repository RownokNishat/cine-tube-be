import { SubscriptionPlan, SubscriptionStatus } from "../../../generated/enums.js";
export declare const SubscriptionService: {
    getSubscriptionPlans: () => Promise<{
        plan: SubscriptionPlan;
        price: number;
        amount: number;
        duration: string;
        durationDays: number;
        label: string;
        currency: string;
        features: string[];
        isActive: boolean;
    }[]>;
    updateSubscriptionPlan: (plan: "FREE" | "MONTHLY" | "YEARLY", payload: {
        label?: string;
        price?: number;
        durationDays?: number;
        features?: string[];
        isActive?: boolean;
    }) => Promise<{
        plan: SubscriptionPlan;
        price: number;
        amount: number;
        duration: string;
        durationDays: number;
        label: string;
        currency: string;
        features: string[];
        isActive: boolean;
    }>;
    getMySubscription: (userId: string) => Promise<{
        plan: "FREE";
        status: "ACTIVE";
        startDate: null;
        endDate: null;
        amount: number;
        currency: string;
    } | {
        currency: string;
        status: SubscriptionStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        stripePaymentId: string | null;
        amount: number | null;
        plan: SubscriptionPlan;
        startDate: Date;
        endDate: Date | null;
        stripeCustomerId: string | null;
    }>;
    createCheckoutSession: (userId: string, plan: "MONTHLY" | "YEARLY") => Promise<{
        checkoutUrl: string | null;
        sessionId: string;
    }>;
    verifyCheckoutSession: (userId: string, sessionId: string) => Promise<{
        verified: boolean;
        paymentStatus: "no_payment_required" | "unpaid";
        subscription?: never;
    } | {
        verified: boolean;
        paymentStatus: "paid";
        subscription: {
            status: SubscriptionStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            stripePaymentId: string | null;
            amount: number | null;
            plan: SubscriptionPlan;
            startDate: Date;
            endDate: Date | null;
            stripeCustomerId: string | null;
        };
    }>;
    cancelSubscription: (userId: string) => Promise<null>;
};
//# sourceMappingURL=subscription.service.d.ts.map