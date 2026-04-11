import status from "http-status";
import { UserStatus } from "../../../generated/enums.js";
import { envVars } from "../../config/env.js";
import AppError from "../../errorHelpers/AppError.js";
import { auth } from "../../../lib/auth.js";
import { prisma } from "../../../lib/prisma.js";
import { jwtUtils } from "../../utils/jwt.js";
import { tokenUtils } from "../../utils/token.js";
const registerUser = async (payload) => {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({
        body: { name, email, password },
    });
    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to register user");
    }
    try {
        const profile = await prisma.$transaction(async (tx) => {
            return await tx.userProfile.create({
                data: {
                    userId: data.user.id,
                },
            });
        });
        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
        });
        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
        });
        return { ...data, accessToken, refreshToken, profile };
    }
    catch (error) {
        console.log("Transaction error:", error);
        await prisma.user.delete({ where: { id: data.user.id } });
        throw error;
    }
};
const loginUser = async (payload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({ body: { email, password } });
    const user = data.user;
    if (user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "User is blocked");
    }
    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "User is deleted");
    }
    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: user.role,
        name: data.user.name,
        email: data.user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: data.user.emailVerified,
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: user.role,
        name: data.user.name,
        email: data.user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: data.user.emailVerified,
    });
    return { ...data, accessToken, refreshToken };
};
const getMe = async (requestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: { id: requestUser.userId },
        include: {
            profile: true,
            adminProfile: true,
            subscriptions: true,
        },
    });
    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    return isUserExists;
};
const getNewToken = async (refreshToken, sessionToken) => {
    const isSessionTokenExists = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
    });
    if (!isSessionTokenExists) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
    if (!verifiedRefreshToken.success) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
    }
    const decoded = verifiedRefreshToken.data;
    const newAccessToken = tokenUtils.getAccessToken({
        userId: decoded.userId,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
        status: decoded.status,
        isDeleted: decoded.isDeleted,
        emailVerified: decoded.emailVerified,
    });
    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: decoded.userId,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
        status: decoded.status,
        isDeleted: decoded.isDeleted,
        emailVerified: decoded.emailVerified,
    });
    const { token } = await prisma.session.update({
        where: { token: sessionToken },
        data: {
            expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        },
    });
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: token,
    };
};
const changePassword = async (payload, sessionToken) => {
    const session = await auth.api.getSession({
        headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
    });
    if (!session) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }
    const { currentPassword, newPassword } = payload;
    const result = await auth.api.changePassword({
        body: { currentPassword, newPassword, revokeOtherSessions: true },
        headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
    });
    const user = session.user;
    if (user.needPasswordChange) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { needPasswordChange: false },
        });
    }
    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: user.role,
        name: session.user.name,
        email: session.user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: session.user.emailVerified,
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: user.role,
        name: session.user.name,
        email: session.user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: session.user.emailVerified,
    });
    return { ...result, accessToken, refreshToken };
};
const adminResetPassword = async (payload) => {
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    // Force sign-out from all sessions and require password reset on next login.
    // Better-auth does not provide a direct admin set-password API for another user
    // through this server-side SDK path, so we initiate a secure reset flow.
    await prisma.$transaction(async (tx) => {
        await tx.session.deleteMany({ where: { userId: user.id } });
        await tx.user.update({
            where: { id: user.id },
            data: { needPasswordChange: true },
        });
    });
    await auth.api.requestPasswordResetEmailOTP({
        body: { email: user.email },
    });
    return {
        userId: user.id,
        resetInitiated: true,
    };
};
const logoutUser = async (sessionToken) => {
    return await auth.api.signOut({
        headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
    });
};
const verifyEmail = async (email, otp) => {
    const result = await auth.api.verifyEmailOTP({ body: { email, otp } });
    if (result.status && !result.user.emailVerified) {
        await prisma.user.update({
            where: { email },
            data: { emailVerified: true },
        });
    }
};
const forgetPassword = async (email) => {
    const isUserExist = await prisma.user.findUnique({ where: { email } });
    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    if (!isUserExist.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email not verified");
    }
    if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    await auth.api.requestPasswordResetEmailOTP({ body: { email } });
};
const resetPassword = async (email, otp, newPassword) => {
    const isUserExist = await prisma.user.findUnique({ where: { email } });
    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    if (!isUserExist.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email not verified");
    }
    if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    await auth.api.resetPasswordEmailOTP({ body: { email, otp, password: newPassword } });
    if (isUserExist.needPasswordChange) {
        await prisma.user.update({
            where: { id: isUserExist.id },
            data: { needPasswordChange: false },
        });
    }
    await prisma.session.deleteMany({ where: { userId: isUserExist.id } });
};
const googleLoginSuccess = async (session) => {
    const sessionUser = session.user;
    const isProfileExists = await prisma.userProfile.findUnique({
        where: { userId: sessionUser.id },
    });
    if (!isProfileExists) {
        await prisma.userProfile.create({
            data: { userId: sessionUser.id },
        });
    }
    const accessToken = tokenUtils.getAccessToken({
        userId: sessionUser.id,
        role: sessionUser.role,
        name: sessionUser.name,
        email: sessionUser.email,
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: sessionUser.id,
        role: sessionUser.role,
        name: sessionUser.name,
        email: sessionUser.email,
    });
    return { accessToken, refreshToken };
};
export const AuthService = {
    registerUser,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    adminResetPassword,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    googleLoginSuccess,
};
//# sourceMappingURL=auth.service.js.map