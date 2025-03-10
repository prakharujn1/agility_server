const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: sendMail, sendForgotMail } = require("../middleware/sendMail"); // for otp verification

// Register 
exports.register = async (req, res) => {
    const { username, email, password, role = "student" } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists. Please log in or use a different email." });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "This username is taken. Please choose another one." });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // for otp verification
        const otp = Math.floor(100000 + Math.random() * 900000);
        const token = jwt.sign(
            { username, email, password: hashedPassword, role, otp },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );

        await sendMail(email, "OTP Verification", { username, otp });

        res.status(200).json({ message: "OTP sent to your email", token });


        // Create new user with hashed password
        // const user = new User({ username, email, password: hashedPassword, role ,subscription: [],});
        // await user.save();

        // Generate JWT token
        // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        //     expiresIn: "7d",
        // });

        // res.status(201).json({ token, user: { id: user._id, username, email, role: user.role,subscription: user.subscription  } });
    } catch (error) {
        // console.error("Registration error:", error);
        res.status(500).json({ message: "Something went wrong! Please try again later." });
    }
};

exports.verifyUser = async (req, res) => {
    const { otp, token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return res.status(400).json({ message: "Otp Expired" })

    if (decoded.otp !== otp) return res.status(400).json({ message: "Wrong OTP" });


    const user = new User({
        username: decoded.username,
        email: decoded.email,
        password: decoded.password,
        role: decoded.role,
        subscription: [],
    });

    await user.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
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

        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, subscription: user.subscription, } });
    } catch (error) {
        // console.error("Login error:", error);
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
        // console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout (handled on the client side)
exports.logout = (req, res) => {
    res.json({ message: "Logged out successfully" });
};

exports.forgotPassword = async(req,res)=>{
    try{
        const {email} = req.body;
        
        const user = await User.findOne({email});

        if(!user) return res.status(404).json({
                message :"No user with this email",
            })
        
        const token = jwt.sign({email}, process.env.Forgot_Secret)

        const data = {email , token};

        await sendForgotMail("Agility AI", data);

        user.resetPasswordExpire = Date.now() + 10*60*1000;

        await user.save();

        res.json({
            message: "Reset Password Link is sent to your mail"
        })
    }catch(error){
        // console.error("Error in forgot password:", error);
        res.status(500).json({ message: "Server error" });
    }
}


exports.resetPassword = async(req,res)=>{
    try{
        const decodedData = jwt.verify(req.query.token, process.env.Forgot_Secret);

        const user = await User.findOne({email: decodedData.email});

        if(!user) return res.status(404).json({message : "No user with this email"});

        if(user.resetPasswordExpire === null) return res.status(400).json({
            message : "token expired"
        })

        if(user.resetPasswordExpire < Date.now()) return res.status(400).json({
            message : "token expired"
        })
        
        const password = await bcrypt.hash(req.body.password,10);

        user.password = password;

        user.resetPasswordExpire = null;

        await user.save();

        res.json({message: "Password reset successfully"})

    }catch(error){
        // console.error("Error in resetting password:", error);
        res.status(500).json({ message: "Server error" });
    }
}