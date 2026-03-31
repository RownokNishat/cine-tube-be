import jwt from "jsonwebtoken";
const createToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
};
const verifyToken = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : "Invalid token";
        return { success: false, message: msg, error };
    }
};
const decodeToken = (token) => {
    return jwt.decode(token);
};
export const jwtUtils = {
    createToken,
    verifyToken,
    decodeToken,
};
//# sourceMappingURL=jwt.js.map