import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth-request";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";

export const isAdmin = async(req:AuthRequest , res:Response , next:NextFunction)=>{
   try {
     const user = await User.findById(req.user?._id)
 
     if(!user){
         throw new ApiError(400 , "Invalid User")
     }
 
     if(user.role !== 'admin'){
         throw new ApiError(400 , "Admin Access Only!!!")
     }
 
     next()
   } 
   catch (error) {
        next(new ApiError(400  , "Internal Sever Error")) 
   }
}