import status from "http-status";
import { UserStatus } from "../../generated/enums.js";
import { envVars } from "../config/env.js";
import AppError from "../errorHelpers/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { CookieUtils } from "../utils/cookie.js";
import { jwtUtils } from "../utils/jwt.js";
export const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No session token provided.");
        }
        const sessionExists = await prisma.session.findFirst({
            where: {
                token: sessionToken,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });
        if (sessionExists && sessionExists.user) {
            const user = sessionExists.user;
            if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized access! User is not active.");
            }
            if (user.isDeleted) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized access! User is deleted.");
            }
            if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                throw new AppError(status.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
            }
            req.user = {
                userId: user.id,
                role: user.role,
                email: user.email,
            };
        }
        const accessToken = CookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No access token provided.");
        }
        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
        }
        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
            throw new AppError(status.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.js.map