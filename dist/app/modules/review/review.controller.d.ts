import { Request, Response } from "express";
export declare const ReviewController: {
    createReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMediaReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMediaReviewsForAdmin: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getReviewById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getReviewPermissions: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    likeReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    unlikeReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    addComment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getReviewComments: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateComment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteComment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    replyToComment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    likeComment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    unlikeComment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    approveReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    unpublishReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    rejectReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteReviewAsAdmin: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteCommentAsAdmin: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMediaStats: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAdminStats: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=review.controller.d.ts.map