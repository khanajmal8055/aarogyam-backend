"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDoctorSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateDoctorSchema = zod_1.default.object({
    doctorName: zod_1.default.string(),
    email: zod_1.default.email(),
    profileImage: zod_1.default.string(),
    department: zod_1.default.string(),
    phone: zod_1.default.string(),
    specialization: zod_1.default.string(),
    qualification: zod_1.default.string(),
    experience: zod_1.default.number(),
    consultationFee: zod_1.default.number(),
    gender: zod_1.default.enum(['male', 'female', 'other']),
    address: zod_1.default.object({
        street: zod_1.default.string(),
        city: zod_1.default.string(),
        state: zod_1.default.string()
    }),
    availability: zod_1.default.object({
        day: zod_1.default.string(),
        slots: zod_1.default.string()
    }),
});
