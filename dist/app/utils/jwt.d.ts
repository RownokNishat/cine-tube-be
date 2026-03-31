import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
export declare const jwtUtils: {
    createToken: (payload: JwtPayload, secret: string, options: SignOptions) => string;
    verifyToken: (token: string, secret: string) => {
        success: boolean;
        data: jwt.JwtPayload;
        message?: never;
        error?: never;
    } | {
        success: boolean;
        message: string;
        error: unknown;
        data?: never;
    };
    decodeToken: (token: string) => JwtPayload;
};
//# sourceMappingURL=jwt.d.ts.map