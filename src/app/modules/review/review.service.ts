import httpStatus from "http-status";
import { ReviewStatus } from "../../../generated/enums.js";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";

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

const getReviewPermissionsForUser = (review: { userId: string; status: ReviewStatus }, userId: string): IReviewPermissions => {
    if (review.userId !== userId) {
        return {
            canEdit: false,
            canDelete: false,
            reason: "You can only manage your own reviews",
        };
    }

    if (review.status === ReviewStatus.PUBLISHED) {
        return {
            canEdit: false,
            canDelete: false,
            reason: "Published reviews cannot be edited or deleted by users",
        };
    }

    return {
        canEdit: true,
        canDelete: true,
        reason: null,
    };
};

const attachLikedByMeToReviews = async (
    reviews: Record<string, unknown>[],
    currentUserId?: string,
) => {
    if (!currentUserId || reviews.length === 0) {
        return reviews.map((review) => ({ ...review, likedByMe: false }));
    }

    const reviewIds = reviews.map((review) => String(review.id));
    const likes = await prisma.reviewLike.findMany({
        where: {
            userId: currentUserId,
            reviewId: { in: reviewIds },
        },
        select: { reviewId: true },
    });

    const likedReviewIds = new Set(likes.map((like) => like.reviewId));
    return reviews.map((review) => ({
        ...review,
        likedByMe: likedReviewIds.has(String(review.id)),
    }));
};

const attachLikedByMeToComments = async (
    comments: Record<string, unknown>[],
    currentUserId?: string,
) => {
    if (!currentUserId || comments.length === 0) {
        return comments.map((comment) => ({
            ...comment,
            likedByMe: false,
            replies: Array.isArray(comment.replies)
                ? (comment.replies as Record<string, unknown>[]).map((reply) => ({ ...reply, likedByMe: false }))
                : [],
        }));
    }

    const topLevelIds = comments.map((comment) => String(comment.id));
    const replyIds = comments.flatMap((comment) =>
        Array.isArray(comment.replies)
            ? (comment.replies as Record<string, unknown>[]).map((reply) => String(reply.id))
            : [],
    );

    const allCommentIds = [...topLevelIds, ...replyIds];
    const likes = await prisma.commentLike.findMany({
        where: {
            userId: currentUserId,
            commentId: { in: allCommentIds },
        },
        select: { commentId: true },
    });

    const likedCommentIds = new Set(likes.map((like) => like.commentId));

    return comments.map((comment) => ({
        ...comment,
        likedByMe: likedCommentIds.has(String(comment.id)),
        replies: Array.isArray(comment.replies)
            ? (comment.replies as Record<string, unknown>[]).map((reply) => ({
                  ...reply,
                  likedByMe: likedCommentIds.has(String(reply.id)),
              }))
            : [],
    }));
};

// ==================== REVIEWS ====================

const createReview = async (userId: string, mediaId: string, payload: ICreateReviewPayload) => {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) {
        throw new AppError(httpStatus.NOT_FOUND, "Media not found");
    }

    const existingReview = await prisma.review.findUnique({
        where: { userId_mediaId: { userId, mediaId } },
    });
    if (existingReview) {
        throw new AppError(httpStatus.CONFLICT, "You have already reviewed this media");
    }

    if (payload.rating < 1 || payload.rating > 10) {
        throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 10");
    }

    const review = await prisma.review.create({
        data: {
            userId,
            mediaId,
            rating: payload.rating,
            content: payload.content,
            isSpoiler: payload.isSpoiler ?? false,
            tags: payload.tags ?? [],
            status: ReviewStatus.PENDING,
        },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true, comments: true },
            },
        },
    });

    return review;
};

