const express = require("express");
const router = express.Router();
const enquiryController = require("../controllers/enquiryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// Get all enquiries
router.get("/",authMiddleware,  roleMiddleware(["admin"]) , enquiryController.getEnquiries);

// Create an enquiry
router.post("/", enquiryController.createEnquiry);

// Delete an enquiry
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]) , enquiryController.deleteEnquiry);

module.exports = router;