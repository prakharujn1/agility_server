const Recording = require("../models/Recording.js")
const fs = require("fs");

exports.getAllRecording = async(req,res)=>{
    try{
        const recordings = await Recording.find();
        res.json({
            recordings,
        })
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

exports.createRecording = async (req, res) => {
    const { title, description, time, createdBy,link } = req.body;

    const image = req.file;

    await Recording.create({
        title,
        description,
        time,
        createdBy,
        link,
        image: image?.path,
    });

    res.status(201).json({
        message: "Recording Created Successfully"
    }
    )
}

exports.deleteRecording = async (req, res) => {
    try {
        const recording = await Recording.findById(req.params.id);
        

        fs.unlink(recording.image, (err) => {
            if (err) {
                // console.error("Error deleting video file:", err);
            } else {
                // console.log("image deleted");
            }
        })

        await recording.deleteOne();
        res.json({
            message: "Recording Deleted"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}



