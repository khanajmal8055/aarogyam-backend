"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.greet = exports.registerUser = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const user_model_1 = require("../models/user.model");
const user_schema_1 = require("../zod_schema/user.schema");
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new apiError_1.ApiError(400, "User not Found!!!");
        }
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new apiError_1.ApiError(400, `Error while generating Access and Refresh Token ${error}`);
    }
};
const registerUser = (0, asyncHandler_1.default)(async (req, res) => {
    const body = user_schema_1.CreateUserSchema.parse(req.body);
    const { email, password, fullName, userName } = body;
    const existedUser = await user_model_1.User.findOne({
        $or: [{ email }, { userName }]
    });
    if (existedUser) {
        throw new apiError_1.ApiError(400, "User Already existed");
    }
    const user = await user_model_1.User.create({
        email,
        password,
        fullName,
        userName,
    });
    if (!user) {
        throw new apiError_1.ApiError(409, "Error while Registering a new User");
    }
    return res.status(201)
        .json(new apiResponse_1.ApiResponse(201, user, "User Created Successfully"));
});
exports.registerUser = registerUser;
const greet = async (req, res) => {
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, "Heloo", "Greet sucessfully"));
};
exports.greet = greet;
const loginUser = (0, asyncHandler_1.default)(async (req, res) => {
    const body = user_schema_1.LoginUserSchema.parse(req.body);
    const { email, password } = body;
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new apiError_1.ApiError(404, "No User Found!!!");
    }
    const isValidPassword = await user.isPasswordCorrect(password);
    if (!isValidPassword) {
        throw new apiError_1.ApiError(404, "Invalid credentials!!!");
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);
    const option = {
        httpOnly: true,
        secure: true
    };
    return res.status(201)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(new apiResponse_1.ApiResponse(201, user, "User Logged In Successfully"));
});
exports.loginUser = loginUser;