const getMediaReviews = async (
    mediaId: string,
    queryParams: IQueryParams,
    options?: { allowStatusFilter?: boolean },
    currentUserId?: string,
) => {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) {
        throw new AppError(httpStatus.NOT_FOUND, "Media not found");
    }

    const allowStatusFilter = options?.allowStatusFilter === true;
    const requestedStatus = typeof queryParams.status === "string" ? queryParams.status.toUpperCase() : undefined;
    const normalizedStatus =
        requestedStatus === ReviewStatus.PENDING ||
        requestedStatus === ReviewStatus.PUBLISHED ||
        requestedStatus === ReviewStatus.UNPUBLISHED
            ? requestedStatus
            : undefined;

    const baseWhere = allowStatusFilter
        ? { mediaId }
        : { mediaId, status: ReviewStatus.PUBLISHED };

    const builder = new QueryBuilder(prisma.review, queryParams, {
        searchableFields: ["content"],
        filterableFields: ["rating", "isSpoiler", ...(allowStatusFilter ? ["status"] : [])],
    });

    const result = await builder
        .search()
        .filter()
        .where(allowStatusFilter && normalizedStatus ? { status: normalizedStatus } : {})
        .where(baseWhere)
        .sort()
        .paginate()
        .include({
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true, comments: true },
            },
        })
        .execute();

    return {
        data: await attachLikedByMeToReviews(result.data as Record<string, unknown>[], currentUserId),
        meta: result.meta,
    };
};

const getReviewById = async (reviewId: string, currentUserId?: string) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true, comments: true },
            },
        },
    });

    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    const [decoratedReview] = await attachLikedByMeToReviews(
        [review as unknown as Record<string, unknown>],
        currentUserId,
    );

    const permissions =
        currentUserId && review.userId === currentUserId
            ? getReviewPermissionsForUser(review, currentUserId)
            : null;

    const baseReview = decoratedReview ?? { ...(review as unknown as Record<string, unknown>), likedByMe: false };
    return {
        ...baseReview,
        permissions,
    };
};

const updateReview = async (userId: string, reviewId: string, payload: IUpdateReviewPayload) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    if (review.userId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only update your own review");
    }

    if (review.status === ReviewStatus.PUBLISHED) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can only edit unpublished reviews");
    }

    if (payload.rating && (payload.rating < 1 || payload.rating > 10)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 10");
    }

    const updated = await prisma.review.update({
        where: { id: reviewId },
        data: {
            ...(payload.rating !== undefined && { rating: payload.rating }),
            ...(payload.content !== undefined && { content: payload.content }),
            ...(payload.isSpoiler !== undefined && { isSpoiler: payload.isSpoiler }),
            ...(payload.tags !== undefined && { tags: payload.tags }),
        },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true, comments: true },
            },
        },
    });

    return updated;
};

const deleteReview = async (userId: string, reviewId: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    if (review.userId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own review");
    }

    if (review.status === ReviewStatus.PUBLISHED) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can only delete unpublished reviews");
    }

    await prisma.review.delete({ where: { id: reviewId } });
};

const getReviewPermissions = async (userId: string, reviewId: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    return {
        reviewId,
        status: review.status,
        ...getReviewPermissionsForUser(review, userId),
    };
};

const getMyReviews = async (userId: string, queryParams: IQueryParams) => {
    const builder = new QueryBuilder(prisma.review, queryParams, {
        searchableFields: ["content"],
        filterableFields: ["status", "mediaId", "rating"],
    });

    const result = await builder
        .search()
        .filter()
        .where({ userId })
        .sort()
        .paginate()
        .include({
            media: {
                select: {
                    id: true,
                    title: true,
                    posterUrl: true,
                    releaseYear: true,
                    mediaType: true,
                },
            },
            _count: {
                select: { likes: true, comments: true },
            },
        })
        .execute();

    const dataWithPermissions = (result.data as Array<Record<string, unknown> & { userId: string; status: ReviewStatus }>).map(
        (review) => ({
            ...review,
            permissions: getReviewPermissionsForUser(review, userId),
        }),
    );

    return {
        data: dataWithPermissions,
        meta: result.meta,
    };
};

// ==================== REVIEW LIKES ====================

