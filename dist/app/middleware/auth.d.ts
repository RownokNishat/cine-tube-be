import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/enums.js";
export declare const checkAuth: (...authRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map