import mongoose from "mongoose";

export const objectId = (id:string)=> id as unknown as mongoose.Types.ObjectId