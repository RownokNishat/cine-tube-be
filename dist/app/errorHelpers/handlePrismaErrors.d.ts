import { Prisma } from "../../generated/client.js";
import { TErrorResponse } from "../interfaces/error.interface.js";
export declare const handlePrismaClientKnownRequestError: (error: Prisma.PrismaClientKnownRequestError) => TErrorResponse;
export declare const handlePrismaClientUnknownError: (error: Prisma.PrismaClientUnknownRequestError) => TErrorResponse;
export declare const handlePrismaClientValidationError: (error: Prisma.PrismaClientValidationError) => TErrorResponse;
export declare const handlerPrismaClientInitializationError: (error: Prisma.PrismaClientInitializationError) => TErrorResponse;
export declare const handlerPrismaClientRustPanicError: () => TErrorResponse;
//# sourceMappingURL=handlePrismaErrors.d.ts.map