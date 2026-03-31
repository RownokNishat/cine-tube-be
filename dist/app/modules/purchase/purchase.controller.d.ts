import { Request, Response } from "express";
export declare const PurchaseController: {
    createCheckoutSession: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyPurchases: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    verifyPaymentSuccess: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    stripeWebhook: (req: Request, res: Response) => Promise<void>;
    getDashboardAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getPaymentTransactions: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=purchase.controller.d.ts.map