import { Router } from "express";
import { Role } from "../../../generated/enums.js";
import { checkAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { ReviewController } from "./review.controller.js";
import {
    createReviewSchema,
    updateReviewSchema,
    addCommentSchema,
    updateCommentSchema,
} from "./review.validation.js";

const router = Router();

// ==================== REVIEWS ====================

// GET /api/v1/reviews/media/:mediaId - list all published reviews for a media
router.get("/media/:mediaId", ReviewController.getMediaReviews);

// GET /api/v1/reviews/admin/media/:mediaId - admin review list with status filtering
router.get(
    "/admin/media/:mediaId",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.getMediaReviewsForAdmin,
);

// GET /api/v1/reviews/admin/stats - admin review counters and recent reviews
router.get(
    "/admin/stats",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.getAdminStats,
);

// POST /api/v1/reviews/media/:mediaId - create a review
router.post(
    "/media/:mediaId",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createReviewSchema),
    ReviewController.createReview,
);

// GET /api/v1/reviews/me - list current user's reviews with action permissions
router.get(
    "/me",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.getMyReviews,
);

// GET /api/v1/reviews/:reviewId/permissions - get current user's review action permissions
router.get(
    "/:reviewId/permissions",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.getReviewPermissions,
);

// GET /api/v1/reviews/:reviewId - get single review
router.get("/:reviewId", ReviewController.getReviewById);

// PATCH /api/v1/reviews/:reviewId - update own review (unpublished only)
router.patch(
    "/:reviewId",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateReviewSchema),
    ReviewController.updateReview,
);

// DELETE /api/v1/reviews/:reviewId - delete own review
router.delete(
    "/:reviewId",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.deleteReview,
);

// ==================== REVIEW LIKES ====================

// POST /api/v1/reviews/:reviewId/like - like a review
router.post(
    "/:reviewId/like",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.likeReview,
);

// DELETE /api/v1/reviews/:reviewId/like - unlike a review
router.delete(
    "/:reviewId/like",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.unlikeReview,
);

// ==================== REVIEW COMMENTS ====================

// GET /api/v1/reviews/:reviewId/comments - list comments for a review
router.get("/:reviewId/comments", ReviewController.getReviewComments);

// POST /api/v1/reviews/:reviewId/comments - add comment to review
router.post(
    "/:reviewId/comments",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(addCommentSchema),
    ReviewController.addComment,
);

// PATCH /api/v1/comments/:commentId - update own comment
router.patch(
    "/comments/:commentId",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateCommentSchema),
    ReviewController.updateComment,
);

// DELETE /api/v1/comments/:commentId - delete own comment
router.delete(
    "/comments/:commentId",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.deleteComment,
);

// ==================== COMMENT REPLIES ====================

// POST /api/v1/comments/:commentId/replies - reply to a comment
router.post(
    "/comments/:commentId/replies",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(addCommentSchema),
    ReviewController.replyToComment,
);

// ==================== COMMENT LIKES ====================

// POST /api/v1/comments/:commentId/like - like a comment
router.post(
    "/comments/:commentId/like",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.likeComment,
);

// DELETE /api/v1/comments/:commentId/like - unlike a comment
router.delete(
    "/comments/:commentId/like",
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.unlikeComment,
);

// ==================== ADMIN ROUTES ====================

// PATCH /api/v1/reviews/:reviewId/approve - approve pending review
router.patch(
    "/:reviewId/approve",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.approveReview,
);

// PATCH /api/v1/reviews/:reviewId/unpublish - unpublish review
router.patch(
    "/:reviewId/unpublish",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.unpublishReview,
);

// PATCH /api/v1/reviews/:reviewId/reject - reject pending review (alias to unpublish)
router.patch(
    "/:reviewId/reject",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.rejectReview,
);

// DELETE /api/v1/reviews/:reviewId/admin - admin delete review (inappropriate content)
router.delete(
    "/:reviewId/admin",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.deleteReviewAsAdmin,
);

// DELETE /api/v1/reviews/comments/:commentId/admin - admin delete comment
router.delete(
    "/comments/:commentId/admin",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.deleteCommentAsAdmin,
);

// GET /api/v1/reviews/media/:mediaId/stats - get aggregated review stats
router.get(
    "/media/:mediaId/stats",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    ReviewController.getMediaStats,
);

export const ReviewRoutes = router;
