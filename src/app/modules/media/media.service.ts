import status from "http-status";
import { MediaStatus, MediaType, PricingType } from "../../../generated/enums.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../config/cloudinary.config.js";
import AppError from "../../errorHelpers/AppError.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { prisma } from "../../../lib/prisma.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { ICreateMediaPayload, IUpdateMediaPayload } from "./media.interface.js";

const SEARCHABLE_FIELDS = ["title", "synopsis", "director"];
const FILTERABLE_FIELDS = ["mediaType", "pricingType", "status", "releaseYear"];

const getAllMedia = async (queryParams: IQueryParams) => {
    const baseWhere: Record<string, unknown> = {};

    // genre filter via junction table
    if (queryParams.genre) {
        baseWhere.genres = {
            some: {
                genre: {
                    name: { contains: queryParams.genre, mode: "insensitive" },
                },
            },
        };
        delete queryParams.genre;
    }

    const builder = new QueryBuilder(prisma.media, queryParams, {
        searchableFields: SEARCHABLE_FIELDS,
        filterableFields: FILTERABLE_FIELDS,
    });

    const result = await builder
        .search()
        .filter()
        .where(baseWhere)
        .sort()
        .paginate()
        .include({
            genres: { include: { genre: true } },
            _count: { select: { reviews: true } },
        })
        .execute();

    // Flatten genres for frontend: genres: [{ id, name }]
    const data = (result.data as Record<string, unknown>[]).map((item) => ({
        ...item,
        genres: (item.genres as { genre: { id: string; name: string } }[]).map((mg) => mg.genre),
    }));

    return { data, meta: result.meta };
};

const getMediaById = async (id: string) => {
    const media = await prisma.media.findUnique({
        where: { id },
        include: {
            genres: { include: { genre: true } },
            _count: { select: { reviews: true } },
        },
    });

    if (!media) {
        throw new AppError(status.NOT_FOUND, "Media not found");
    }

    return {
        ...media,
        genres: media.genres.map((mg) => mg.genre),
    };
};

const createMedia = async (
    payload: ICreateMediaPayload,
    posterFile?: Express.Multer.File,
) => {
    const {
        title,
        synopsis,
        releaseYear,
        director,
        cast,
        streamingPlatform,
        pricingType,
        streamingLink,
        trailerUrl,
        mediaType,
        status: mediaStatus,
        genreIds,
    } = payload;

    let posterUrl: string | undefined;
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

    const media = await prisma.media.create({
        data: {
            title,
            synopsis,
            releaseYear: Number(releaseYear),
            director: director ?? "",
            cast: cast ?? [],
            streamingPlatform: streamingPlatform ?? [],
            pricingType: pricingType ?? PricingType.FREE,
            streamingLink: streamingLink ?? null,
            posterUrl: posterUrl ?? null,
            trailerUrl: trailerUrl ?? null,
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

    return {
        ...media,
        genres: media.genres.map((mg) => mg.genre),
    };
};

const updateMedia = async (
    id: string,
    payload: IUpdateMediaPayload,
    posterFile?: Express.Multer.File,
) => {
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
                ...(releaseYear !== undefined && { releaseYear: Number(releaseYear) }),
                posterUrl,
            },
        });
    });

    const media = await prisma.media.findUnique({
        where: { id },
        include: { genres: { include: { genre: true } } },
    });

    return {
        ...media!,
        genres: media!.genres.map((mg) => mg.genre),
    };
};

const deleteMedia = async (id: string) => {
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) {
        throw new AppError(status.NOT_FOUND, "Media not found");
    }

    if (existing.posterUrl) {
        await deleteFileFromCloudinary(existing.posterUrl);
    }

    await prisma.media.delete({ where: { id } });
};

export const MediaService = {
    getAllMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia,
};
