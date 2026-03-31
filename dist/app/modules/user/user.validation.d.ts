import z from "zod";
export declare const createAdminZodSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
    }>;
}, z.core.$strip>;
export declare const updateMeZodSchema: z.ZodObject<{
    name: z.ZodString;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=user.validation.d.ts.map