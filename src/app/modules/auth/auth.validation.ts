import z from "zod";

const strongPasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/\p{Lu}/u, "Password must contain at least one uppercase letter")
    .regex(/\p{Nd}/u, "Password must contain at least one number")
    .regex(/[\p{P}\p{S}]/u, "Password must contain at least one special character");

export const registerUserZodSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: strongPasswordSchema,
});

export const loginUserZodSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const changePasswordZodSchema = z.object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
    newPassword: strongPasswordSchema,
});

export const forgetPasswordZodSchema = z.object({
    email: z.email("Invalid email address"),
});

export const verifyEmailZodSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordZodSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: strongPasswordSchema,
});
