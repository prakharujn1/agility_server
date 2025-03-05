const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const jobListingController = require("../controllers/jobListingController");

// Get all job listings (public)
router.get("/", jobListingController.getJobListings);

// Create, update, delete job listings (admin only)
router.post("/", authMiddleware, roleMiddleware(["admin"]), jobListingController.createJobListing);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), jobListingController.updateJobListing);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), jobListingController.deleteJobListing);

module.exports = router;