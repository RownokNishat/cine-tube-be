import z from "zod";
export const createReviewSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
    content: z.string().min(5, "Content must be at least 5 characters").max(5000),
    isSpoiler: z.boolean().optional(),
    tags: z.array(z.string().max(50)).optional(),
});
export const updateReviewSchema = z.object({
    rating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(10, "Rating must be at most 10")
        .optional(),
    content: z.string().min(5, "Content must be at least 5 characters").max(5000).optional(),
    isSpoiler: z.boolean().optional(),
    tags: z.array(z.string().max(50)).optional(),
});
export const addCommentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(1000),
});
export const updateCommentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(1000),
});
//# sourceMappingURL=review.validation.js.map