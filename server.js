require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const authRoutes = require("./routes/authRoutes");
const jobListingRoutes = require("./routes/jobListingRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const webinarRoutes = require("./routes/webinarRoutes");


const razorpay = require("./config/razorpay");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use("/uploads",express.static("uploads"))

// Enable CORS
app.use(cors()); 

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/joblistings", jobListingRoutes);
app.use("/api/jobapplications", jobApplicationRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api", courseRoutes); 
app.use("/api", adminRoutes);
app.use("/api",webinarRoutes);


// MongoDB Connection
mongoose
    .connect(process.env.mongo_url)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
