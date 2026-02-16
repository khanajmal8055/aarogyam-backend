"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "_" + file.originalname;
        cb(null, uniqueName);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;
    const ext = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images are allowed"));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});
