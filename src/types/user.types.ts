import {Document} from "mongoose"

export enum UserRole {
    Admin = "admin",
    Receptionist = 'receptionist',
    User = 'user'

}

export interface IUser {
    email:string,
    fullName:string,
    userName:string,
    password:string,
    role:UserRole,
    refreshToken:string,
    accessToken:string,
    createdAt:Date,
    updatedAt:Date
}


export interface IUserDocumnet extends IUser , Document {
    isPasswordCorrect(password:string):Promise<boolean>,
    generateAccessToken():string,
    generateRefreshToken():string
}