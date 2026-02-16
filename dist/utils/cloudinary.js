"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath)
            return null;
        const response = await cloudinary_1.v2.uploader.upload(filePath, { resource_type: 'auto' });
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        return response;
    }
    catch (error) {
        fs_1.default.unlinkSync(filePath);
        return null;
    }
};
exports.uploadOnCloudinary = uploadOnCloudinary;
