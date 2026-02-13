import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response } from "express";
import { AppointmentReschedule, BookAppointmentSchema, UpdatePatientInfo, UpdateStatus } from "../zod_schema/appointment.schema";
import { AuthRequest } from "../types/auth-request";
import mongoose, { isValidObjectId } from "mongoose";
import { Doctor } from "../models/doctor.model";
import { Appointment } from "../models/appointment.model";
import { unknown } from "zod";
import { objectId } from "../utils/objectIdConverter";
import { app } from "../app";

// Public User Controllers
const bookAppointment = asyncHandler(async(req:AuthRequest,res:Response)=>{
    
    const session = await mongoose.startSession()

    
    try {
        session.startTransaction()
    
        if(!req.user?._id){
            throw new ApiError(400 , "Login Required to Book Appointment ")
        }

        const data = BookAppointmentSchema.parse(req.body)

        const doctor = await Doctor.findById(data.doctorId).session(session)

        if(!doctor){
            throw new ApiError(404 , "Doctor not found")
        }

        const existing = await Appointment.findOne({
           doctorId:data.doctorId,
           appointmentDate:data.appointmentDate,
           timeSlot:data.timeSlot
        }).session(session)
        
        if(existing){
            throw new ApiError(400 , "Slot already booked")
        }

        const appointment = await Appointment.create([{
            doctorId:data.doctorId,
            userId: req.user?._id,
            patientName: data.patientName,
            patientAge: data.patientAge,
            patientContactDetails: data.patientContactDetails,
            patientEmail: data.patientEmail,
            address: data.address,
            appointmentDate: data.appointmentDate,
            timeSlot: data.timeSlot,
            bookedBy: req.user._id
        }] , {session})

       await session.commitTransaction()

       return res.status(201)
       .json(
        new ApiResponse(201 , appointment , "Appointment created successfully")
       )
    
    } 
    catch (error) {
        await session.abortTransaction()
        throw error
    }
    finally{
        await session.endSession()
    }

    
})

const getAppointment = asyncHandler(async(req:AuthRequest,res:Response)=>{
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(400 , "Login Required")
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { type } = req.query
    const today = new Date()

    const filter:any = {bookedBy : userId}

    if(type === 'past'){
        filter.appointmentDate = {$lt:today}
    }

    if(type === 'upcoming') {
        filter.appointmentDate = {$gte:today}
    }

    const appointments = await Appointment.find(filter)
    .populate("doctorId" , "name specialization profileImage")
    .sort({appointmentDate:-1})
    .skip(skip)
    .limit(limit)

    if(!appointments){
        throw new ApiError(500 , "No Appointments found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , appointments , "Appointment Record Fetched successfully")
    )
})

const updateAppointment = asyncHandler(async(req:AuthRequest , res:Response)=>{
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(401 , "Login Required")
    }

    const {appointmentId} = req.params;

    if(!isValidObjectId(appointmentId)){
        throw new ApiError(400 , "Invalid Appointment Id")
    }


    const appointment = await Appointment.findById(appointmentId)

    if(!appointment){
        throw new ApiError(404 , "No Appointment Found")
    }

    if(appointment.bookedBy.toString() !== userId.toString()){
        throw new ApiError(403 , "You are not authorized to update the appointment")
    }

    if(["COMPLETED" , "CANCELLED" , "NO-SHOW"].includes(appointment.status)){
        throw new ApiError(400 ,"Appointment can no longer be modified")
    }

    const data = UpdatePatientInfo.parse(req.body);

    Object.assign(appointment,data)

    await appointment.save()
    

    

    return res.status(200)
    .json(
        new ApiResponse(200 , appointment , "Appointment has updated successfully")
    )

})

