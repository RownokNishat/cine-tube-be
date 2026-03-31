import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { UserService } from "./user.service.js";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as { email: string; password: string; name: string; role: "ADMIN" | "SUPER_ADMIN" };
    const result = await UserService.createAdmin(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const queryParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') queryParams[key] = value;
    }
    const result = await UserService.getAllUsers(queryParams);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Users fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params["userId"] as string;
    const { status: newStatus } = req.body as { status: string };
    const result = await UserService.updateUserStatus(userId, newStatus);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User status updated successfully",
        data: result,
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getMe(req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as { name: string; image?: string | null };
    const result = await UserService.updateMe(req.user.userId, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const result = await UserService.getUserById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User fetched successfully",
        data: result,
    });
});

const updateUserProfileById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const payload = req.body as { name: string; image?: string | null };
    const result = await UserService.updateUserProfileById(id, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User profile updated successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const result = await UserService.updateUserById(id, req.body as Record<string, unknown>);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    await UserService.deleteUserById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User deleted successfully",
    });
});

export const UserController = {
    createAdmin,
    getAllUsers,
    updateUserStatus,
    getMe,
    updateMe,
    getUserById,
    updateUserProfileById,
    updateUser,
    deleteUser,
};

