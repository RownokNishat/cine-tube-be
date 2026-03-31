import z from "zod";
export declare const registerUserZodSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginUserZodSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const changePasswordZodSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export declare const forgetPasswordZodSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
export declare const verifyEmailZodSchema: z.ZodObject<{
    email: z.ZodEmail;
    otp: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordZodSchema: z.ZodObject<{
    email: z.ZodEmail;
    otp: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=auth.validation.d.ts.map