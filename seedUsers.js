import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./Databse/config.js";
import User from "./Model/userSchema.js";

dotenv.config();
connectDB();

const seedUsers = async () => {
    await User.deleteMany();


    const users = [
        {
            name: "Admin",
            email: "admin@example.com",
            password: await bcrypt.hash('admin321', 10),
            role: 'admin'
        },
        {
            name: "Commander",
            email: "commander@alpha.com",
            password: await bcrypt.hash('cmd321', 10),
            role: "base_commander",
            base: "Alpha Base"
        },
        {
            name: "Log Officer",
            email: "log@alpha.com",
            password: await bcrypt.hash('log321', 10),
            role: 'logistic_officer',
            base: 'Alpha Base'
        }
    ];

    await User.insertMany(users);
    console.log("Users Seeded");
    process.exit();

}

seedUsers();