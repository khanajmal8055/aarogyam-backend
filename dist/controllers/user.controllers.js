"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.adminCreateUser = exports.deleteAccount = exports.updatePassword = exports.updateProfile = exports.viewProfile = exports.logoutUser = exports.loginUser = exports.greet = exports.registerUser = void 0;
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
    const user = await user_model_1.User.findOne({ email }).select('+password');
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
        secure: false,
    };
    return res.status(201)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(new apiResponse_1.ApiResponse(201, user, "User Logged In Successfully"));
});
exports.loginUser = loginUser;
const logoutUser = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?._id;
    await user_model_1.User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: 1 }
    }, {
        new: true
    });
    const option = {
        httpOnly: true,
        secure: false
    };
    return res.status(201)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new apiResponse_1.ApiResponse(201, {}, "User Logged Out Successfully"));
});
exports.logoutUser = logoutUser;
const viewProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?._id;
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new apiError_1.ApiError(404, "User Not Found");
    }
    return res.status(201)
        .json(new apiResponse_1.ApiResponse(201, user, "User Profile Fetched Successfully"));
});
exports.viewProfile = viewProfile;
const updateProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const body = user_schema_1.UpdateUserSchema.parse(req.body);
    const { email, fullName, userName } = body;
    const updatedUser = await user_model_1.User.findByIdAndUpdate(req.user?._id, {
        $set: {
            email,
            fullName,
            userName
        }
    }, {
        new: true
    });
    if (!updatedUser) {
        throw new apiError_1.ApiError(409, "Error facing while updating Profile details");
    }
    return res.status(201)
        .json(new apiResponse_1.ApiResponse(201, updatedUser, "Profile details updated successfully"));
});
exports.updateProfile = updateProfile;
const updatePassword = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?._id;
    const body = user_schema_1.UpdatePasswordSchema.parse(req.body);
    const { oldPassword, newPassword } = body;
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    const isValidPassword = await user.isPasswordCorrect(oldPassword);
    if (!isValidPassword) {
        throw new apiError_1.ApiError(402, "Incorrect Password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(201)
        .json(new apiResponse_1.ApiResponse(201, {}, "Password Updated Successfully"));
});
exports.updatePassword = updatePassword;
const deleteAccount = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?._id;
    if (req.user?.role === 'admin') {
        throw new apiError_1.ApiError(400, "Admin Cannot be Deleted");
    }
    if (req.user?.role === 'receptionist') {
        throw new apiError_1.ApiError(400, "Receptionist cannot delete themselves");
    }
    const deletedUser = await user_model_1.User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new apiError_1.ApiError(500, "Facing Problem While Deleting Account");
    }
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, {}, "Account Deleted Successfully"));
});
exports.deleteAccount = deleteAccount;
// Admin specific controllers
const adminCreateUser = (0, asyncHandler_1.default)(async (req, res) => {
    const body = user_schema_1.AdminCreateUserSchema.parse(req.body);
    const { email, password, fullName, userName, role } = body;
    if (role === 'admin') {
        throw new apiError_1.ApiError(402, "Role Admin Cannot be created");
    }
    const existedUser = await user_model_1.User.findOne({
        $or: [{ email }, { userName }]
    });
    if (existedUser) {
        throw new apiError_1.ApiError(409, "User has already exists in Database");
    }
    const user = await user_model_1.User.create({
        email,
        password,
        fullName,
        userName,
        role
    });
    if (!user) {
        throw new apiError_1.ApiError(409, "User Creation error");
    }
    return res.status(201)
        .json(new apiResponse_1.ApiResponse(201, user, "User created Successfully"));
});
exports.adminCreateUser = adminCreateUser;
const getAllUsers = (0, asyncHandler_1.default)(async (req, res) => {
    const role = req.user?.role;
    console.log(req.user);
    if (role !== 'admin') {
        throw new apiError_1.ApiError(402, "You have not authorize to use this functionality");
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.role) {
        filter.role = req.query.role;
    }
    if (req.query.search) {
        filter.$or = [
            { fullName: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ];
    }
    const [users, totalUsers] = await Promise.all([
        user_model_1.User.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        user_model_1.User.countDocuments(filter)
    ]);
    const data = {
        users,
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
    };
    // const users = await User.find().skip(skip).limit(limit)
    if (!data) {
        throw new apiError_1.ApiError(500, "Users cannot fetched Right Now");
    }
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, data, "All Users Fetched Successfully"));
});
exports.getAllUsers = getAllUsers;
const updateUser = (0, asyncHandler_1.default)(async (req, res) => {
    const adminId = req.user?._id;
    if (!adminId) {
        throw new apiError_1.ApiError(400, "Not authorized to perform operation");
    }
    if (req.user?.role !== 'admin') {
        throw new apiError_1.ApiError(403, "Admin access Only");
    }
    const { userId } = req.params;
    if (!userId) {
        throw new apiError_1.ApiError(404, "Invalid User Id Found");
    }
    const body = user_schema_1.AdminUpdateUserSchema.parse(req.body);
    const { email, fullName, userName, role } = body;
    const updateData = {};
    if (email)
        updateData.email = email;
    if (fullName)
        updateData.fullName = fullName;
    if (userName)
        updateData.userName = userName;
    if (role)
        updateData.role = role;
    const user = await user_model_1.User.findByIdAndUpdate(userId, {
        $set: {
            email,
            fullName,
            userName,
            role
        }
    }, {
        new: true
    });
    if (!user) {
        throw new apiError_1.ApiError(500, "User is not Updated");
    }
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, user, "User has updated successfully"));
});
exports.updateUser = updateUser;
const deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const adminId = req.user?._id;
    if (!adminId) {
        throw new apiError_1.ApiError(404, "Admin Id not found");
    }
    const admin = await user_model_1.User.findById(adminId);
    if (admin?.role !== 'admin') {
        throw new apiError_1.ApiError(404, "Only Admin can delete User");
    }
    const { userId } = req.params;
    if (!userId) {
        throw new apiError_1.ApiError(404, "Current User not found in database");
    }
    const deletedUser = await user_model_1.User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new apiError_1.ApiError(500, "User cannot be deleted Right now , Something went wrong while deleteing User");
    }
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, {}, "User Account deleted Successfully"));
});
exports.deleteUser = deleteUser;
