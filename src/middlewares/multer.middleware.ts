import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req:Request , file , cb)=>{
        cb(null , "./public/temp")
    },
    filename: (req:Request , file , cb)=> {
        const uniqueName = Date.now() + "_" + file.originalname;
        cb(null , uniqueName)
    }
})

const fileFilter = (
    req:Request,
    file:Express.Multer.File,
    cb:FileFilterCallback
)=>{
    const allowedTypes = /jpg|jpeg|png|webp/;
    const ext = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    
    const mime = allowedTypes.test(file.mimetype)

    if(ext && mime){
        cb(null , true)
    }
    else{
        cb(new Error("Only images are allowed"));
    }
}


export const upload = multer({
    storage,
    limits: {fileSize : 5 * 1024 * 1024},
    fileFilter
})