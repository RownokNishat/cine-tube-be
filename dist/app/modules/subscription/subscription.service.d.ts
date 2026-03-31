import { SubscriptionPlan, SubscriptionStatus } from "../../../generated/enums.js";
export declare const SubscriptionService: {
    getSubscriptionPlans: () => Promise<({
        currency: string;
        amount: number;
        durationDays: number;
        label: string;
        plan: "FREE";
    } | {
        currency: string;
        amount: number;
        durationDays: number;
        label: string;
        plan: "MONTHLY";
    } | {
        currency: string;
        amount: number;
        durationDays: number;
        label: string;
        plan: "YEARLY";
    })[]>;
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
    cancelSubscription: (userId: string) => Promise<null>;
};
//# sourceMappingURL=subscription.service.d.ts.map