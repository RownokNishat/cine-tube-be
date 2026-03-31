import status from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { auth } from "../../../lib/auth.js";
import { prisma } from "../../../lib/prisma.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
const createAdmin = async (payload) => {
    const userExists = await prisma.user.findUnique({ where: { email: payload.email } });
    if (userExists) {
        throw new AppError(status.CONFLICT, "User with this email already exists");
    }
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.email,
            password: payload.password,
            name: payload.name,
            role: payload.role,
            needPasswordChange: true,
        },
    });
    try {
        const adminProfile = await prisma.adminProfile.create({
            data: { userId: userData.user.id },
        });
        return adminProfile;
    }
    catch (error) {
        console.log("Error creating admin:", error);
        await prisma.user.delete({ where: { id: userData.user.id } });
        throw error;
    }
};
const getAllUsers = async (queryParams) => {
    const result = await new QueryBuilder(prisma.user, queryParams, {
        searchableFields: ['name', 'email'],
        filterableFields: ['role', 'status', 'isDeleted'],
    })
        .search()
        .filter()
        .sort()
        .paginate()
        .execute();
    return result;
};
const updateUserStatus = async (userId, newStatus) => {
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
            status: newStatus,
            isDeleted: newStatus === 'DELETED',
            deletedAt: newStatus === 'DELETED' ? new Date() : null,
        },
    });
};
const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            isDeleted: true,
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
const updateMe = async (userId, payload) => {
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
            isDeleted: true,
            emailVerified: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updated;
};
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            isDeleted: true,
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
const updateUserProfileById = async (id, payload) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    return await prisma.user.update({
        where: { id },
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
            isDeleted: true,
            emailVerified: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
const updateUserById = async (id, payload) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    const nextStatus = typeof payload.status === "string" ? payload.status : undefined;
    return await prisma.user.update({
        where: { id },
        data: {
            ...(typeof payload.name === "string" && { name: payload.name }),
            ...(typeof payload.email === "string" && { email: payload.email }),
            ...(typeof payload.image === "string" && { image: payload.image }),
            ...(payload.image === null && { image: null }),
            ...(typeof payload.role === "string" && { role: payload.role }),
            ...(nextStatus && { status: nextStatus }),
            ...(typeof payload.needPasswordChange === "boolean" && { needPasswordChange: payload.needPasswordChange }),
            ...(typeof payload.isDeleted === "boolean" && { isDeleted: payload.isDeleted }),
            ...(nextStatus === "DELETED" && { isDeleted: true, deletedAt: new Date() }),
            ...(nextStatus && nextStatus !== "DELETED" && { deletedAt: null }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            isDeleted: true,
            emailVerified: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
const deleteUserById = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    await prisma.user.update({
        where: { id },
        data: {
            status: "DELETED",
            isDeleted: true,
            deletedAt: new Date(),
        },
    });
};
export const UserService = {
    createAdmin,
    getAllUsers,
    updateUserStatus,
    getMe,
    updateMe,
    getUserById,
    updateUserProfileById,
    updateUserById,
    deleteUserById,
};
//# sourceMappingURL=user.service.js.map