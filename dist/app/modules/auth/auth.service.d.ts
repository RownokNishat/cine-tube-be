import { UserStatus } from "../../../generated/enums.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { IChangePasswordPayload, ILoginUserPayload, IRegisterUserPayload } from "./auth.interface.js";
export declare const AuthService: {
    registerUser: (payload: IRegisterUserPayload) => Promise<{
        accessToken: string;
        refreshToken: string;
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            bio: string | null;
        };
        token: null;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string;
            status: string;
            needPasswordChange: boolean;
            isDeleted: boolean;
            deletedAt?: Date | null | undefined;
        };
    } | {
        accessToken: string;
        refreshToken: string;
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            bio: string | null;
        };
        token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string;
            status: string;
            needPasswordChange: boolean;
            isDeleted: boolean;
            deletedAt?: Date | null | undefined;
        };
    }>;
    loginUser: (payload: ILoginUserPayload) => Promise<{
        accessToken: string;
        refreshToken: string;
        redirect: boolean;
        token: string;
        url?: string | undefined;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string;
            status: string;
            needPasswordChange: boolean;
            isDeleted: boolean;
            deletedAt?: Date | null | undefined;
        };
    }>;
    getMe: (requestUser: IRequestUser) => Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            bio: string | null;
        } | null;
        adminProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        } | null;
        subscriptions: {
            status: import("../../../generated/enums.js").SubscriptionStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            stripePaymentId: string | null;
            amount: number | null;
            plan: import("../../../generated/enums.js").SubscriptionPlan;
            startDate: Date;
            endDate: Date | null;
            stripeCustomerId: string | null;
        }[];
    } & {
        name: string;
        role: import("../../../generated/enums.js").Role;
        status: UserStatus;
        needPasswordChange: boolean;
        emailVerified: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        id: string;
        email: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getNewToken: (refreshToken: string, sessionToken: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        sessionToken: string;
    }>;
    changePassword: (payload: IChangePasswordPayload, sessionToken: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        token: string | null;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & Record<string, any> & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        };
    }>;
    adminResetPassword: (payload: {
        userId: string;
        newPassword: string;
    }) => Promise<{
        userId: string;
        resetInitiated: boolean;
    }>;
    logoutUser: (sessionToken: string) => Promise<{
        success: boolean;
    }>;
    verifyEmail: (email: string, otp: string) => Promise<void>;
    forgetPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
    googleLoginSuccess: (session: Record<string, unknown>) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map