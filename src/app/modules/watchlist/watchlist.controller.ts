import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { WatchlistService } from "./watchlist.service.js";

const addToWatchlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { mediaId } = req.params;

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
    const { mediaId } = req.params;

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
    const { mediaId } = req.params;

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
