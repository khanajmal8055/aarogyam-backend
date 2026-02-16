import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { AuthRequest } from "../types/auth-request";
import { Response } from "express";
import { CreateDoctorSchema } from "../zod_schema/doctor.schema";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Doctor } from "../models/doctor.model";
import { Department } from "../models/department.model";


const createDoctor = asyncHandler(async(req:AuthRequest,res:Response)=>{
    if(req.user?.role !== 'admin'){
        throw new ApiError(403 , "Admin Access Only!!!")
    }

    const data = CreateDoctorSchema.parse(req.body);

    const selectedDepartment = await Department.findOne({name:data.department})

    if(!selectedDepartment){
        throw new ApiError(400 , "No Department Found")
    }

    if(!selectedDepartment?.isActive){
        throw new ApiError(409 , "Department is Inactive")
    }

    const exists = await Doctor.findOne({
        email:data.email
    })

    if(exists){
        throw new ApiError(400 , "Doctor already stored in database")
    }
    
    const imageLocalPath = req.file?.path
    
    if(!imageLocalPath){
        throw new ApiError(404, "Doctor Image is required")
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath)

    if(!uploadedImage?.secure_url){
        throw new ApiError(500 , "Failed to upload image on cloudinary")
    }

    const doctor = await Doctor.create({
        doctorName:data.doctorName,
        email:data.email,
        consultationFee:data.consultationFee,
        address:data.address,
        profileImage:uploadedImage.secure_url,
        phone:data.phone,
        experience:data.experience,
        specialization:data.specialization,
        gender:data.gender,
        qualification:data.qualification,
        availability:data.availability,
        department:selectedDepartment._id

    })

    return res.status(201)
    .json(
        new ApiResponse(201 , doctor , "Doctor created Successfully")
    )
    

})

// const deleteDoctor = asyncHandler(async(req:AuthRequest,res:Response)=>{
    
//     if(req.user?.role !== 'admin'){
//         throw new ApiError(403 , "Admin Access Only!!!")
//     }

//     const {doctorId} = req.par
// })