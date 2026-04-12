import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { IQueryResult } from "../../interfaces/query.interface.js";

const addToWatchlist = async (userId: string, mediaId: string) => {
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

const removeFromWatchlist = async (userId: string, idParam: string) => {
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

const getMyWatchlist = async (userId: string, page = 1, limit = 20): Promise<IQueryResult<Record<string, unknown>>> => {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
        prisma.watchlist.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
        include: {
            media: {
                include: {
                    genres: { include: { genre: true } },
                },
            },
        },
    }),
        prisma.watchlist.count({ where: { userId } }),
    ]);

    return {
        data: items.map((item) => ({
            id: item.id,
            userId: item.userId,
            mediaId: item.mediaId,
            createdAt: item.createdAt,
            addedAt: item.createdAt,
            media: {
                ...item.media,
                genres: item.media.genres.map((mg) => mg.genre),
            },
        })),
        meta: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
        },
    };
};

const checkWatchlistStatus = async (userId: string, mediaId: string) => {
    if (!mediaId) {
        throw new AppError(httpStatus.BAD_REQUEST, "mediaId is required");
    }

    const existing = await prisma.watchlist.findUnique({
        where: { userId_mediaId: { userId, mediaId } },
    });

    return { inWatchlist: !!existing };
};

const clearWatchlist = async (userId: string) => {
    await prisma.watchlist.deleteMany({ where: { userId } });
};

export const WatchlistService = {
    addToWatchlist,
    removeFromWatchlist,
    getMyWatchlist,
    checkWatchlistStatus,
    clearWatchlist,
};
