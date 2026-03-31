import { Request, Response } from "express";
export declare const UserController: {
    createAdmin: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllUsers: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateUserStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMe: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateMe: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getUserById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateUserProfileById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=user.controller.d.ts.map