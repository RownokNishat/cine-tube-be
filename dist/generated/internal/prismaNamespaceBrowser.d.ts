import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Session: "Session";
    readonly Account: "Account";
    readonly Verification: "Verification";
    readonly UserProfile: "UserProfile";
    readonly AdminProfile: "AdminProfile";
    readonly Genre: "Genre";
    readonly Media: "Media";
    readonly MediaGenre: "MediaGenre";
    readonly Review: "Review";
    readonly ReviewLike: "ReviewLike";
    readonly ReviewComment: "ReviewComment";
    readonly CommentLike: "CommentLike";
    readonly Watchlist: "Watchlist";
    readonly ContactMessage: "ContactMessage";
    readonly Purchase: "Purchase";
    readonly Subscription: "Subscription";
    readonly SubscriptionPlanSetting: "SubscriptionPlanSetting";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly emailVerified: "emailVerified";
    readonly role: "role";
    readonly status: "status";
    readonly needPasswordChange: "needPasswordChange";
    readonly isDeleted: "isDeleted";
    readonly deletedAt: "deletedAt";
    readonly image: "image";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: "id";
    readonly expiresAt: "expiresAt";
    readonly token: "token";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly ipAddress: "ipAddress";
    readonly userAgent: "userAgent";
    readonly userId: "userId";
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly id: "id";
    readonly accountId: "accountId";
    readonly providerId: "providerId";
    readonly userId: "userId";
    readonly accessToken: "accessToken";
    readonly refreshToken: "refreshToken";
    readonly idToken: "idToken";
    readonly accessTokenExpiresAt: "accessTokenExpiresAt";
    readonly refreshTokenExpiresAt: "refreshTokenExpiresAt";
    readonly scope: "scope";
    readonly password: "password";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const VerificationScalarFieldEnum: {
    readonly id: "id";
    readonly identifier: "identifier";
    readonly value: "value";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum];
export declare const UserProfileScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly bio: "bio";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum];
export declare const AdminProfileScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AdminProfileScalarFieldEnum = (typeof AdminProfileScalarFieldEnum)[keyof typeof AdminProfileScalarFieldEnum];
export declare const GenreScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type GenreScalarFieldEnum = (typeof GenreScalarFieldEnum)[keyof typeof GenreScalarFieldEnum];
export declare const MediaScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly synopsis: "synopsis";
    readonly releaseYear: "releaseYear";
    readonly director: "director";
    readonly cast: "cast";
    readonly streamingPlatform: "streamingPlatform";
    readonly pricingType: "pricingType";
    readonly price: "price";
    readonly streamingLink: "streamingLink";
    readonly posterUrl: "posterUrl";
    readonly trailerUrl: "trailerUrl";
    readonly isFeatured: "isFeatured";
    readonly isEditorPick: "isEditorPick";
    readonly mediaType: "mediaType";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MediaScalarFieldEnum = (typeof MediaScalarFieldEnum)[keyof typeof MediaScalarFieldEnum];
export declare const MediaGenreScalarFieldEnum: {
    readonly mediaId: "mediaId";
    readonly genreId: "genreId";
};
export type MediaGenreScalarFieldEnum = (typeof MediaGenreScalarFieldEnum)[keyof typeof MediaGenreScalarFieldEnum];
export declare const ReviewScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly mediaId: "mediaId";
    readonly rating: "rating";
    readonly content: "content";
    readonly isSpoiler: "isSpoiler";
    readonly tags: "tags";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum];
export declare const ReviewLikeScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly reviewId: "reviewId";
    readonly createdAt: "createdAt";
};
export type ReviewLikeScalarFieldEnum = (typeof ReviewLikeScalarFieldEnum)[keyof typeof ReviewLikeScalarFieldEnum];
export declare const ReviewCommentScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly reviewId: "reviewId";
    readonly content: "content";
    readonly parentId: "parentId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ReviewCommentScalarFieldEnum = (typeof ReviewCommentScalarFieldEnum)[keyof typeof ReviewCommentScalarFieldEnum];
export declare const CommentLikeScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly commentId: "commentId";
    readonly createdAt: "createdAt";
};
export type CommentLikeScalarFieldEnum = (typeof CommentLikeScalarFieldEnum)[keyof typeof CommentLikeScalarFieldEnum];
export declare const WatchlistScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly mediaId: "mediaId";
    readonly createdAt: "createdAt";
};
export type WatchlistScalarFieldEnum = (typeof WatchlistScalarFieldEnum)[keyof typeof WatchlistScalarFieldEnum];
export declare const ContactMessageScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly subject: "subject";
    readonly message: "message";
    readonly isRead: "isRead";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ContactMessageScalarFieldEnum = (typeof ContactMessageScalarFieldEnum)[keyof typeof ContactMessageScalarFieldEnum];
export declare const PurchaseScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly mediaId: "mediaId";
    readonly stripeSessionId: "stripeSessionId";
    readonly stripePaymentId: "stripePaymentId";
    readonly amount: "amount";
    readonly currency: "currency";
    readonly status: "status";
    readonly purchaseType: "purchaseType";
    readonly rentalDays: "rentalDays";
    readonly rentalExpiresAt: "rentalExpiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PurchaseScalarFieldEnum = (typeof PurchaseScalarFieldEnum)[keyof typeof PurchaseScalarFieldEnum];
export declare const SubscriptionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly plan: "plan";
    readonly status: "status";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly stripeCustomerId: "stripeCustomerId";
    readonly stripePaymentId: "stripePaymentId";
    readonly amount: "amount";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum];
export declare const SubscriptionPlanSettingScalarFieldEnum: {
    readonly id: "id";
    readonly plan: "plan";
    readonly label: "label";
    readonly price: "price";
    readonly durationDays: "durationDays";
    readonly currency: "currency";
    readonly features: "features";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubscriptionPlanSettingScalarFieldEnum = (typeof SubscriptionPlanSettingScalarFieldEnum)[keyof typeof SubscriptionPlanSettingScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map