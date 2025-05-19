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
  try {
    const { title, description, time, createdBy, link } = req.body;
    const filePath = req.file.path;                  // multer temp file

    // ⬆️ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "recordings",                          // e.g. /recordings/abc.png
    });

    fs.unlinkSync(filePath);                         // remove local temp file

    await Recording.create({
      title,
      description,
      time,
      createdBy,
      link,
      image:   result.secure_url,                    // Cloudinary URL
      imageId: result.public_id,                     // needed for deletion
    });

    res.status(201).json({ message: "Recording Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecording = async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);
    if (!recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    // ⬇️ Remove thumbnail from Cloudinary
    await cloudinary.uploader.destroy(recording.imageId); // defaults to image/upload

    // ⬇️ Remove DB record
    await recording.deleteOne();

    res.json({ message: "Recording Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




