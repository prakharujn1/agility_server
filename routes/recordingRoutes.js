const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const isadminMiddleware = require("../middleware/isadminMiddleware.js");
const { uploadFiles } = require("../middleware/multer.js");
const { getAllRecording, deleteRecording, createRecording } = require("../controllers/recordingController.js");
const router = express.Router();

router.get("/recording/all", getAllRecording);

router.post('/recording/new',authMiddleware, isadminMiddleware , uploadFiles , createRecording);

router.delete("/recording/:id", authMiddleware, isadminMiddleware, deleteRecording);

module.exports = router ;