import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { WatchlistService } from "./watchlist.service.js";

const resolveMediaId = (req: Request) => {
    const fromParams = req.params.mediaId;
    const fromBody =
        (req.body as { mediaId?: string; id?: string } | undefined)?.mediaId ??
        (req.body as { mediaId?: string; id?: string } | undefined)?.id;

    const rawFromQuery = req.query.mediaId ?? req.query.id;
    const fromQuery = Array.isArray(rawFromQuery) ? rawFromQuery[0] : rawFromQuery;

    return [fromParams, fromBody, fromQuery].find((value): value is string => typeof value === "string" && value.trim().length > 0);
};

const addToWatchlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const mediaId = resolveMediaId(req);

    if (!mediaId) {
        sendResponse(res, {
            httpStatusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "mediaId is required",
        });
        return;
    }

    const result = await WatchlistService.addToWatchlist(userId, mediaId);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Media added to watchlist",
        data: result,
    });
});

const removeFromWatchlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const mediaId = resolveMediaId(req);

    if (!mediaId) {
        sendResponse(res, {
            httpStatusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "mediaId or watchlist item id is required",
        });
        return;
    }

    await WatchlistService.removeFromWatchlist(userId, mediaId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Media removed from watchlist",
    });
});

const getMyWatchlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result = await WatchlistService.getMyWatchlist(userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Watchlist fetched successfully",
        data: result,
    });
});

const checkWatchlistStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const mediaId = resolveMediaId(req);

    if (!mediaId) {
        sendResponse(res, {
            httpStatusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "mediaId is required",
        });
        return;
    }

    const result = await WatchlistService.checkWatchlistStatus(userId, mediaId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Watchlist status fetched",
        data: result,
    });
});

const clearWatchlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    await WatchlistService.clearWatchlist(userId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Watchlist cleared successfully",
    });
});

export const WatchlistController = {
    addToWatchlist,
    removeFromWatchlist,
    getMyWatchlist,
    checkWatchlistStatus,
    clearWatchlist,
};
