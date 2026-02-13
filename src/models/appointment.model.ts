import mongoose, { model, mongo, Schema } from "mongoose";
import { UAppointment} from "../types/appointment.types";
import { required } from "zod/mini";

const appointmentSchema = new Schema<UAppointment>(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        doctorId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor',
            // required:true
        },

        patientName:{
            type:String,
            required:true,
            trim:true
        },
        patientAge:{
            type:Number,
            required:true,
            min:0,
            max:120
        },
        patientContactDetails:{
            type:String,
            required:true,
            match:/^[0-9]{10}$/
        },
        patientEmail:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            match:/^\S+@\S+\.\S+$/
        },
        address:{
            street:{type:String , required:true},
            city:{type:String , required:true},
            state:{type:String , required:true}
        },

        appointmentDate:{
            type:Date,
            required:true
        },

        timeSlot:{
            type:String,
            required:true,
            match:/^\d{2}:\d{2}-\d{2}:\d{2}$/
        },

        status:{
            type:String,
            enum:['PENDING' , 'CONFIRMED' , 'CANCELLED' , 'COMPLETED' , 'NO-SHOW'],
            default:'PENDING'
        },
        visit:{
            type:String,
            enum:['online' , 'offline'],
            default:'offline'
        },
        reason:{
            type:String
        },
        bookedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        statusUpdatedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        statusUpdatedAt:Date
        
    },
    {
        timestamps:true
    }
)

appointmentSchema.index({doctorId:1 , timeSlot:1 , appointmentDate:1} , {unique:true})
appointmentSchema.index({userId:1})

export const Appointment = model<UAppointment>('Appointment' , appointmentSchema)