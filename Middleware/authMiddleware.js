// import jwt from "jsonwebtoken"
// import User from "../Model/userSchema.js";

// export const protect = async(req,res,next) =>{
//     const token = req.headers.authorization?.split('')[1]; //Get bearer token
//     if(!token) return res.status(401).json({message:"No token,access denied"});
//         try {
//             const decoded = jwt.verify(token,process.env.JWT_SECRET); // verify token
//             req.user = await User.findById(decoded.id).select('-password'); // Add user to request
//             if(!req.user) return res.status(401).json({message:"Unauthorized"});

//             next(); // Go to next middleware or route
//         } catch (error) {
//             return res.status(401).json({message:"Invalid token "})
//         }
    
// }

import jwt from "jsonwebtoken";
import User from "../Model/userSchema.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Correct splitting here

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔐 Verify token

    // Attach user (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next(); // 🚀 Proceed to route or next middleware
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
