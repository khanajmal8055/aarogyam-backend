import { Document, Types } from "mongoose";

export interface UDoctor extends Document{
    doctorName:string
    email:string
    profileImage:string
    phone:string
    specialization:string
    qualification:string
    experience:number
    consultationFee:number
    gender:"male"|"female"|"other"
    address:{
        street:string
        city:string
        state:string
    }
    availability:{
        day:string
        slots:string
    }
    isActive:boolean
    createdAt:Date
    updatedAt:Date,
    department:Types.ObjectId
}