const rescheduleAppointment = asyncHandler(async(req:AuthRequest,res:Response)=>{
    
    const session = await mongoose.startSession()
    session.startTransaction()
    
    try {
        const userId = req.user?._id;
        const {appointmentId} = req.params

        const data = AppointmentReschedule.parse(req.body);

        const {appointmentDate , timeSlot} = data

        if(!userId){
            throw new ApiError(401 , "Login Required")
        }

        if(!isValidObjectId(appointmentId)){
            throw new ApiError(400 , "Invalid Appointment Id")
        }

        const appointment = await Appointment.findById(appointmentId).session(session)

        if(!appointment){
            throw new ApiError(404 , "Appointment not found")
        }

        if(appointment.bookedBy.toString() !== userId.toString()){
            throw new ApiError(403 ,"Not Authorized")
        }

        if(!['PENDING' , 'CONFIRMED'].includes(appointment.status)){
            throw new ApiError(400 , "Appointment cannot be reschedule now")
        }

        const exists = await Appointment.findOne({
            doctorId:appointment.doctorId,
            appointmentDate,
            timeSlot
        }).session(session)

        if(exists){
            throw new ApiError(400 ,"Slot already booked")
        }

        appointment.appointmentDate = appointmentDate,
        appointment.timeSlot = timeSlot

        await appointment.save({session})

        await session.commitTransaction()

        return res.status(200)
        .json(
            new ApiResponse(200 , appointment , "Appointment Reschedule successfully")
        )
    
    } 
    catch (error:any) {
        await session.abortTransaction()
        
        if(error.code === 11000){
            throw new ApiError(400 ,"Slot already booked")
        }
        throw error
    }
    finally{
        session.endSession()
    }


})

const cancelAppointment = asyncHandler(async(req:AuthRequest,res:Response)=>{
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(400 , "Login Required")
    }
    const {appointmentId} = req.params;

    if(!isValidObjectId(appointmentId)){
        throw new ApiError(400 , "Invalid Appointment Id")
    }

    const appointment = await Appointment.findById(appointmentId)

    if(!appointment){
        throw new ApiError(404 , "Appointment not Found")
    }

    if(appointment.bookedBy.toString() !== userId.toString()){
        throw new ApiError(403 , "Not Authorized")
    }

    if(['CANCELLED' , 'COMPLETED'].includes(appointment.status)){
        throw new ApiError(400 , "Appointment cannot be cancelled")
    }

    const now = new Date();
    const diff = appointment.appointmentDate.getTime() - now.getTime()
    const hours = diff / (1000 * 60 * 60)

    if(hours < 2){
        throw new ApiError(400 , "Cannot cancel within 2 hours")
    }

    appointment.status = 'CANCELLED'
    await appointment.save()

    return res.status(200)
    .json(
        new ApiResponse(200 , appointment , "Appointment Cancelled Successfully")
    )
})


// Admin Controllers

const getAllAppointments = asyncHandler(async(req:AuthRequest,res:Response)=>{
    if(req.user?.role !== 'admin'){
        throw new ApiError(403 , "Admin access only")
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const { status, date } = req.query

    const filter: any = {}

    if (status) {
        filter.status = status
    }

    if (date) {
        const selected = new Date(date as string)
        const nextDay = new Date(selected)
        nextDay.setDate(nextDay.getDate() + 1)

        filter.appointmentDate = {
            $gte: selected,
            $lt: nextDay
        }
    }

    const appointments = await Appointment.find(filter)
        .populate("doctorId", "name specialization")
        .populate("bookedBy", "fullName email")
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(limit)

    const total = await Appointment.countDocuments(filter)

    return res.status(200).json(
        new ApiResponse(200, {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            appointments
        }, "All appointments fetched")
    )
})

const updateStatus = asyncHandler(async(req:AuthRequest,res:Response)=>{
    
    if(req.user?.role !== 'admin'){
        throw new ApiError(403 , "Admin access only")
    }
    const { appointmentId } = req.params;

    const {status} = req.body;


    if(!isValidObjectId(appointmentId)){
        throw new ApiError(400 , "Invalid Appointment Id")
    }

    const appointment = await Appointment.findById(appointmentId)

    if(!appointment){
        throw new ApiError(404 , "Appointment Not Found")
    }

    const allowedTransition:Record<string,string[]> = {
        PENDING: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["COMPLETED", "CANCELLED", "NO-SHOW"],
        COMPLETED: [],
        CANCELLED: [],
        "NO-SHOW": []
    }

    const currentStatus = appointment.status;
    const allowed = allowedTransition[currentStatus];

    if(!allowed?.includes(status)){
        throw new ApiError(400 , `Cannot change status from ${currentStatus} to ${status}`)
    }

    appointment.status = status;

    await appointment.save()

    return res.status(200)
    .json(
        new ApiResponse(200 , appointment , "Appointment status updated successfully")
    )

    
})

