"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const doctorSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        lowerCase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/
    },
    profileImage: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    specialization: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    consultationFee: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male'
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    availability: {
        day: { type: String },
        slots: { type: String }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
doctorSchema.index({ specialization: 1 }),
    doctorSchema.index({ city: 1 });
exports.Doctor = (0, mongoose_1.model)('Doctor', doctorSchema);
