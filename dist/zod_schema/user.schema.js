"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.email(),
    fullName: zod_1.z.string(),
    userName: zod_1.z.string(),
    password: zod_1.z.string().min(6)
});
exports.LoginUserSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string()
});
