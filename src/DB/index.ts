import mongoose from "mongoose";
import { DB_NAME } from "../constant";

const dbConnection = async():Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Mongo DB connected Successfully || DB Host ${connectionInstance.connection.host}`);
            
    } 
    catch (error) {
        console.log(`Mongo DB Connectivity Error ${error}`);
        process.exit(1)
    }
}

export default dbConnection