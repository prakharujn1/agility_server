const Projects = require("../models/Projects.js")
const fs = require("fs");

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
    const { title, description, createdBy,link } = req.body;

    const image = req.file;

    await Projects.create({
        title,
        description,
        createdBy,
        link,
        image: image?.path,
    });

    res.status(201).json({
        message: "Projects Created Successfully"
    }
    )
}

exports.deleteProject = async (req, res) => {
    try {
        const project = await Projects.findById(req.params.id);
        

        fs.unlink(project.image, (err) => {
            if (err) {
                // console.error("Error deleting video file:", err);
            } else {
                // console.log("image deleted");
            }
        })

        await project.deleteOne();
        res.json({
            message: "Project Deleted"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}



