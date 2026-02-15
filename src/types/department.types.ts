import { Document } from "mongoose";


export interface UDepartment extends Document{
    name:string,
    description:string,
    icon:string,
    isActive:boolean,
    createdAt:Date,
    updatedAt:Date
}