import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { AuthRequest } from "../types/auth-request";
import { Response } from "express";
import { CreateDoctorSchema } from "../zod_schema/doctor.schema";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Doctor } from "../models/doctor.model";
import { Department } from "../models/department.model";
import { isValidObjectId } from "mongoose";
import { equal } from "node:assert";
import { Appointment } from "../models/appointment.model";


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

const removeDoctor = asyncHandler(async(req:AuthRequest,res:Response)=>{
    
    if(req.user?.role !== 'admin'){
        throw new ApiError(403 , "Admin Access Only!!!")
    }

    const {doctorId} = req.params;

    if(!isValidObjectId(doctorId)){
        throw new ApiError(400 , "Invalid Doctor Id")
    }

    const doctor = await Doctor.findById(doctorId)

    if(!doctor){
        throw new ApiError(404, "Doctor not Found")
    }

    if(!doctor.isActive){
        throw new ApiError(409 , "Dcotor is already inactive") 
    }

    const hasAppointment = await Appointment.exists({
        doctorId:doctor._id,
        status : {$in : ['CONFIRMED']}
    })

    doctor.isActive = false;
    await doctor.save()

    return res.status(200)
    .json(
        new ApiResponse(200 , {} , 'Doctor Inactive successfully')
    )
})

// const updateDoctorFeesCharge = asyncHandler(async(req:AuthRequest,res:Response)=>{
//     if(req.user?.role !== 'admin'){
//         throw new ApiError(403, "Admin Access Only!!!")
//     }

//     const {doctorId} = req.params;

//     if(!isValidObjectId(doctorId)){
//         throw new ApiError(400 , "Invalid Doctor Id")
//     }

//     const doctor = await Doctor.findById(doctorId)

//     if(!doctor){
//         throw new 
//     }
// })