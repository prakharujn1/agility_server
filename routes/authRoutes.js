const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", authController.register);

//otp verification
router.post("/verify", authController.verifyUser);
 
// Login
router.post("/login", authController.login);

// myprofile
router.get("/me", authMiddleware, authController.myprofile);

//forgot password
router.post("/forgot", authController.forgotPassword);

//reset password
router.post("/reset", authController.resetPassword);


// Logout
router.post("/logout", authController.logout);

module.exports = router;