import z from "zod";
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    content: z.ZodString;
    isSpoiler: z.ZodOptional<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const updateReviewSchema: z.ZodObject<{
    rating: z.ZodOptional<z.ZodNumber>;
    content: z.ZodOptional<z.ZodString>;
    isSpoiler: z.ZodOptional<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const addCommentSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export declare const updateCommentSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=review.validation.d.ts.map