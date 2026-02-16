import z from "zod";

export const CreateDoctorSchema = z.object({
    doctorName:z.string(),
    email:z.email(),
    profileImage:z.string(),
    department:z.string(),
    phone:z.string(),
    specialization:z.string(),
    qualification:z.string(),
    experience:z.number(),
    consultationFee:z.number(),
    gender:z.enum(['male' , 'female' , 'other']),
    address: z.object({
        street:z.string(),
        city:z.string(),
        state:z.string()
    }),
    availability:z.object({
        day:z.string(),
        slots:z.string()
    }),
    

})