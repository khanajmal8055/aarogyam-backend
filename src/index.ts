import { error } from "node:console";
import { app } from "./app";
import dbConnection from "./DB";
import * as dotenv from "dotenv"
import { dot } from "node:test/reporters";



dotenv.config({
    path:'./.env'
})

dbConnection()
.then(()=>{
    const server = app.listen(process.env.PORT || 5000 , ()=>{
        console.log(`Server is running at port ${process.env.PORT}`);
        
    })
    
    server.on('error' , (error)=>{
        console.log("error" , error);
        throw error
        
    })

    
}).catch((error)=>{
    console.log(`Db Connection failed : ${error}`);
    
})