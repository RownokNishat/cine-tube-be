import { ReviewStatus } from "../../../generated/enums.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
interface ICreateReviewPayload {
    rating: number;
    content: string;
    isSpoiler?: boolean;
    tags?: string[];
}
interface IUpdateReviewPayload {
    rating?: number;
    content?: string;
    isSpoiler?: boolean;
    tags?: string[];
}
interface IReviewPermissions {
    canEdit: boolean;
    canDelete: boolean;
    reason: string | null;
}
export declare const ReviewService: {
    createReview: (userId: string, mediaId: string, payload: ICreateReviewPayload) => Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        };
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        status: ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mediaId: string;
        rating: number;
        content: string;
        isSpoiler: boolean;
        tags: string[];
    }>;
    getMediaReviews: (mediaId: string, queryParams: IQueryParams, options?: {
        allowStatusFilter?: boolean;
    }, currentUserId?: string) => Promise<{
        data: {
            likedByMe: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getReviewById: (reviewId: string, currentUserId?: string) => Promise<{
        permissions: IReviewPermissions | null;
        likedByMe: boolean;
    }>;
    getMyReviews: (userId: string, queryParams: IQueryParams) => Promise<{
        data: {
            permissions: IReviewPermissions;
            userId: string;
            status: ReviewStatus;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getReviewPermissions: (userId: string, reviewId: string) => Promise<{
        canEdit: boolean;
        canDelete: boolean;
        reason: string | null;
        reviewId: string;
        status: ReviewStatus;
    }>;
    updateReview: (userId: string, reviewId: string, payload: IUpdateReviewPayload) => Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        };
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        status: ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mediaId: string;
        rating: number;
        content: string;
        isSpoiler: boolean;
        tags: string[];
    }>;
    deleteReview: (userId: string, reviewId: string) => Promise<void>;
    likeReview: (userId: string, reviewId: string) => Promise<{
        liked: boolean;
    }>;
    unlikeReview: (userId: string, reviewId: string) => Promise<{
        liked: boolean;
    }>;
    addComment: (userId: string, reviewId: string, content: string) => Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        };
        _count: {
            likes: number;
            replies: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        reviewId: string;
        parentId: string | null;
    }>;
    getReviewComments: (reviewId: string, queryParams: IQueryParams, currentUserId?: string) => Promise<{
        data: {
            likedByMe: boolean;
            replies: {
                likedByMe: boolean;
            }[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateComment: (userId: string, commentId: string, content: string) => Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        };
        _count: {
            likes: number;
            replies: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        reviewId: string;
        parentId: string | null;
    }>;
    deleteComment: (userId: string, commentId: string) => Promise<void>;
    replyToComment: (userId: string, commentId: string, content: string) => Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        };
        _count: {
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        reviewId: string;
        parentId: string | null;
    }>;
    likeComment: (userId: string, commentId: string) => Promise<{
        liked: boolean;
    }>;
    unlikeComment: (userId: string, commentId: string) => Promise<{
        liked: boolean;
    }>;
    approveReview: (reviewId: string) => Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        };
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        status: ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mediaId: string;
        rating: number;
        content: string;
        isSpoiler: boolean;
        tags: string[];
    }>;
    unpublishReview: (reviewId: string) => Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            image: string | null;
        };
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        status: ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mediaId: string;
        rating: number;
        content: string;
        isSpoiler: boolean;
        tags: string[];
    }>;
    deleteReviewAsAdmin: (reviewId: string) => Promise<void>;
    deleteCommentAsAdmin: (commentId: string) => Promise<void>;
    getMediaStats: (mediaId: string) => Promise<{
        mediaId: string;
        title: string;
        totalReviews: number;
        averageRating: number;
        ratingDistribution: {
            "1": number;
            "2": number;
            "3": number;
            "4": number;
            "5": number;
            "6": number;
            "7": number;
            "8": number;
            "9": number;
            "10": number;
        };
        pendingReviewsCount: number;
        pendingReviews: {
            user: {
                name: string;
                id: string;
                image: string | null;
            };
            status: ReviewStatus;
            id: string;
            createdAt: Date;
            rating: number;
            content: string;
            isSpoiler: boolean;
            tags: string[];
        }[];
    }>;
    getAdminStats: () => Promise<{
        totalReviews: number;
        pendingReviewsCount: number;
        recentReviews: {
            user: {
                name: string;
                id: string;
                image: string | null;
            };
            status: ReviewStatus;
            id: string;
            createdAt: Date;
            media: {
                id: string;
                title: string;
            };
            rating: number;
            content: string;
        }[];
    }>;
};
export {};
//# sourceMappingURL=review.service.d.ts.map