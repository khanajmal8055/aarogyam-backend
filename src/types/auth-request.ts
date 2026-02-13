import type { Request } from "express";

import type { IUserDocumnet } from "./user.types";

export interface AuthRequest extends Request {
    user?:IUserDocumnet
}