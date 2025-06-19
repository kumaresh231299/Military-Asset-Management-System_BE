import User from "../Model/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        //Find User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid " });

        //Create Token
        const token = jwt.sign(
            { id: user._id, role: user.role, base: user.base },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            base: user.base,
            token
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}