"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatus = exports.AppointmentReschedule = exports.UpdatePatientInfo = exports.BookAppointmentSchema = void 0;
const zod_1 = require("zod");
exports.BookAppointmentSchema = zod_1.z.object({
    patientName: zod_1.z.string().min(1, "Name is required"),
    patientAge: zod_1.z.number()
        .min(0, "Invalid age")
        .max(120, "Invalid age"),
    patientContactDetails: zod_1.z.string()
        .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
    patientEmail: zod_1.z.email(),
    address: zod_1.z.object({
        street: zod_1.z.string().min(1),
        city: zod_1.z.string().min(1),
        state: zod_1.z.string().min(1)
    }),
    appointmentDate: zod_1.z.coerce.date(),
    timeSlot: zod_1.z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, "Invalid slot format"),
    doctorId: zod_1.z.string()
});
exports.UpdatePatientInfo = zod_1.z.object({
    patientName: zod_1.z.string(),
    patientAge: zod_1.z.number(),
    patientEmail: zod_1.z.email(),
    patientContactDetails: zod_1.z.string(),
    reason: zod_1.z.string()
});
exports.AppointmentReschedule = zod_1.z.object({
    appointmentDate: zod_1.z.coerce.date(),
    timeSlot: zod_1.z.string()
});
exports.UpdateStatus = zod_1.z.object({
    status: zod_1.z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING', 'NO-SHOW'])
});
