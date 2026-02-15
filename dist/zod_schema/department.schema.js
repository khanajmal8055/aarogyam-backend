"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDepartmentDetails = exports.CreateDepartment = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateDepartment = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
    icon: zod_1.default.string(),
});
exports.UpdateDepartmentDetails = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
    icon: zod_1.default.string()
});
