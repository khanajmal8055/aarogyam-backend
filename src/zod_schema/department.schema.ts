import z from "zod";
import { describe } from "zod/v4/core";

export const CreateDepartment = z.object({
    name: z.string(),
    description : z.string(),
    icon : z.string(),
})

export const UpdateDepartmentDetails = z.object({
    name:z.string(),
    description:z.string(),
    icon:z.string()
})