const likeReview = async (userId: string, reviewId: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    const existingLike = await prisma.reviewLike.findUnique({
        where: { userId_reviewId: { userId, reviewId } },
    });
    if (existingLike) {
        throw new AppError(httpStatus.CONFLICT, "You have already liked this review");
    }

    await prisma.reviewLike.create({
        data: { userId, reviewId },
    });

    return { liked: true };
};

const unlikeReview = async (userId: string, reviewId: string) => {
    const like = await prisma.reviewLike.findUnique({
        where: { userId_reviewId: { userId, reviewId } },
    });
    if (!like) {
        throw new AppError(httpStatus.NOT_FOUND, "You have not liked this review");
    }

    await prisma.reviewLike.delete({
        where: { userId_reviewId: { userId, reviewId } },
    });

    return { liked: false };
};

// ==================== REVIEW COMMENTS ====================

const addComment = async (userId: string, reviewId: string, content: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    const comment = await prisma.reviewComment.create({
        data: { userId, reviewId, content },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true, replies: true },
            },
        },
    });

    return comment;
};

const getReviewComments = async (reviewId: string, queryParams: IQueryParams, currentUserId?: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    const builder = new QueryBuilder(
        prisma.reviewComment as unknown as {
            findMany: (args?: unknown) => Promise<unknown[]>;
            count: (args?: unknown) => Promise<number>;
        },
        queryParams,
        {
            searchableFields: ["content"],
            filterableFields: [],
        },
    );

    const result = await builder
        .search()
        .where({ reviewId, parentId: null }) // Only top-level comments
        .sort()
        .paginate()
        .include({
            user: {
                select: { id: true, name: true, image: true },
            },
            replies: {
                orderBy: { createdAt: "asc" },
                include: {
                    user: {
                        select: { id: true, name: true, image: true },
                    },
                    _count: {
                        select: { likes: true, replies: true },
                    },
                },
            },
            _count: {
                select: { likes: true, replies: true },
            },
        })
        .execute();

    return {
        data: await attachLikedByMeToComments(result.data as Record<string, unknown>[], currentUserId),
        meta: result.meta,
    };
};

const updateComment = async (userId: string, commentId: string, content: string) => {
    const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }

    if (comment.userId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only edit your own comment");
    }

    const updated = await prisma.reviewComment.update({
        where: { id: commentId },
        data: { content },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true, replies: true },
            },
        },
    });

    return updated;
};

const deleteComment = async (userId: string, commentId: string) => {
    const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }

    if (comment.userId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own comment");
    }

    // Delete all nested replies and their likes
    await prisma.commentLike.deleteMany({
        where: {
            comment: {
                parentId: commentId,
            },
        },
    });

    await prisma.reviewComment.deleteMany({
        where: { parentId: commentId },
    });

    // Delete the comment's own likes
    await prisma.commentLike.deleteMany({
        where: { commentId },
    });

    await prisma.reviewComment.delete({ where: { id: commentId } });
};

const replyToComment = async (userId: string, commentId: string, content: string) => {
    const parentComment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
    if (!parentComment) {
        throw new AppError(httpStatus.NOT_FOUND, "Parent comment not found");
    }

    const reply = await prisma.reviewComment.create({
        data: {
            userId,
            reviewId: parentComment.reviewId,
            content,
            parentId: commentId,
        },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true },
            },
        },
    });

    return reply;
};

// ==================== COMMENT LIKES ====================

const likeComment = async (userId: string, commentId: string) => {
    const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }

    const existingLike = await prisma.commentLike.findUnique({
        where: { userId_commentId: { userId, commentId } },
    });
    if (existingLike) {
        throw new AppError(httpStatus.CONFLICT, "You have already liked this comment");
    }

    await prisma.commentLike.create({
        data: { userId, commentId },
    });

    return { liked: true };
};

