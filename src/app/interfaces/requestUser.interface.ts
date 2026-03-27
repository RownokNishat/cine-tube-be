import { Role } from "../../generated/enums.js";

export interface IRequestUser {
    userId: string;
    role: Role;
    email: string;
}
