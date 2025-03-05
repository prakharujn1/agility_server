const Webinar = require("../models/Webinar.js")
const fs = require("fs");

exports.getAllWebinar = async(req,res)=>{
    try{
        const webinars = await Webinar.find();
        res.json({
            webinars,
        })
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

exports.createWebinar = async (req, res) => {
    const { title, description, time, createdBy } = req.body;

    const image = req.file;

    await Webinar.create({
        title,
        description,
        time,
        createdBy,
        image: image?.path,
    });

    res.status(201).json({
        message: "Webinar Created Successfully"
    }
    )
}

exports.deleteWebinar = async (req, res) => {
    try {
        const webinar = await Webinar.findById(req.params.id);
        

        fs.unlink(webinar.image, (err) => {
            if (err) {
                // console.error("Error deleting video file:", err);
            } else {
                // console.log("image deleted");
            }
        })

        await webinar.deleteOne();
        res.json({
            message: "Webinar Deleted"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}



