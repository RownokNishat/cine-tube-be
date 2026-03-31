import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { ICreateMediaPayload, IUpdateMediaPayload } from "./media.interface.js";
import { MediaService } from "./media.service.js";

const parseOptionalBoolean = (value: unknown) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        if (value === "true") {
            return true;
        }

        if (value === "false") {
            return false;
        }
    }

    return undefined;
};

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
    const result = await MediaService.getAllMedia(req.query as unknown as IQueryParams);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Media fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getMediaById = catchAsync(async (req: Request, res: Response) => {
    const result = await MediaService.getMediaById(String(req.params.id));
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Media fetched successfully",
        data: result,
    });
});

const createMedia = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as ICreateMediaPayload;

    // cast and streamingPlatform come as comma-separated strings from multipart form
    if (typeof payload.cast === "string") {
        payload.cast = (payload.cast as string).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (typeof payload.streamingPlatform === "string") {
        payload.streamingPlatform = (payload.streamingPlatform as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    // genreIds may arrive as a repeated field or comma-separated string
    if (typeof payload.genreIds === "string") {
        payload.genreIds = (payload.genreIds as string).split(",").map((s) => s.trim()).filter(Boolean);
    }
    const isFeatured = parseOptionalBoolean(payload.isFeatured);
    if (isFeatured !== undefined) {
        payload.isFeatured = isFeatured;
    }
    const isEditorPick = parseOptionalBoolean(payload.isEditorPick);
    if (isEditorPick !== undefined) {
        payload.isEditorPick = isEditorPick;
    }
    if (payload.price !== undefined) {
        payload.price = Number(payload.price);
    }

    const result = await MediaService.createMedia(payload, req.file);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Media created successfully",
        data: result,
    });
});

const updateMedia = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as IUpdateMediaPayload;

    if (typeof payload.cast === "string") {
        payload.cast = (payload.cast as string).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (typeof payload.streamingPlatform === "string") {
        payload.streamingPlatform = (payload.streamingPlatform as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (typeof payload.genreIds === "string") {
        payload.genreIds = (payload.genreIds as string).split(",").map((s) => s.trim()).filter(Boolean);
    }
    const isFeatured = parseOptionalBoolean(payload.isFeatured);
    if (isFeatured !== undefined) {
        payload.isFeatured = isFeatured;
    }
    const isEditorPick = parseOptionalBoolean(payload.isEditorPick);
    if (isEditorPick !== undefined) {
        payload.isEditorPick = isEditorPick;
    }
    if (payload.price !== undefined) {
        payload.price = Number(payload.price);
    }

    const result = await MediaService.updateMedia(String(req.params.id), payload, req.file);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Media updated successfully",
        data: result,
    });
});

const deleteMedia = catchAsync(async (req: Request, res: Response) => {
    await MediaService.deleteMedia(String(req.params.id));
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Media deleted successfully",
    });
});

const checkAccess = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const result = await MediaService.checkAccess(userId, String(req.params.id));
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: result.hasAccess ? "Access granted" : "Access denied",
        data: result,
    });
});

export const MediaController = {
    getAllMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia,
    checkAccess,
};
