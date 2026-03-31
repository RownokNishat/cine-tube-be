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
    getMySubscription,
    createCheckoutSession,
    cancelSubscription,
};
//# sourceMappingURL=subscription.controller.js.map