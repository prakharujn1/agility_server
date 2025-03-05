const express = require("express");
const router = express.Router();
const jobApplicationController = require("../controllers/jobApplicationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get all job applications
router.get("/", jobApplicationController.getJobApplications);

// Create a job application
router.post("/", jobApplicationController.createJobApplication);

// Delete a job application(admin)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]) , jobApplicationController.deleteJobApplication);

module.exports = router;