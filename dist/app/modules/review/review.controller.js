import httpStatus from "http-status";
import { envVars } from "../../config/env.js";
import { CookieUtils } from "../../utils/cookie.js";
import { jwtUtils } from "../../utils/jwt.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { ReviewService } from "./review.service.js";
const resolveOptionalUserId = (req) => {
    if (req.user?.userId) {
        return req.user.userId;
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
        return undefined;
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success || !verifiedToken.data?.userId || typeof verifiedToken.data.userId !== "string") {
        return undefined;
    }
    return verifiedToken.data.userId;
};
// ==================== REVIEWS ====================
const createReview = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const mediaId = req.params.mediaId;
    const payload = req.body;
    const result = await ReviewService.createReview(userId, mediaId, payload);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});
const getMediaReviews = catchAsync(async (req, res) => {
    const mediaId = req.params.mediaId;
    const currentUserId = resolveOptionalUserId(req);
    const result = await ReviewService.getMediaReviews(mediaId, req.query, undefined, currentUserId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Reviews fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getMediaReviewsForAdmin = catchAsync(async (req, res) => {
    const mediaId = req.params.mediaId;
    const currentUserId = req.user.userId;
    const result = await ReviewService.getMediaReviews(mediaId, req.query, { allowStatusFilter: true }, currentUserId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Admin reviews fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getReviewById = catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId;
    const currentUserId = resolveOptionalUserId(req);
    const result = await ReviewService.getReviewById(reviewId, currentUserId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review fetched successfully",
        data: result,
    });
});
const getMyReviews = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await ReviewService.getMyReviews(userId, req.query);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "My reviews fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getAdminStats = catchAsync(async (_req, res) => {
    const result = await ReviewService.getAdminStats();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review stats fetched successfully",
        data: result,
    });
});
const getReviewPermissions = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.params.reviewId;
    const result = await ReviewService.getReviewPermissions(userId, reviewId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review permissions fetched successfully",
        data: result,
    });
});
const updateReview = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.params.reviewId;
    const payload = req.body;
    const result = await ReviewService.updateReview(userId, reviewId, payload);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});
const deleteReview = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.params.reviewId;
    await ReviewService.deleteReview(userId, reviewId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review deleted successfully",
    });
});
// ==================== REVIEW LIKES ====================
const likeReview = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.params.reviewId;
    const result = await ReviewService.likeReview(userId, reviewId);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Review liked",
        data: result,
    });
});
const unlikeReview = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.params.reviewId;
    const result = await ReviewService.unlikeReview(userId, reviewId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review unliked",
        data: result,
    });
});
// ==================== REVIEW COMMENTS ====================
const addComment = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.params.reviewId;
    const { content } = req.body;
    const result = await ReviewService.addComment(userId, reviewId, content);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Comment added successfully",
        data: result,
    });
});
const getReviewComments = catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId;
    const currentUserId = resolveOptionalUserId(req);
    const result = await ReviewService.getReviewComments(reviewId, req.query, currentUserId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Comments fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const updateComment = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
    const { content } = req.body;
    const result = await ReviewService.updateComment(userId, commentId, content);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Comment updated successfully",
        data: result,
    });
});
const deleteComment = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
    await ReviewService.deleteComment(userId, commentId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Comment deleted successfully",
    });
});
const replyToComment = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
    const { content } = req.body;
    const result = await ReviewService.replyToComment(userId, commentId, content);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Reply added successfully",
        data: result,
    });
});
// ==================== COMMENT LIKES ====================
const likeComment = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
    const result = await ReviewService.likeComment(userId, commentId);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Comment liked",
        data: result,
    });
});
const unlikeComment = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
    const result = await ReviewService.unlikeComment(userId, commentId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Comment unliked",
        data: result,
    });
});
// ==================== ADMIN ACTIONS ====================
const approveReview = catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId;
    const result = await ReviewService.approveReview(reviewId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review approved and published",
        data: result,
    });
});
const unpublishReview = catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId;
    const result = await ReviewService.unpublishReview(reviewId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review unpublished",
        data: result,
    });
});
const rejectReview = catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId;
    const result = await ReviewService.unpublishReview(reviewId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review rejected",
        data: result,
    });
});
const deleteReviewAsAdmin = catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId;
    await ReviewService.deleteReviewAsAdmin(reviewId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Review deleted by admin",
    });
});
const deleteCommentAsAdmin = catchAsync(async (req, res) => {
    const commentId = req.params.commentId;
    await ReviewService.deleteCommentAsAdmin(commentId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Comment deleted by admin",
    });
});
const getMediaStats = catchAsync(async (req, res) => {
    const mediaId = req.params.mediaId;
    const result = await ReviewService.getMediaStats(mediaId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Media stats retrieved",
        data: result,
    });
});
export const ReviewController = {
    createReview,
    getMediaReviews,
    getMediaReviewsForAdmin,
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
    rejectReview,
    deleteReviewAsAdmin,
    deleteCommentAsAdmin,
    getMediaStats,
    getAdminStats,
};
//# sourceMappingURL=review.controller.js.map