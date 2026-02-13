import mongoose from "mongoose"
import { z } from "zod"

export const BookAppointmentSchema = z.object({
    patientName: z.string().min(1, "Name is required"),

    patientAge: z.number()
        .min(0, "Invalid age")
        .max(120, "Invalid age"),

    patientContactDetails: z.string()
        .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),

    patientEmail: z.email(),

    address: z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1)
    }),

    appointmentDate: z.coerce.date(),

    timeSlot: z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, "Invalid slot format"),

    doctorId : z.string()
})

export const UpdatePatientInfo = z.object({
    patientName: z.string(),
    patientAge: z.number(),
    patientEmail: z.email(),
    patientContactDetails: z.string(),
    reason: z.string()
})

export const AppointmentReschedule = z.object({
    appointmentDate: z.coerce.date(),
    timeSlot: z.string()
}) 

export const UpdateStatus = z.object({
    status : z.enum(['CONFIRMED' , 'CANCELLED' , 'COMPLETED'])
})