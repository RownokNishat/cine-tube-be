import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { SubscriptionService } from "./subscription.service.js";
const getSubscriptionPlans = catchAsync(async (_req, res) => {
    const result = await SubscriptionService.getSubscriptionPlans();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Subscription plans fetched successfully",
        data: result,
    });
});
const getMySubscription = catchAsync(async (req, res) => {
    const result = await SubscriptionService.getMySubscription(req.user.userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Subscription fetched successfully",
        data: result,
    });
});
const createCheckoutSession = catchAsync(async (req, res) => {
    const { plan } = req.body;
    if (!plan) {
        throw new AppError(httpStatus.BAD_REQUEST, "plan is required");
    }
    const result = await SubscriptionService.createCheckoutSession(req.user.userId, plan);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Subscription checkout session created",
        data: result,
    });
});
const verifyCheckoutSession = catchAsync(async (req, res) => {
    const sessionId = String(req.query.sessionId || "");
    if (!sessionId) {
        throw new AppError(httpStatus.BAD_REQUEST, "sessionId is required");
    }
    const result = await SubscriptionService.verifyCheckoutSession(req.user.userId, sessionId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: result.verified ? "Subscription verified successfully" : "Subscription payment is still processing",
        data: result,
    });
});
const updateSubscriptionPlan = catchAsync(async (req, res) => {
    const plan = req.params.plan;
    const result = await SubscriptionService.updateSubscriptionPlan(plan, req.body);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Subscription plan updated successfully",
        data: result,
    });
});
const cancelSubscription = catchAsync(async (req, res) => {
    const result = await SubscriptionService.cancelSubscription(req.user.userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Subscription cancelled successfully",
        data: result,
    });
});
export const SubscriptionController = {
    getSubscriptionPlans,
    updateSubscriptionPlan,
    getMySubscription,
    createCheckoutSession,
    verifyCheckoutSession,
    cancelSubscription,
};
//# sourceMappingURL=subscription.controller.js.map