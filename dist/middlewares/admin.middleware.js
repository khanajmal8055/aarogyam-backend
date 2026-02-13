"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const user_model_1 = require("../models/user.model");
const apiError_1 = require("../utils/apiError");
const isAdmin = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user?._id);
        if (!user) {
            throw new apiError_1.ApiError(400, "Invalid User");
        }
        if (user.role !== 'admin') {
            throw new apiError_1.ApiError(400, "Admin Access Only!!!");
        }
        next();
    }
    catch (error) {
        next(new apiError_1.ApiError(400, "Internal Sever Error"));
    }
};
exports.isAdmin = isAdmin;
