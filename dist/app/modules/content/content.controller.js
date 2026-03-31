import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { ContentService } from "./content.service.js";
const getAbout = catchAsync(async (_req, res) => {
    const result = await ContentService.getAboutContent();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "About content fetched successfully",
        data: result,
    });
});
const getFaq = catchAsync(async (_req, res) => {
    const result = await ContentService.getFaqContent();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "FAQ content fetched successfully",
        data: result,
    });
});
const createContactMessage = catchAsync(async (req, res) => {
    const result = await ContentService.createContactMessage(req.body);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Contact message sent successfully",
        data: result,
    });
});
const getContactMessages = catchAsync(async (req, res) => {
    const result = await ContentService.getContactMessages(req.query);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Contact messages fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const markContactMessageRead = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await ContentService.markContactMessageRead(id);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Contact message marked as read",
        data: result,
    });
});
export const ContentController = {
    getAbout,
    getFaq,
    createContactMessage,
    getContactMessages,
    markContactMessageRead,
};
//# sourceMappingURL=content.controller.js.map