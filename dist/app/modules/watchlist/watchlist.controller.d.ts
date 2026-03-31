import { Request, Response } from "express";
export declare const WatchlistController: {
    addToWatchlist: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    removeFromWatchlist: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyWatchlist: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    checkWatchlistStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    clearWatchlist: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=watchlist.controller.d.ts.map