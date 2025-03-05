const express = require("express");
const { getAllCourses, getSingleCourse, fetchLectures, fetchLecture, getMyCourses, checkout, paymentVerification } = require("../controllers/courseController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", authMiddleware , fetchLectures);
router.get("/lecture/:id", authMiddleware , fetchLecture);
router.get("/mycourse",authMiddleware, getMyCourses)
router.post("/course/checkout/:id",authMiddleware, checkout)
router.post("/verification/:id",authMiddleware, paymentVerification);


module.exports = router ;