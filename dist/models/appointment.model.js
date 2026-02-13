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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const appointmentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Doctor',
        // required:true
    },
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    patientAge: {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },
    patientContactDetails: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    patientEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true,
        match: /^\d{2}:\d{2}-\d{2}:\d{2}$/
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO-SHOW'],
        default: 'PENDING'
    },
    visit: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    reason: {
        type: String
    },
    bookedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    statusUpdatedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    statusUpdatedAt: Date
}, {
    timestamps: true
});
appointmentSchema.index({ doctorId: 1, timeSlot: 1, appointmentDate: 1 }, { unique: true });
appointmentSchema.index({ userId: 1 });
exports.Appointment = (0, mongoose_1.model)('Appointment', appointmentSchema);
