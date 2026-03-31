export declare const Role: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
    readonly SUPER_ADMIN: "SUPER_ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly BLOCKED: "BLOCKED";
    readonly DELETED: "DELETED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const MediaType: {
    readonly MOVIE: "MOVIE";
    readonly SERIES: "SERIES";
};
export type MediaType = (typeof MediaType)[keyof typeof MediaType];
export declare const MediaStatus: {
    readonly DRAFT: "DRAFT";
    readonly PUBLISHED: "PUBLISHED";
};
export type MediaStatus = (typeof MediaStatus)[keyof typeof MediaStatus];
export declare const PricingType: {
    readonly FREE: "FREE";
    readonly PREMIUM: "PREMIUM";
};
export type PricingType = (typeof PricingType)[keyof typeof PricingType];
export declare const ReviewStatus: {
    readonly PENDING: "PENDING";
    readonly PUBLISHED: "PUBLISHED";
    readonly UNPUBLISHED: "UNPUBLISHED";
};
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];
export declare const SubscriptionPlan: {
    readonly FREE: "FREE";
    readonly MONTHLY: "MONTHLY";
    readonly YEARLY: "YEARLY";
};
export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];
export declare const SubscriptionStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly EXPIRED: "EXPIRED";
    readonly CANCELLED: "CANCELLED";
};
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
export declare const PurchaseStatus: {
    readonly PENDING: "PENDING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
    readonly RENTAL_EXPIRED: "RENTAL_EXPIRED";
};
export type PurchaseStatus = (typeof PurchaseStatus)[keyof typeof PurchaseStatus];
export declare const PurchaseType: {
    readonly PURCHASE: "PURCHASE";
    readonly RENTAL: "RENTAL";
};
export type PurchaseType = (typeof PurchaseType)[keyof typeof PurchaseType];
//# sourceMappingURL=enums.d.ts.map