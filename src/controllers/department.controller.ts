import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { AuthRequest } from "../types/auth-request";
import { Response } from "express";
import { CreateDepartment, UpdateDepartmentDetails } from "../zod_schema/department.schema";
import { Department } from "../models/department.model";
import { isValidObjectId } from "mongoose";

const createDepartment = asyncHandler(async(req:AuthRequest,res:Response)=>{
    if(req.user?.role !== 'admin'){
        throw new ApiError(401 , "Only Admin Access")
    }

    const data = CreateDepartment.parse(req.body);

    const normalizedName = data.name.trim().toLowerCase()

    const existing = await Department.findOne({name:normalizedName})

    if(existing){
        throw new ApiError(409,"Department already exists")
    }

    

    const department = await Department.create({
        name:normalizedName,
        icon:data.icon,
        description:data.description
    })

    return res.status(201)
    .json(
        new ApiResponse(201 , department , `Department ${normalizedName} created successfully`)
    )
})

const getDepartment = asyncHandler(async(req:AuthRequest,res:Response)=>{
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1) * limit


    const search = req.query.search?.toString() || "";

    const filter = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

    

    const [departments,total] = await Promise.all([
        Department.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({name:1}),

        Department.countDocuments(filter)
    ])

    const data = {
        departments,
        pagination:{
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit)
        }
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , data , "Department Fetched Successfully")
    )


})



const removeDepartment = asyncHandler(async(req:AuthRequest,res:Response)=>{
    if(req.user?.role !== 'admin'){
        throw new ApiError(403 , "Admin access only")
    }

    const {departmentId} = req.params;

    if(!isValidObjectId(departmentId)){
        throw new ApiError(404 , "Invalid Department Id")
    }

    const department = await Department.findById(departmentId)

    if(!department){
        throw new ApiError(404 , "Department not Found")
    }

    if(!department.isActive){
        throw new ApiError(409 , "Department already Inactive")
    }

    department.isActive = false;
    await department.save()

    return res.status(200)
    .json(
        new ApiResponse(200 , department , "Department deactivated successfully")
    )
})

const updateDepartmentDetails = asyncHandler(async(req:AuthRequest,res:Response)=>{
    if(req.user?.role !== 'admin'){
        throw new ApiError(403 , "Admin access only!!")
    }

    const {departmentId} = req.params;

    const data = UpdateDepartmentDetails.parse(req.body);

    const {name,description,icon } = data;

    if(!isValidObjectId(departmentId)){
        throw new ApiError(400 , "Invalid Department Id")
    }

    const department = await Department.findById(departmentId);

    if(!department){
        throw new ApiError(409 , "Department Not Found")
    }

    if(name){

        const exists = await Department.findOne(
            {
                name:name.trim().toLowerCase(),
            }
            
        );

        if(exists){
            throw new ApiError(409 , "Department Name Already exists")
        }

        department.name = name.trim().toLowerCase();
    }

    if(description){
        department.description = description.trim().toLowerCase();
    }

    if(icon){
        department.icon = icon.trim().toLowerCase();
    }

    await department.save()

    return res.status(200)
    .json(
        new ApiResponse(200 , department , "Department updated Successfully")
    )


})

