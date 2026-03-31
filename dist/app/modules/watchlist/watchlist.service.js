import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
const addToWatchlist = async (userId, mediaId) => {
    if (!mediaId) {
        throw new AppError(httpStatus.BAD_REQUEST, "mediaId is required");
    }
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) {
        throw new AppError(httpStatus.NOT_FOUND, "Media not found");
    }
    const existing = await prisma.watchlist.findUnique({
        where: { userId_mediaId: { userId, mediaId } },
    });
    if (existing) {
        throw new AppError(httpStatus.CONFLICT, "Media already in watchlist");
    }
    const watchlistItem = await prisma.watchlist.create({
        data: { userId, mediaId },
        include: {
            media: {
                include: {
                    genres: { include: { genre: true } },
                },
            },
        },
    });
    return {
        ...watchlistItem,
        media: {
            ...watchlistItem.media,
            genres: watchlistItem.media.genres.map((mg) => mg.genre),
        },
    };
};
const removeFromWatchlist = async (userId, idParam) => {
    if (!idParam) {
        throw new AppError(httpStatus.BAD_REQUEST, "mediaId or watchlist item id is required");
    }
    // Accept either the media's id OR the watchlist entry's own id
    let existing = await prisma.watchlist.findUnique({
        where: { userId_mediaId: { userId, mediaId: idParam } },
    });
    if (!existing) {
        existing = await prisma.watchlist.findFirst({
            where: { id: idParam, userId },
        });
    }
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, "Media not found in watchlist");
    }
    await prisma.watchlist.delete({ where: { id: existing.id } });
};
const getMyWatchlist = async (userId) => {
    const items = await prisma.watchlist.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            media: {
                include: {
                    genres: { include: { genre: true } },
                },
            },
        },
    });
    return items.map((item) => ({
        id: item.id,
        addedAt: item.createdAt,
        media: {
            ...item.media,
            genres: item.media.genres.map((mg) => mg.genre),
        },
    }));
};
const checkWatchlistStatus = async (userId, mediaId) => {
    if (!mediaId) {
        throw new AppError(httpStatus.BAD_REQUEST, "mediaId is required");
    }
    const existing = await prisma.watchlist.findUnique({
        where: { userId_mediaId: { userId, mediaId } },
    });
    return { inWatchlist: !!existing };
};
const clearWatchlist = async (userId) => {
    await prisma.watchlist.deleteMany({ where: { userId } });
};
export const WatchlistService = {
    addToWatchlist,
    removeFromWatchlist,
    getMyWatchlist,
    checkWatchlistStatus,
    clearWatchlist,
};
//# sourceMappingURL=watchlist.service.js.map