import mongoose, { model, Schema } from "mongoose";
import { UDoctor } from "../types/doctor.types";
import { required } from "zod/mini";

const doctorSchema = new Schema<UDoctor>(
    {
        email:{
            type:String,
            required:true,
            lowerCase:true,
            trim:true,
            match:/^\S+@\S+\.\S+$/
        },
        profileImage:{
            type:String,
            required:true
        },
        department:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Department'
        },
        doctorName:{
            type:String,
            required:true
        },
        phone:{
            type:String,
        },
        specialization:{
            type:String,
            required:true
        },
        qualification:{
            type:String,
            required:true
        },
        experience:{
            type:Number,
            required:true
        },
        consultationFee:{
            type:Number,
            required:true
        },
        gender:{
            type:String,
            enum:['male' , 'female' , 'other'],
            default:'male'
        },
        address:{
            street:{type:String , required:true},
            city:{type:String , required:true},
            state:{type:String , required:true}      
        },
        availability:{
            day: {type:String},
            slots:{type:String}
        },
        isActive:{
            type:Boolean,
            default:true
        }
    },{timestamps:true}
)
doctorSchema.index({specialization:1}),
doctorSchema.index({city:1})


export const Doctor = model<UDoctor>('Doctor' , doctorSchema)