import { model, Schema } from "mongoose";
import { IUserDocumnet, UserRole } from "../types/user.types";
import * as bcrypt from "bcrypt"
 import * as  jwt from "jsonwebtoken"

const userSchema= new Schema<IUserDocumnet>(
    {
        email:{
            type:String,
            required:true,
            lowercase:true,
        },
        fullName:{
            type:String,
            required:true,

        },
        userName:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        password:{
            type:String,
            required:true,
            select:false
        },
        role:{
            type:String,
            enum:['user' , 'receptionist' ,'admin'],
            default:UserRole.User
        },
        createdAt:{
            type:Date
        },
        updatedAt:{
            type:Date
        },
        refreshToken :{
            type:String,
            select : false
        },
        accessToken : {
            type:String
        }
    },
    {timestamps:true}
) 

userSchema.pre<IUserDocumnet>("save" , async function() {
    if(!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password , 10)
})

userSchema.methods.isPasswordCorrect = async function(password:string):Promise<boolean> {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            userName:this.userName,
            fullName:this.fullName,
            role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn:'1d'
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn:"10d"
        }
    )
}

export const User = model<IUserDocumnet>('User' , userSchema)