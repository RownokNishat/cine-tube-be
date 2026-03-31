import status from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { UserService } from "./user.service.js";
const createAdmin = catchAsync(async (req, res) => {
    const payload = req.body;
    const result = await UserService.createAdmin(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});
const getAllUsers = catchAsync(async (req, res) => {
    const queryParams = {};
    for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string')
            queryParams[key] = value;
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
const updateUserStatus = catchAsync(async (req, res) => {
    const userId = req.params["userId"];
    const { status: newStatus } = req.body;
    const result = await UserService.updateUserStatus(userId, newStatus);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User status updated successfully",
        data: result,
    });
});
const getMe = catchAsync(async (req, res) => {
    const result = await UserService.getMe(req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});
const updateMe = catchAsync(async (req, res) => {
    const payload = req.body;
    const result = await UserService.updateMe(req.user.userId, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});
const getUserById = catchAsync(async (req, res) => {
    const id = req.params["id"];
    const result = await UserService.getUserById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User fetched successfully",
        data: result,
    });
});
const updateUserProfileById = catchAsync(async (req, res) => {
    const id = req.params["id"];
    const payload = req.body;
    const result = await UserService.updateUserProfileById(id, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User profile updated successfully",
        data: result,
    });
});
const updateUser = catchAsync(async (req, res) => {
    const id = req.params["id"];
    const result = await UserService.updateUserById(id, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});
const deleteUser = catchAsync(async (req, res) => {
    const id = req.params["id"];
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
//# sourceMappingURL=user.controller.js.map