const express = require("express");
const {getAllWebinar,createWebinar,deleteWebinar} = require("../controllers/webinarController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const isadminMiddleware = require("../middleware/isadminMiddleware.js");
const { uploadFiles } = require("../middleware/multer.js");
const router = express.Router();

router.get("/webinar/all", getAllWebinar);

router.post('/webinar/new',authMiddleware, isadminMiddleware , uploadFiles , createWebinar);

router.delete("/webinar/:id", authMiddleware, isadminMiddleware, deleteWebinar);

module.exports = router ;