import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const mongoDb_Url = process.env.MongoDB_URL;

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoDb_Url);
        console.log("MONGODB Connected Successfully..!");
        return connection;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;