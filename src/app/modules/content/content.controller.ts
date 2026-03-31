import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { ContentService } from "./content.service.js";

const getAbout = catchAsync(async (_req: Request, res: Response) => {
    const result = await ContentService.getAboutContent();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "About content fetched successfully",
        data: result,
    });
});

const getFaq = catchAsync(async (_req: Request, res: Response) => {
    const result = await ContentService.getFaqContent();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "FAQ content fetched successfully",
        data: result,
    });
});

const createContactMessage = catchAsync(async (req: Request, res: Response) => {
    const result = await ContentService.createContactMessage(req.body as {
        name: string;
        email: string;
        subject: string;
        message: string;
    });

    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Contact message sent successfully",
        data: result,
    });
});

const getContactMessages = catchAsync(async (req: Request, res: Response) => {
    const result = await ContentService.getContactMessages(req.query as unknown as IQueryParams);

    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Contact messages fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const markContactMessageRead = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
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
