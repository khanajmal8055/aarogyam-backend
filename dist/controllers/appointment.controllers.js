"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleAppointment = exports.cancelAppointment = exports.updateAppointment = exports.updateAppointmentStatus = exports.getAllAppointments = exports.getAppointment = exports.bookAppointment = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const appointment_schema_1 = require("../zod_schema/appointment.schema");
const mongoose_1 = __importStar(require("mongoose"));
const doctor_model_1 = require("../models/doctor.model");
const appointment_model_1 = require("../models/appointment.model");
// Public User Controllers
const bookAppointment = (0, asyncHandler_1.default)(async (req, res) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (!req.user?._id) {
            throw new apiError_1.ApiError(400, "Login Required to Book Appointment ");
        }
        const data = appointment_schema_1.BookAppointmentSchema.parse(req.body);
        const doctor = await doctor_model_1.Doctor.findById(data.doctorId).session(session);
        if (!doctor) {
            throw new apiError_1.ApiError(404, "Doctor not found");
        }
        const existing = await appointment_model_1.Appointment.findOne({
            doctorId: data.doctorId,
            appointmentDate: data.appointmentDate,
            timeSlot: data.timeSlot
        }).session(session);
        if (existing) {
            throw new apiError_1.ApiError(400, "Slot already booked");
        }
        const appointment = await appointment_model_1.Appointment.create([{
                doctorId: data.doctorId,
                userId: req.user?._id,
                patientName: data.patientName,
                patientAge: data.patientAge,
                patientContactDetails: data.patientContactDetails,
                patientEmail: data.patientEmail,
                address: data.address,
                appointmentDate: data.appointmentDate,
                timeSlot: data.timeSlot,
                bookedBy: req.user._id
            }], { session });
        await session.commitTransaction();
        return res.status(201)
            .json(new apiResponse_1.ApiResponse(201, appointment, "Appointment created successfully"));
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
});
exports.bookAppointment = bookAppointment;
const getAppointment = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new apiError_1.ApiError(400, "Login Required");
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { type } = req.query;
    const today = new Date();
    const filter = { bookedBy: userId };
    if (type === 'past') {
        filter.appointmentDate = { $lt: today };
    }
    if (type === 'upcoming') {
        filter.appointmentDate = { $gte: today };
    }
    const appointments = await appointment_model_1.Appointment.find(filter)
        .populate("doctorId", "name specialization profileImage")
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(limit);
    if (!appointments) {
        throw new apiError_1.ApiError(500, "No Appointments found");
    }
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, appointments, "Appointment Record Fetched successfully"));
});
exports.getAppointment = getAppointment;
const updateAppointment = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new apiError_1.ApiError(401, "Login Required");
    }
    const { appointmentId } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(appointmentId)) {
        throw new apiError_1.ApiError(400, "Invalid Appointment Id");
    }
    const appointment = await appointment_model_1.Appointment.findById(appointmentId);
    if (!appointment) {
        throw new apiError_1.ApiError(404, "No Appointment Found");
    }
    if (appointment.bookedBy.toString() !== userId.toString()) {
        throw new apiError_1.ApiError(403, "You are not authorized to update the appointment");
    }
    if (["COMPLETED", "CANCELLED", "NO-SHOW"].includes(appointment.status)) {
        throw new apiError_1.ApiError(400, "Appointment can no longer be modified");
    }
    const data = appointment_schema_1.UpdatePatientInfo.parse(req.body);
    Object.assign(appointment, data);
    await appointment.save();
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, appointment, "Appointment has updated successfully"));
});
exports.updateAppointment = updateAppointment;
const rescheduleAppointment = (0, asyncHandler_1.default)(async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userId = req.user?._id;
        const { appointmentId } = req.params;
        const data = appointment_schema_1.AppointmentReschedule.parse(req.body);
        const { appointmentDate, timeSlot } = data;
        if (!userId) {
            throw new apiError_1.ApiError(401, "Login Required");
        }
        if (!(0, mongoose_1.isValidObjectId)(appointmentId)) {
            throw new apiError_1.ApiError(400, "Invalid Appointment Id");
        }
        const appointment = await appointment_model_1.Appointment.findById(appointmentId).session(session);
        if (!appointment) {
            throw new apiError_1.ApiError(404, "Appointment not found");
        }
        if (appointment.bookedBy.toString() !== userId.toString()) {
            throw new apiError_1.ApiError(403, "Not Authorized");
        }
        if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
            throw new apiError_1.ApiError(400, "Appointment cannot be reschedule now");
        }
        const exists = await appointment_model_1.Appointment.findOne({
            doctorId: appointment.doctorId,
            appointmentDate,
            timeSlot
        }).session(session);
        if (exists) {
            throw new apiError_1.ApiError(400, "Slot already booked");
        }
        appointment.appointmentDate = appointmentDate,
            appointment.timeSlot = timeSlot;
        await appointment.save({ session });
        await session.commitTransaction();
        return res.status(200)
            .json(new apiResponse_1.ApiResponse(200, appointment, "Appointment Reschedule successfully"));
    }
    catch (error) {
        await session.abortTransaction();
        if (error.code === 11000) {
            throw new apiError_1.ApiError(400, "Slot already booked");
        }
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.rescheduleAppointment = rescheduleAppointment;
const cancelAppointment = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new apiError_1.ApiError(400, "Login Required");
    }
    const { appointmentId } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(appointmentId)) {
        throw new apiError_1.ApiError(400, "Invalid Appointment Id");
    }
    const appointment = await appointment_model_1.Appointment.findById(appointmentId);
    if (!appointment) {
        throw new apiError_1.ApiError(404, "Appointment not Found");
    }
    if (appointment.bookedBy.toString() !== userId.toString()) {
        throw new apiError_1.ApiError(403, "Not Authorized");
    }
    if (['CANCELLED', 'COMPLETED'].includes(appointment.status)) {
        throw new apiError_1.ApiError(400, "Appointment cannot be cancelled");
    }
    const now = new Date();
    const diff = appointment.appointmentDate.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 2) {
        throw new apiError_1.ApiError(400, "Cannot cancel within 2 hours");
    }
    appointment.status = 'CANCELLED';
    await appointment.save();
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, appointment, "Appointment Cancelled Successfully"));
});
exports.cancelAppointment = cancelAppointment;
// Admin Controllers
const getAllAppointments = (0, asyncHandler_1.default)(async (req, res) => {
    if (req.user?.role !== 'admin') {
        throw new apiError_1.ApiError(403, "Admin access only");
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, date } = req.query;
    const filter = {};
    if (status) {
        filter.status = status;
    }
    if (date) {
        const selected = new Date(date);
        const nextDay = new Date(selected);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.appointmentDate = {
            $gte: selected,
            $lt: nextDay
        };
    }
    const appointments = await appointment_model_1.Appointment.find(filter)
        .populate("doctorId", "name specialization")
        .populate("bookedBy", "fullName email")
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(limit);
    const total = await appointment_model_1.Appointment.countDocuments(filter);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        appointments
    }, "All appointments fetched"));
});
exports.getAllAppointments = getAllAppointments;
const updateAppointmentStatus = (0, asyncHandler_1.default)(async (req, res) => {
    if (req.user?.role !== 'admin') {
        throw new apiError_1.ApiError(403, "Admin access only");
    }
    const { appointmentId } = req.params;
    const { status } = appointment_schema_1.UpdateStatus.parse(req.body);
    if (!(0, mongoose_1.isValidObjectId)(appointmentId)) {
        throw new apiError_1.ApiError(400, "Invalid Appointment Id");
    }
    const appointment = await appointment_model_1.Appointment.findById(appointmentId);
    if (!appointment) {
        throw new apiError_1.ApiError(404, "Appointment Not Found");
    }
    const allowedTransition = {
        PENDING: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["COMPLETED", "CANCELLED", "NO-SHOW"],
        COMPLETED: [],
        CANCELLED: [],
        "NO-SHOW": []
    };
    const currentStatus = appointment.status;
    const allowed = allowedTransition[currentStatus];
    if (!allowed?.includes(status)) {
        throw new apiError_1.ApiError(400, `Cannot change status from ${currentStatus} to ${status}`);
    }
    appointment.status = status;
    await appointment.save();
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, appointment, "Appointment status updated successfully"));
});
exports.updateAppointmentStatus = updateAppointmentStatus;
