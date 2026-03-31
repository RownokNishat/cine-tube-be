import z from "zod";
export declare const createContactMessageSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    subject: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=content.validation.d.ts.map