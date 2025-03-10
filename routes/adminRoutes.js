const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createCourse, addLectures, deleteLecture, deleteCourse, getAllStats, getAllAdmins, downgradeRole, upgradeRole, addAssignment, deleteAssignment } = require("../controllers/adminController");
const { uploadFiles } = require("../middleware/multer");
const isadminMiddleware = require("../middleware/isadminMiddleware");
const router = express.Router();


router.post('/course/new',authMiddleware, isadminMiddleware , uploadFiles , createCourse);

router.post("/course/:id",authMiddleware, isadminMiddleware, uploadFiles, addLectures);

router.delete("/course/:id", authMiddleware, isadminMiddleware, deleteCourse);

router.delete("/lecture/:id",authMiddleware , isadminMiddleware, deleteLecture);

router.get("/stats", authMiddleware, isadminMiddleware , getAllStats);

router.get("/users",authMiddleware, isadminMiddleware, getAllAdmins);

router.put("/user/dgrade/:id", authMiddleware,isadminMiddleware, downgradeRole);

router.put("/user/upgrade", authMiddleware, isadminMiddleware,upgradeRole);


//add assignment 
router.post("/course/assignment/:id",authMiddleware, isadminMiddleware, uploadFiles, addAssignment);
//delete assignment
router.delete("/assignment/:id",authMiddleware , isadminMiddleware, deleteAssignment);



module.exports = router ;