const unlikeComment = async (userId: string, commentId: string) => {
    const like = await prisma.commentLike.findUnique({
        where: { userId_commentId: { userId, commentId } },
    });
    if (!like) {
        throw new AppError(httpStatus.NOT_FOUND, "You have not liked this comment");
    }

    await prisma.commentLike.delete({
        where: { userId_commentId: { userId, commentId } },
    });

    return { liked: false };
};

// ==================== ADMIN ACTIONS ====================

const approveReview = async (reviewId: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    return await prisma.review.update({
        where: { id: reviewId },
        data: { status: ReviewStatus.PUBLISHED },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true, comments: true },
            },
        },
    });
};

const unpublishReview = async (reviewId: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    return await prisma.review.update({
        where: { id: reviewId },
        data: { status: ReviewStatus.UNPUBLISHED },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            _count: {
                select: { likes: true, comments: true },
            },
        },
    });
};

const deleteReviewAsAdmin = async (reviewId: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    // Cascade delete: likes, comments and their likes
    await prisma.commentLike.deleteMany({
        where: {
            comment: {
                reviewId,
            },
        },
    });

    await prisma.reviewComment.deleteMany({ where: { reviewId } });
    await prisma.reviewLike.deleteMany({ where: { reviewId } });
    await prisma.review.delete({ where: { id: reviewId } });
};

const deleteCommentAsAdmin = async (commentId: string) => {
    const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }

    // Delete all nested replies and their likes
    await prisma.commentLike.deleteMany({
        where: {
            comment: {
                parentId: commentId,
            },
        },
    });

    await prisma.reviewComment.deleteMany({ where: { parentId: commentId } });
    await prisma.commentLike.deleteMany({ where: { commentId } });
    await prisma.reviewComment.delete({ where: { id: commentId } });
};

const getMediaStats = async (mediaId: string) => {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) {
        throw new AppError(httpStatus.NOT_FOUND, "Media not found");
    }

    const reviews = await prisma.review.findMany({
        where: { mediaId, status: ReviewStatus.PUBLISHED },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? Math.round(
              (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10,
          ) / 10
        : 0;

    const ratingDistribution = {
        "1": reviews.filter((r) => r.rating === 1).length,
        "2": reviews.filter((r) => r.rating === 2).length,
        "3": reviews.filter((r) => r.rating === 3).length,
        "4": reviews.filter((r) => r.rating === 4).length,
        "5": reviews.filter((r) => r.rating === 5).length,
        "6": reviews.filter((r) => r.rating === 6).length,
        "7": reviews.filter((r) => r.rating === 7).length,
        "8": reviews.filter((r) => r.rating === 8).length,
        "9": reviews.filter((r) => r.rating === 9).length,
        "10": reviews.filter((r) => r.rating === 10).length,
    };

    const pendingReviews = await prisma.review.findMany({
        where: { mediaId, status: ReviewStatus.PENDING },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            rating: true,
            content: true,
            isSpoiler: true,
            tags: true,
            status: true,
            createdAt: true,
            user: { select: { id: true, name: true, image: true } },
        },
    });

    return {
        mediaId,
        title: media.title,
        totalReviews,
        averageRating,
        ratingDistribution,
        pendingReviewsCount: pendingReviews.length,
        pendingReviews,
    };
};

const getAdminStats = async () => {
    const [totalReviews, pendingReviewsCount, recentReviews] = await Promise.all([
        prisma.review.count(),
        prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
        prisma.review.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                content: true,
                rating: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                media: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        }),
    ]);

    return {
        totalReviews,
        pendingReviewsCount,
        recentReviews,
    };
};

export const ReviewService = {
    // User actions
    createReview,
    getMediaReviews,
    getReviewById,
    getMyReviews,
    getReviewPermissions,
    updateReview,
    deleteReview,
    likeReview,
    unlikeReview,
    addComment,
    getReviewComments,
    updateComment,
    deleteComment,
    replyToComment,
    likeComment,
    unlikeComment,
    // Admin actions
    approveReview,
    unpublishReview,
    deleteReviewAsAdmin,
    deleteCommentAsAdmin,
    getMediaStats,
    getAdminStats,
};
