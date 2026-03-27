import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, options: SignOptions) => {
    return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: string) => {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return { success: true, data: decoded };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Invalid token";
        return { success: false, message: msg, error };
    }
};

const decodeToken = (token: string) => {
    return jwt.decode(token) as JwtPayload;
};

export const jwtUtils = {
    createToken,
    verifyToken,
    decodeToken,
};
