import { PassThrough } from "node:stream"
import {email, z} from "zod"

export const CreateUserSchema = z.object({
    email : z.email(),
    fullName: z.string(),
    userName : z.string(),
    password : z.string().min(6)
})

export const LoginUserSchema = z.object({
    email : z.email(),
    password : z.string()
})

export const UpdateUserSchema = z.object({
    email:z.email(),
    fullName : z.string(),
    userName : z.string()
})

export const UpdatePasswordSchema = z.object({
    newPassword : z.string().min(6),
    oldPassword : z.string()
})

export const AdminCreateUserSchema = z.object({
    email:z.email(),
    password: z.string().min(6),
    userName:z.string(),
    fullName:z.string(),
    role:z.string()
})

export const AdminUpdateUserSchema = z.object({
    email: z.email(),
    userName: z.string(),
    fullName: z.string(),
    role: z.string()
})