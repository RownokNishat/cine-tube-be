import status from "http-status";
import { MediaStatus, MediaType, PricingType, ReviewStatus, SubscriptionStatus } from "../../../generated/enums.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../config/cloudinary.config.js";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";
const SEARCHABLE_FIELDS = ["title", "synopsis", "director"];
const FILTERABLE_FIELDS = ["mediaType", "pricingType", "status", "releaseYear", "isFeatured", "isEditorPick"];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const parseOptionalBoolean = (value) => {
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }
    return undefined;
};
const calculatePopularityScore = (media) => (media._count.reviews + media._count.likes + media.watchlistCount + media.purchaseCount);
const matchesSearchTerm = (media, searchTerm) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
        return true;
    }
    const searchableValues = [
        media.title,
        media.synopsis,
        media.director,
        ...media.cast,
    ];
    return searchableValues.some((value) => value.toLowerCase().includes(normalizedSearch));
};
const transformMediaRecord = (media) => {
    const reviewCount = media.reviews.length;
    const totalRating = media.reviews.reduce((sum, review) => sum + review.rating, 0);
    const totalLikes = media.reviews.reduce((sum, review) => sum + review._count.likes, 0);
    const averageRating = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;
    return {
        ...media,
        genres: media.genres.map((mediaGenre) => mediaGenre.genre),
        averageRating,
        watchlistCount: media._count.watchlistEntries,
        purchaseCount: media._count.purchases,
        _count: {
            reviews: reviewCount,
            likes: totalLikes,
        },
    };
};
const sortMediaRecords = (mediaRecords, sortBy, sortOrder) => {
    const direction = sortOrder === "asc" ? 1 : -1;
    return [...mediaRecords].sort((first, second) => {
        let firstValue = 0;
        let secondValue = 0;
        switch (sortBy) {
            case "averageRating":
                firstValue = first.averageRating ?? 0;
                secondValue = second.averageRating ?? 0;
                break;
            case "reviewCount":
                firstValue = first._count.reviews ?? 0;
                secondValue = second._count.reviews ?? 0;
                break;
            case "mostLiked":
                firstValue = first._count.likes ?? 0;
                secondValue = second._count.likes ?? 0;
                break;
            case "popularity":
                firstValue = calculatePopularityScore(first);
                secondValue = calculatePopularityScore(second);
                break;
            case "releaseYear":
                firstValue = first.releaseYear;
                secondValue = second.releaseYear;
                break;
            case "title":
                firstValue = first.title.toLowerCase();
                secondValue = second.title.toLowerCase();
                break;
            case "createdAt":
            default:
                firstValue = new Date(first.createdAt);
                secondValue = new Date(second.createdAt);
                break;
        }
        if (firstValue < secondValue) {
            return -1 * direction;
        }
        if (firstValue > secondValue) {
            return 1 * direction;
        }
        return 0;
    });
};
const getMediaBaseWhere = (queryParams) => {
    const baseWhere = {};
    if (queryParams.mediaType) {
        baseWhere.mediaType = queryParams.mediaType;
    }
    if (queryParams.pricingType) {
        baseWhere.pricingType = queryParams.pricingType;
    }
    if (queryParams.status) {
        baseWhere.status = queryParams.status;
    }
    if (queryParams.releaseYear) {
        baseWhere.releaseYear = Number(queryParams.releaseYear);
    }
    const featured = parseOptionalBoolean(queryParams.featured);
    if (featured !== undefined) {
        baseWhere.isFeatured = featured;
    }
    const editorPick = parseOptionalBoolean(queryParams.editorPick);
    if (editorPick !== undefined) {
        baseWhere.isEditorPick = editorPick;
    }
    if (queryParams.genre) {
        baseWhere.genres = {
            some: {
                genre: {
                    name: { contains: queryParams.genre, mode: "insensitive" },
                },
            },
        };
    }
    return baseWhere;
};
const listMediaRecords = async (queryParams) => {
    const baseWhere = getMediaBaseWhere(queryParams);
    return prisma.media.findMany({
        where: baseWhere,
        include: {
            genres: { include: { genre: true } },
            reviews: {
                where: { status: ReviewStatus.PUBLISHED },
                select: {
                    rating: true,
                    _count: { select: { likes: true } },
                },
            },
            _count: {
                select: {
                    reviews: true,
                    watchlistEntries: true,
                    purchases: true,
                },
            },
        },
    });
};
const getAllMedia = async (queryParams) => {
    const page = Math.max(Number(queryParams.page) || DEFAULT_PAGE, 1);
    const limit = Math.max(Number(queryParams.limit) || DEFAULT_LIMIT, 1);
    const skip = (page - 1) * limit;
    const sortBy = queryParams.sortBy || "createdAt";
    const sortOrder = queryParams.sortOrder === "asc" ? "asc" : "desc";
    const minRating = queryParams.minRating ? Number(queryParams.minRating) : undefined;
    const streamingPlatform = queryParams.streamingPlatform?.trim().toLowerCase();
    const popularity = queryParams.popularity?.trim().toLowerCase();
    const searchTerm = queryParams.searchTerm?.trim();
    const mediaRecords = await listMediaRecords(queryParams);
    const filteredMedia = mediaRecords
        .filter((media) => {
        if (searchTerm && !matchesSearchTerm(media, searchTerm)) {
            return false;
        }
        if (streamingPlatform &&
            !media.streamingPlatform.some((platform) => platform.toLowerCase().includes(streamingPlatform))) {
            return false;
        }
        return true;
    })
        .map(transformMediaRecord)
        .filter((media) => {
        if (minRating !== undefined && media.averageRating < minRating) {
            return false;
        }
        if (popularity === "high") {
            return calculatePopularityScore(media) >= 20;
        }
        if (popularity === "medium") {
            const score = calculatePopularityScore(media);
            return score >= 8 && score < 20;
        }
        if (popularity === "low") {
            return calculatePopularityScore(media) < 8;
        }
        return true;
    });
    const sortedMedia = sortMediaRecords(filteredMedia, sortBy, sortOrder);
    const data = sortedMedia.slice(skip, skip + limit);
    const total = sortedMedia.length;
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getMediaById = async (id) => {
    const media = await prisma.media.findUnique({
        where: { id },
        include: {
            genres: { include: { genre: true } },
            reviews: {
                where: { status: ReviewStatus.PUBLISHED },
                select: {
                    rating: true,
                    _count: { select: { likes: true } },
                },
            },
            _count: {
                select: {
                    reviews: true,
                    watchlistEntries: true,
                    purchases: true,
                },
            },
        },
    });
    if (!media) {
        throw new AppError(status.NOT_FOUND, "Media not found");
    }
    return transformMediaRecord(media);
};
const createMedia = async (payload, posterFile) => {
    const { title, synopsis, releaseYear, price, director, cast, streamingPlatform, pricingType, streamingLink, trailerUrl, isFeatured, isEditorPick, mediaType, status: mediaStatus, genreIds, } = payload;
    let posterUrl;
    if (posterFile) {
        const uploaded = await uploadFileToCloudinary(posterFile.buffer, posterFile.originalname);
        posterUrl = uploaded.secure_url;
    }
    // Validate genreIds exist
    if (genreIds && genreIds.length > 0) {
        const foundGenres = await prisma.genre.findMany({
            where: { id: { in: genreIds } },
        });
        if (foundGenres.length !== genreIds.length) {
            throw new AppError(status.BAD_REQUEST, "One or more genre IDs are invalid");
        }
    }
    const normalizedPrice = pricingType === PricingType.PREMIUM
        ? Number(price)
        : 0;
    if (pricingType === PricingType.PREMIUM && (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0)) {
        throw new AppError(status.BAD_REQUEST, "Premium media requires a valid price greater than 0");
    }
    const media = await prisma.media.create({
        data: {
            title,
            synopsis,
            releaseYear: Number(releaseYear),
            price: normalizedPrice,
            director: director ?? "",
            cast: cast ?? [],
            streamingPlatform: streamingPlatform ?? [],
            pricingType: pricingType ?? PricingType.FREE,
            streamingLink: streamingLink ?? null,
            posterUrl: posterUrl ?? null,
            trailerUrl: trailerUrl ?? null,
            isFeatured: isFeatured ?? false,
            isEditorPick: isEditorPick ?? false,
            mediaType: mediaType ?? MediaType.MOVIE,
            status: mediaStatus ?? MediaStatus.PUBLISHED,
            ...(genreIds && genreIds.length > 0
                ? { genres: { create: genreIds.map((genreId) => ({ genreId })) } }
                : {}),
        },
        include: {
            genres: { include: { genre: true } },
        },
    });
    return getMediaById(media.id);
};
const updateMedia = async (id, payload, posterFile) => {
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) {
        throw new AppError(status.NOT_FOUND, "Media not found");
    }
    let posterUrl = existing.posterUrl;
    if (posterFile) {
        if (existing.posterUrl) {
            await deleteFileFromCloudinary(existing.posterUrl);
        }
        const uploaded = await uploadFileToCloudinary(posterFile.buffer, posterFile.originalname);
        posterUrl = uploaded.secure_url;
    }
    const { genreIds, releaseYear, ...rest } = payload;
    const nextPricingType = rest.pricingType ?? existing.pricingType;
    let nextPrice = rest.price;
    if (nextPricingType === PricingType.FREE) {
        nextPrice = 0;
    }
    else if (nextPrice !== undefined) {
        const normalized = Number(nextPrice);
        if (!Number.isFinite(normalized) || normalized <= 0) {
            throw new AppError(status.BAD_REQUEST, "Premium media requires a valid price greater than 0");
        }
        nextPrice = normalized;
    }
    await prisma.$transaction(async (tx) => {
        if (genreIds !== undefined) {
            await tx.mediaGenre.deleteMany({ where: { mediaId: id } });
            if (genreIds.length > 0) {
                await tx.mediaGenre.createMany({
                    data: genreIds.map((genreId) => ({ mediaId: id, genreId })),
                });
            }
        }
        await tx.media.update({
            where: { id },
            data: {
                ...rest,
                ...(nextPrice !== undefined && { price: nextPrice }),
                ...(releaseYear !== undefined && { releaseYear: Number(releaseYear) }),
                posterUrl,
            },
        });
    });
    return getMediaById(id);
};
const deleteMedia = async (id) => {
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) {
        throw new AppError(status.NOT_FOUND, "Media not found");
    }
    if (existing.posterUrl) {
        await deleteFileFromCloudinary(existing.posterUrl);
    }
    await prisma.media.delete({ where: { id } });
};
const checkAccess = async (userId, mediaId) => {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) {
        throw new AppError(status.NOT_FOUND, "Media not found");
    }
    // Free media is always accessible
    if (media.pricingType === "FREE") {
        return { hasAccess: true, reason: "free" };
    }
    const now = new Date();
    const activeSubscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: SubscriptionStatus.ACTIVE,
            endDate: { gt: now },
        },
    });
    if (activeSubscription) {
        return { hasAccess: true, reason: "subscription" };
    }
    // Premium without subscription — check completed purchase/rental for this media
    const purchase = await prisma.purchase.findFirst({
        where: { userId, mediaId, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
    });
    if (purchase) {
        if (purchase.purchaseType === "RENTAL") {
            if (!purchase.rentalExpiresAt || purchase.rentalExpiresAt <= now) {
                return { hasAccess: false, reason: "rental_expired" };
            }
            return { hasAccess: true, reason: "rented" };
        }
        return { hasAccess: true, reason: "purchased" };
    }
    return { hasAccess: false, reason: "purchase_required" };
};
export const MediaService = {
    getAllMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia,
    checkAccess,
};
//# sourceMappingURL=media.service.js.map