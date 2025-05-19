const Projects = require("../models/Projects.js")
const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");


exports.getAllProjects = async(req,res)=>{
    try{
        const project = await Projects.find(); 
        res.json({
            project,
        })
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

exports.createProject = async (req, res) => {
  const { title, description, createdBy, link } = req.body;
  const filePath = req.file.path;

  const result = await cloudinary.uploader.upload(filePath, { folder: "projects" });
  fs.unlinkSync(filePath);           // delete local temp file

  await Projects.create({
    title,
    description,
    createdBy,
    link,
    image: result.secure_url,        // for the frontend
    imageId: result.public_id        // <= NEW: keep this for deletes
  });

  res.status(201).json({ message: "Project Created Successfully" });
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Projects.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 1. Delete from Cloudinary
    await cloudinary.uploader.destroy(project.imageId);

    // 2. Delete the DB record
    await project.deleteOne();

    res.json({ message: "Project Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



