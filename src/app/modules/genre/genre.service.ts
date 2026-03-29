import status from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../../lib/prisma.js";

const getAllGenres = async () => {
    return prisma.genre.findMany({ orderBy: { name: "asc" } });
};

const createGenre = async (name: string) => {
    const existing = await prisma.genre.findUnique({ where: { name } });
    if (existing) {
        throw new AppError(status.CONFLICT, "Genre already exists");
    }
    return prisma.genre.create({ data: { name } });
};

const deleteGenre = async (id: string) => {
    const existing = await prisma.genre.findUnique({ where: { id } });
    if (!existing) {
        throw new AppError(status.NOT_FOUND, "Genre not found");
    }
    await prisma.genre.delete({ where: { id } });
};

export const GenreService = { getAllGenres, createGenre, deleteGenre };
