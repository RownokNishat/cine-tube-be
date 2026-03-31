import { Role } from "../../../generated/enums.js";
interface ICreateAdminPayload {
    email: string;
    password: string;
    name: string;
    role: "ADMIN" | "SUPER_ADMIN";
}
export declare const UserService: {
    createAdmin: (payload: ICreateAdminPayload) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getAllUsers: (queryParams: Record<string, string>) => Promise<import("../../interfaces/query.interface.js").IQueryResult<unknown>>;
    updateUserStatus: (userId: string, newStatus: string) => Promise<{
        name: string;
        role: Role;
        status: import("../../../generated/enums.js").UserStatus;
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
    getMe: (userId: string) => Promise<{
        name: string;
        role: Role;
        status: import("../../../generated/enums.js").UserStatus;
        needPasswordChange: boolean;
        emailVerified: boolean;
        isDeleted: boolean;
        id: string;
        email: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe: (userId: string, payload: {
        name: string;
        image?: string | null;
    }) => Promise<{
        name: string;
        role: Role;
        status: import("../../../generated/enums.js").UserStatus;
        needPasswordChange: boolean;
        emailVerified: boolean;
        isDeleted: boolean;
        id: string;
        email: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserById: (id: string) => Promise<{
        name: string;
        role: Role;
        status: import("../../../generated/enums.js").UserStatus;
        needPasswordChange: boolean;
        emailVerified: boolean;
        isDeleted: boolean;
        id: string;
        email: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserProfileById: (id: string, payload: {
        name: string;
        image?: string | null;
    }) => Promise<{
        name: string;
        role: Role;
        status: import("../../../generated/enums.js").UserStatus;
        needPasswordChange: boolean;
        emailVerified: boolean;
        isDeleted: boolean;
        id: string;
        email: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserById: (id: string, payload: Record<string, unknown>) => Promise<{
        name: string;
        role: Role;
        status: import("../../../generated/enums.js").UserStatus;
        needPasswordChange: boolean;
        emailVerified: boolean;
        isDeleted: boolean;
        id: string;
        email: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUserById: (id: string) => Promise<void>;
};
export {};
//# sourceMappingURL=user.service.d.ts.map