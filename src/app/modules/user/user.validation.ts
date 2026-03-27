import z from "zod";

export const createAdminZodSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters"),
    role: z.enum(["ADMIN", "SUPER_ADMIN"], { error: "Role must be ADMIN or SUPER_ADMIN" }),
});
