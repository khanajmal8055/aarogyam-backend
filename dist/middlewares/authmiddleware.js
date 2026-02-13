"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
exports.verifyJwt = (0, asyncHandler_1.default)(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new apiError_1.ApiError(404, "Unauthorized Access");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new apiError_1.ApiError(500, "Token has not found");
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await user_model_1.User.findById(decodedToken._id);
    if (!user) {
        throw new apiError_1.ApiError(400, "Invalid Access");
    }
    req.user = user;
    next();
});
