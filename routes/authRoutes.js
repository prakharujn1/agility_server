const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", authController.register);
 
// Login
router.post("/login", authController.login);

// myprofile
router.get("/me", authMiddleware, authController.myprofile);



// Logout
router.post("/logout", authController.logout);

module.exports = router;