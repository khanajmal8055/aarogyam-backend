
import { ApiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/auth-request";

export const verifyJwt = asyncHandler(async(req:AuthRequest,res:Response,next:NextFunction)=>{
    const token:string = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if(!token){
        throw new ApiError(404 , "Unauthorized Access")
    }

    if(!process.env.ACCESS_TOKEN_SECRET){
        throw new ApiError(500 , "Token has not found")
    }

    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET) as JwtPayload

    const user = await User.findById(decodedToken._id)

    if(!user){
        throw new ApiError(400 , "Invalid Access")
    }

    req.user = user
    next()

})