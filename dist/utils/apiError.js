"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    success = false;
    error;
    constructor(statusCode, message = 'Something Went Wrong', error = []) {
        super(message);
        this.statusCode = statusCode,
            this.error = error;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
