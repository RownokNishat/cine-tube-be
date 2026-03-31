import Stripe from "stripe";
import { PricingType, SubscriptionPlan, SubscriptionStatus, PurchaseType } from "../../../generated/enums.js";
export declare const PurchaseService: {
    createCheckoutSession: (userId: string, mediaId: string, purchaseType?: "PURCHASE" | "RENTAL", rentalDays?: number) => Promise<{
        checkoutUrl: string | null;
        sessionId: string;
    }>;
    getMyPurchases: (userId: string) => Promise<{
        id: string;
        amount: number;
        currency: string;
        purchasedAt: Date;
        media: {
            genres: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            status: import("../../../generated/enums.js").MediaStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            synopsis: string;
            releaseYear: number;
            director: string;
            cast: string[];
            streamingPlatform: string[];
            pricingType: PricingType;
            price: number | null;
            streamingLink: string | null;
            posterUrl: string | null;
            trailerUrl: string | null;
            isFeatured: boolean;
            isEditorPick: boolean;
            mediaType: import("../../../generated/enums.js").MediaType;
        };
    }[]>;
    handleWebhookEvent: (event: Stripe.Event) => Promise<void>;
    checkAccessBySession: (sessionId: string) => Promise<{
        hasAccess: boolean;
        purchase: null;
        debug: string;
    } | {
        hasAccess: boolean;
        purchase: null;
        debug?: never;
    } | {
        hasAccess: boolean;
        purchase: {
            media: {
                genres: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                }[];
                status: import("../../../generated/enums.js").MediaStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                synopsis: string;
                releaseYear: number;
                director: string;
                cast: string[];
                streamingPlatform: string[];
                pricingType: PricingType;
                price: number | null;
                streamingLink: string | null;
                posterUrl: string | null;
                trailerUrl: string | null;
                isFeatured: boolean;
                isEditorPick: boolean;
                mediaType: import("../../../generated/enums.js").MediaType;
            };
            status: import("../../../generated/enums.js").PurchaseStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            mediaId: string;
            purchaseType: PurchaseType;
            rentalDays: number | null;
            stripeSessionId: string;
            stripePaymentId: string | null;
            amount: number;
            currency: string;
            rentalExpiresAt: Date | null;
        };
        debug?: never;
    }>;
    getDashboardAnalytics: (periodDays?: number) => Promise<{
        overview: {
            periodDays: number;
            paymentCount: number;
            userCount: number;
            purchaseRevenue: number;
            subscriptionRevenue: number;
            rentalRevenue: number;
            totalRevenue: number;
        };
        barChartData: {
            revenue: number;
            count: number;
            day: string;
        }[];
        topMedia: {
            mediaId: string;
            title: string;
            purchases: number;
            revenue: number;
        }[];
        purchaseStatusBreakdown: {
            status: import("../../../generated/enums.js").PurchaseStatus;
            count: number;
        }[];
        subscriptionStatusBreakdown: {
            status: SubscriptionStatus;
            count: number;
        }[];
    }>;
    getPaymentTransactions: ({ page, limit }: {
        page?: number;
        limit?: number;
    }) => Promise<{
        data: ({
            id: string;
            type: string;
            status: import("../../../generated/enums.js").PurchaseStatus;
            amount: number;
            currency: string;
            createdAt: Date;
            user: {
                name: string;
                id: string;
                email: string;
            };
            media: {
                id: string;
                title: string;
            };
            purchaseType: PurchaseType;
        } | {
            id: string;
            type: string;
            status: SubscriptionStatus;
            amount: number | null;
            currency: string;
            createdAt: Date;
            user: {
                name: string;
                id: string;
                email: string;
            };
            plan: SubscriptionPlan;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
};
//# sourceMappingURL=purchase.service.d.ts.map