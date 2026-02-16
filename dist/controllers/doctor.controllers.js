"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const doctor_schema_1 = require("../zod_schema/doctor.schema");
const cloudinary_1 = require("../utils/cloudinary");
const doctor_model_1 = require("../models/doctor.model");
const department_model_1 = require("../models/department.model");
const createDoctor = (0, asyncHandler_1.default)(async (req, res) => {
    if (req.user?.role !== 'admin') {
        throw new apiError_1.ApiError(403, "Admin Access Only!!!");
    }
    const data = doctor_schema_1.CreateDoctorSchema.parse(req.body);
    const selectedDepartment = await department_model_1.Department.findOne({ name: data.department });
    if (!selectedDepartment) {
        throw new apiError_1.ApiError(400, "No Department Found");
    }
    if (!selectedDepartment?.isActive) {
        throw new apiError_1.ApiError(409, "Department is Inactive");
    }
    const exists = await doctor_model_1.Doctor.findOne({
        email: data.email
    });
    if (exists) {
        throw new apiError_1.ApiError(400, "Doctor already stored in database");
    }
    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
        throw new apiError_1.ApiError(404, "Doctor Image is required");
    }
    const uploadedImage = await (0, cloudinary_1.uploadOnCloudinary)(imageLocalPath);
    if (!uploadedImage?.secure_url) {
        throw new apiError_1.ApiError(500, "Failed to upload image on cloudinary");
    }
    const doctor = await doctor_model_1.Doctor.create({
        doctorName: data.doctorName,
        email: data.email,
        consultationFee: data.consultationFee,
        address: data.address,
        profileImage: uploadedImage.secure_url,
        phone: data.phone,
        experience: data.experience,
        specialization: data.specialization,
        gender: data.gender,
        qualification: data.qualification,
        availability: data.availability,
        department: selectedDepartment._id
    });
    return res.status(201)
        .json(new apiResponse_1.ApiResponse(201, doctor, "Doctor created Successfully"));
});
// const deleteDoctor = asyncHandler(async(req:AuthRequest,res:Response)=>{
//     if(req.user?.role !== 'admin'){
//         throw new ApiError(403 , "Admin Access Only!!!")
//     }
//     const {doctorId} = req.par
// })
