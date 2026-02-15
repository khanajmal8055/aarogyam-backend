"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const department_schema_1 = require("../zod_schema/department.schema");
const department_model_1 = require("../models/department.model");
const mongoose_1 = require("mongoose");
const createDepartment = (0, asyncHandler_1.default)(async (req, res) => {
    if (req.user?.role !== 'admin') {
        throw new apiError_1.ApiError(401, "Only Admin Access");
    }
    const data = department_schema_1.CreateDepartment.parse(req.body);
    const normalizedName = data.name.trim().toLowerCase();
    const existing = await department_model_1.Department.findOne({ name: normalizedName });
    if (existing) {
        throw new apiError_1.ApiError(409, "Department already exists");
    }
    const department = await department_model_1.Department.create({
        name: normalizedName,
        icon: data.icon,
        description: data.description
    });
    return res.status(201)
        .json(new apiResponse_1.ApiResponse(201, department, `Department ${normalizedName} created successfully`));
});
const getDepartment = (0, asyncHandler_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search?.toString() || "";
    const filter = search
        ? { name: { $regex: search, $options: "i" } }
        : {};
    const [departments, total] = await Promise.all([
        department_model_1.Department.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ name: 1 }),
        department_model_1.Department.countDocuments(filter)
    ]);
    const data = {
        departments,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, data, "Department Fetched Successfully"));
});
const removeDepartment = (0, asyncHandler_1.default)(async (req, res) => {
    if (req.user?.role !== 'admin') {
        throw new apiError_1.ApiError(403, "Admin access only");
    }
    const { departmentId } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(departmentId)) {
        throw new apiError_1.ApiError(404, "Invalid Department Id");
    }
    const department = await department_model_1.Department.findById(departmentId);
    if (!department) {
        throw new apiError_1.ApiError(404, "Department not Found");
    }
    if (!department.isActive) {
        throw new apiError_1.ApiError(409, "Department already Inactive");
    }
    department.isActive = false;
    await department.save();
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, department, "Department deactivated successfully"));
});
const updateDepartmentDetails = (0, asyncHandler_1.default)(async (req, res) => {
    if (req.user?.role !== 'admin') {
        throw new apiError_1.ApiError(403, "Admin access only!!");
    }
    const { departmentId } = req.params;
    const data = department_schema_1.UpdateDepartmentDetails.parse(req.body);
    const { name, description, icon } = data;
    if (!(0, mongoose_1.isValidObjectId)(departmentId)) {
        throw new apiError_1.ApiError(400, "Invalid Department Id");
    }
    const department = await department_model_1.Department.findById(departmentId);
    if (!department) {
        throw new apiError_1.ApiError(409, "Department Not Found");
    }
    if (name) {
        const exists = await department_model_1.Department.findOne({
            name: name.trim().toLowerCase(),
        });
        if (exists) {
            throw new apiError_1.ApiError(409, "Department Name Already exists");
        }
        department.name = name.trim().toLowerCase();
    }
    if (description) {
        department.description = description.trim().toLowerCase();
    }
    if (icon) {
        department.icon = icon.trim().toLowerCase();
    }
    await department.save();
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, department, "Department updated Successfully"));
});
