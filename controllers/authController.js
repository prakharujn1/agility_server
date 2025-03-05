const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 
// Register 
exports.register = async (req, res) => {
    const { username, email, password, role = "user" } = req.body; // Default role

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with hashed password
        const user = new User({ username, email, password: hashedPassword, role ,subscription: [],});
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({ token, user: { id: user._id, username, email, role: user.role,subscription: user.subscription  } });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials (No user found)" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials (Incorrect password)" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role,subscription: user.subscription, } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.myprofile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout (handled on the client side)
exports.logout = (req, res) => {
    res.json({ message: "Logged out successfully" });
};
