import status from "http-status";
import { Role } from "../../../generated/enums.js";
import AppError from "../../errorHelpers/AppError.js";
import { auth } from "../../../lib/auth.js";
import { prisma } from "../../../lib/prisma.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";

interface ICreateAdminPayload {
    email: string;
    password: string;
    name: string;
    role: "ADMIN" | "SUPER_ADMIN";
}

const createAdmin = async (payload: ICreateAdminPayload) => {
    const userExists = await prisma.user.findUnique({ where: { email: payload.email } });
    if (userExists) {
        throw new AppError(status.CONFLICT, "User with this email already exists");
    }

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.email,
            password: payload.password,
            name: payload.name,
            role: payload.role as Role,
            needPasswordChange: true,
        },
    });

    try {
        const adminProfile = await prisma.adminProfile.create({
            data: { userId: userData.user.id },
        });
        return adminProfile;
    } catch (error) {
        console.log("Error creating admin:", error);
        await prisma.user.delete({ where: { id: userData.user.id } });
        throw error;
    }
};

const getAllUsers = async (queryParams: Record<string, string>) => {
    const result = await new QueryBuilder(
        prisma.user as unknown as { findMany: (args?: unknown) => Promise<unknown[]>; count: (args?: unknown) => Promise<number> },
        queryParams as IQueryParams,
        {
            searchableFields: ['name', 'email'],
            filterableFields: ['role', 'status', 'isDeleted'],
        },
    )
        .search()
        .filter()
        .sort()
        .paginate()
        .execute();

    return result;
};

const updateUserStatus = async (userId: string, newStatus: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const validStatuses = ['ACTIVE', 'BLOCKED', 'DELETED'];
    if (!validStatuses.includes(newStatus)) {
        throw new AppError(status.BAD_REQUEST, "Invalid status value");
    }

    return await prisma.user.update({
        where: { id: userId },
        data: {
            status: newStatus as 'ACTIVE' | 'BLOCKED' | 'DELETED',
            isDeleted: newStatus === 'DELETED',
            deletedAt: newStatus === 'DELETED' ? new Date() : null,
        },
    });
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            emailVerified: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    return user;
};

const updateMe = async (userId: string, payload: { name: string; image?: string | null }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            name: payload.name,
            ...(payload.image !== undefined && { image: payload.image }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            emailVerified: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return updated;
};

export const UserService = {
    createAdmin,
    getAllUsers,
    updateUserStatus,
    getMe,
    updateMe,
};
