import Stripe from "stripe";
import { PricingType } from "../../../generated/enums.js";
export declare const PurchaseService: {
    createCheckoutSession: (userId: string, mediaId: string) => Promise<{
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
            stripeSessionId: string;
            stripePaymentId: string | null;
            amount: number;
            currency: string;
        };
        debug?: never;
    }>;
    getDashboardAnalytics: () => Promise<{
        paymentCount: number;
        userCount: number;
        totalRevenue: number;
        barChartData: {
            month: string;
            count: number;
        }[];
        pieChartData: {
            status: string;
            count: number;
        }[];
    }>;
};
//# sourceMappingURL=purchase.service.d.ts.map