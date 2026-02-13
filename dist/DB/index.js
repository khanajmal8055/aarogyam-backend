"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constant_1 = require("../constant");
const dbConnection = async () => {
    try {
        const connectionInstance = await mongoose_1.default.connect(`${process.env.MONGODB_URI}/${constant_1.DB_NAME}`);
        console.log(`Mongo DB connected Successfully || DB Host ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log(`Mongo DB Connectivity Error ${error}`);
        process.exit(1);
    }
};
exports.default = dbConnection;
