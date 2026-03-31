import z from "zod";
export declare const updateSubscriptionPlanSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    durationDays: z.ZodOptional<z.ZodNumber>;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=subscription.validation.d.ts.map