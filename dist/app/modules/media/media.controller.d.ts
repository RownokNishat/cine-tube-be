import { Request, Response } from "express";
export declare const MediaController: {
    getAllMedia: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMediaById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createMedia: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateMedia: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteMedia: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    checkAccess: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=media.controller.d.ts.map