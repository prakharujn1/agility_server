const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async(req, res, next) => {
    // console.log("Headers received:", req.headers);
     // Debugging: Log headers
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded token:", decoded); 
        // Debugging: Log decoded token

        const user = await User.findById(decoded.id).populate("subscription");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        // console.error("Token verification error:", error);
        //  // Debugging: Log the error
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;