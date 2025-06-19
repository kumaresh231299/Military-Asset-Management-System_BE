import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'base_commander', 'logistic_officer'],
        reuired: true
    },
    base: { type: String, default: "" } // only for Base_Commander / Logisti_Officer
});

const User = mongoose.model("User", userSchema);

export default User;