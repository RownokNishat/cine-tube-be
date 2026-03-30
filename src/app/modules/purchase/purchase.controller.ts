import { Request, Response } from "express";
import httpStatus from "http-status";
import Stripe from "stripe";
import { stripe } from "../../config/stripe.config.js";
import { envVars } from "../../config/env.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import AppError from "../../errorHelpers/AppError.js";
import { PurchaseService } from "./purchase.service.js";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { mediaId } = req.body as { mediaId: string };

    if (!mediaId) {
        throw new AppError(httpStatus.BAD_REQUEST, "mediaId is required");
    }

    const result = await PurchaseService.createCheckoutSession(userId, mediaId);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Checkout session created",
        data: result,
    });
});

const getMyPurchases = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result = await PurchaseService.getMyPurchases(userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Purchases fetched successfully",
        data: result,
    });
});

const verifyPaymentSuccess = catchAsync(async (req: Request, res: Response) => {
    const { sessionId } = req.query as { sessionId: string };

    if (!sessionId) {
        throw new AppError(httpStatus.BAD_REQUEST, "sessionId query param is required");
    }

    try {
        const result = await PurchaseService.checkAccessBySession(sessionId);
        sendResponse(res, {
            httpStatusCode: httpStatus.OK,
            success: true,
            message: result.hasAccess ? "Payment verified" : "Payment not completed yet",
            data: result,
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Verify] Error: ${msg}`);
        throw error;
    }
});

// Raw body handler — must be called BEFORE express.json() in app.ts
const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;

    if (!sig) {
        res.status(400).json({ success: false, message: "Missing stripe-signature header" });
        return;
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body as Buffer,
            sig,
            envVars.STRIPE.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : "Webhook signature verification failed";
        res.status(400).json({ success: false, message });
        return;
    }

    try {
        await PurchaseService.handleWebhookEvent(event);
        res.status(200).json({ received: true });
    } catch {
        res.status(500).json({ success: false, message: "Webhook handler failed" });
    }
};

export const PurchaseController = {
    createCheckoutSession,
    getMyPurchases,
    verifyPaymentSuccess,
    stripeWebhook,
};
