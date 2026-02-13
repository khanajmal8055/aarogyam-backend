import { Document, ObjectId, Types } from "mongoose";

export interface UAppointment extends Document{
    userId: Types.ObjectId,
    doctorId:Types.ObjectId,

    patientName: string,
    patientAge: number,
    patientContactDetails: string,
    patientEmail: string,

    address:{
        street:string,
        city:string,
        state:string
    }

    appointmentDate:Date,
    timeSlot: string,

    status : 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO-SHOW',

    reason?:string,
    
    visit: 'online' | 'offline',

    bookedBy:Types.ObjectId,
    statusUpdatedBy:Types.ObjectId,
    statusUpdatedAt:Date


    
}