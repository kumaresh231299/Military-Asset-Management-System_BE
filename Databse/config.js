import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const mongoDb_Url = process.env.MONGODB_URL;

const connectDB = async(req,res) =>{
    try {
        const connection = await mongoose.connect(mongoDb_Url);
        console.log("MONGODB Connected Successfully..!");
        return connection;
    } catch (error) {
        res.status(500).json("MONGODB Connection Failed 😑😔😞😤😵‍💫 ");
        console.log(error);
    }
}

export default connectDB;