import { Request, Response } from 'express';
export declare const ChatController: {
    createSession: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMySessions: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllSessions: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getSessionMessages: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    sendMessage: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateSessionStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=chat.controller.d.ts.map