const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");
const Webinar = require("../models/Webinar");

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
  try {
    const { title, description, time, createdBy, room_id } = req.body;
    const filePath = req.file.path;               // multer temp file

    // ⬆️ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "webinars",                         // e.g. /webinars/banner.png
    });

    fs.unlinkSync(filePath);                      // remove temp file

    await Webinar.create({
      title,
      description,
      time,
      createdBy,
      room_id,
      image:   result.secure_url,                 // public URL for frontend
      imageId: result.public_id,                  // store public_id for deletion
    });

    res.status(201).json({ message: "Webinar Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    // ⬇️ Remove banner/thumbnail from Cloudinary
    await cloudinary.uploader.destroy(webinar.imageId); // defaults to image/upload

    // ⬇️ Remove DB record
    await webinar.deleteOne();

    res.json({ message: "Webinar Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



