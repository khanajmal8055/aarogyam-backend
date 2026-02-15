import { model, Schema } from "mongoose";
import { UDepartment } from "../types/department.types";


const departmentSchema = new Schema<UDepartment>(
    {
        name:{
            type:String,
            required:true,
            unique:true
        },
        description:{
            type:String
        },
        icon:{
            type:String,
            required:true
        },
        isActive:{
            type:Boolean,
            default:true
        }
    },
    {
        timestamps:true
    }
)

export const Department = model('Department' , departmentSchema)