import { Request, Response } from "express";
export declare const SubscriptionController: {
    getSubscriptionPlans: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMySubscription: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createCheckoutSession: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    cancelSubscription: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=subscription.controller.d.ts.map