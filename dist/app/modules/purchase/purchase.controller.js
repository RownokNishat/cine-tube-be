import httpStatus from "http-status";
import { stripe } from "../../config/stripe.config.js";
import { envVars } from "../../config/env.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import AppError from "../../errorHelpers/AppError.js";
import { PurchaseService } from "./purchase.service.js";
const createCheckoutSession = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { mediaId } = req.body;
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
const getMyPurchases = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await PurchaseService.getMyPurchases(userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Purchases fetched successfully",
        data: result,
    });
});
const verifyPaymentSuccess = catchAsync(async (req, res) => {
    const { sessionId } = req.query;
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
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Verify] Error: ${msg}`);
        throw error;
    }
});
// Raw body handler — must be called BEFORE express.json() in app.ts
const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        res.status(400).json({ success: false, message: "Missing stripe-signature header" });
        return;
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, envVars.STRIPE.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Webhook signature verification failed";
        res.status(400).json({ success: false, message });
        return;
    }
    try {
        await PurchaseService.handleWebhookEvent(event);
        res.status(200).json({ received: true });
    }
    catch {
        res.status(500).json({ success: false, message: "Webhook handler failed" });
    }
};
const getDashboardAnalytics = catchAsync(async (req, res) => {
    const data = await PurchaseService.getDashboardAnalytics();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Payment dashboard fetched successfully",
        data,
    });
});
export const PurchaseController = {
    createCheckoutSession,
    getMyPurchases,
    verifyPaymentSuccess,
    stripeWebhook,
    getDashboardAnalytics,
};
//# sourceMappingURL=purchase.controller.js.map