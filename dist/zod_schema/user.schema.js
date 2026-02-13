"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateUserSchema = exports.AdminCreateUserSchema = exports.UpdatePasswordSchema = exports.UpdateUserSchema = exports.LoginUserSchema = exports.CreateUserSchema = void 0;
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
exports.UpdateUserSchema = zod_1.z.object({
    email: zod_1.z.email(),
    fullName: zod_1.z.string(),
    userName: zod_1.z.string()
});
exports.UpdatePasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(6),
    oldPassword: zod_1.z.string()
});
exports.AdminCreateUserSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6),
    userName: zod_1.z.string(),
    fullName: zod_1.z.string(),
    role: zod_1.z.string()
});
exports.AdminUpdateUserSchema = zod_1.z.object({
    email: zod_1.z.email(),
    userName: zod_1.z.string(),
    fullName: zod_1.z.string(),
    role: zod_1.z.string()
});
