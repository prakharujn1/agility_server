const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const isadminMiddleware = require("../middleware/isadminMiddleware.js");
const { uploadFiles } = require("../middleware/multer.js");
const { getAllProjects, createProject, deleteProject } = require("../controllers/projectsController.js");
const router = express.Router();

router.get("/projects/all", getAllProjects);

router.post('/projects/new',authMiddleware, isadminMiddleware , uploadFiles , createProject);

router.delete("/projects/:id", authMiddleware, isadminMiddleware, deleteProject);

module.exports = router ;