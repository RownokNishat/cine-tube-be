import z from "zod";

export const updateSubscriptionPlanSchema = z.object({
    label: z.string().min(2).max(50).optional(),
    price: z.number().min(0).optional(),
    durationDays: z.number().int().min(0).optional(),
    features: z.array(z.string().min(1).max(120)).min(1).optional(),
    isActive: z.boolean().optional(),
});