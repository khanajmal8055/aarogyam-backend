import * as  dotenv from "dotenv"
dotenv.config()

import dbConnection from "../DB";
import { User } from "../models/user.model";
import { UserRole } from "../types/user.types";

const seedAdmin = async() => {
    await dbConnection()

    const adminExist = await User.findOne({role : UserRole.Admin})

    if(adminExist){
        console.log('Admin is already exists');
        process.exit(0)
        
    }

    await User.create({
        email:'admin@aarogyam.com',
        password:'admin@123',
        role:UserRole.Admin,
        fullName:'Admin',
        userName:'admin123'
    })

    console.log('Admin created Successfully');
    process.exit(0)
    
}

seedAdmin()
