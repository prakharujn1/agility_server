const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const Lecture = require("../models/Lecture");
const User = require("../models/User");
const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");
const { promisify } = require("util");

exports.createCourse = async (req, res) => {
    const { title, description, category, createdBy, duration, price } = req.body;
  const filePath = req.file.path;          // Multer saved the tmp file for us

  // ⬆️  Upload to Cloudinary
  const result = await cloudinary.uploader.upload(filePath, { folder: "courses" });

  fs.unlinkSync(filePath);                 // remove local tmp file

     await Course.create({
    title,
    description,
    category,
    createdBy,
    image: result.secure_url,              // for the frontend
    imageId: result.public_id,             // keep this so we can delete later
    duration,
    price
  });

    res.status(201).json({
        message: "Course Created Successfully"
    }
    )
}

exports.addLectures = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "No Course with this id" });
    }

    const { title, description } = req.body;
    const filePath = req.file.path;

    // ⬆️ Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "lectures",
      resource_type: "video",
    });

    fs.unlinkSync(filePath); // Remove temp file

    const lecture = await Lecture.create({
      title,
      description,
      video: result.secure_url,     // public video URL
      videoId: result.public_id,    // needed for deletion
      course: course._id,
    });

    res.status(201).json({
      message: "Lecture Added",
      lecture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add assignment
exports.addAssignment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "No Course with this id" });
    }

    const { title } = req.body;
    const filePath = req.file.path;          // multer temp file

    // ⬆️ Upload to Cloudinary as a raw asset
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "assignments",
        //resource_type: "raw",   
        // ✅ for PDFs, DOCXs, ZIPs, etc.
    });

    fs.unlinkSync(filePath);                 // remove temp file

    const assignment = await Assignment.create({
      title,
      docs: result.secure_url,               // public URL
      docsId: result.public_id,              // needed for deletion
      course: course._id,
    });

    res.status(201).json({ message: "Assignment Added", assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // ⬇️ Delete video from Cloudinary
    await cloudinary.uploader.destroy(lecture.videoId, {
      resource_type: "video",
    });

    // ⬇️ Remove lecture from DB
    await lecture.deleteOne();

    res.json({ message: "Lecture deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete assignment

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // ⬇️ Remove from Cloudinary
    await cloudinary.uploader.destroy(assignment.docsId); // no resource_type option


    // ⬇️ Remove DB record
    await assignment.deleteOne();

    res.json({ message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unlinkAsync = promisify(fs.unlink)

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lectures    = await Lecture.find({ course: course._id });
    const assignments = await Assignment.find({ course: course._id });

    
    /* ---- delete Cloudinary image ---- */
    await cloudinary.uploader.destroy(course.imageId);

        await Promise.all(
            lectures.map(async (lecture) => {
                await unlinkAsync(lecture.video);
                //console.log("video deleted");
            })
        )

        await Promise.all(
            assignments.map(async (assignment) => {
                await unlinkAsync(assignment.docs);
                //console.log("assignment deleted");
            })
        )

        

        // fs.unlink(course.image, (err) => {
        //     if (err) {
        //         console.error("Error deleting image file:", err);
        //     } else {
        //         console.log("image deleted");
        //     }
        // })

        await Lecture.find({ course: req.params.id }).deleteMany();
        await Assignment.find({ course: req.params.id }).deleteMany();
        await course.deleteOne();

        await User.updateMany({}, { $pull: { subscription: req.params.id } });

        res.json({
            message: "Course Deleted"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

exports.getAllStats = async (req, res) => {
    try {
        const totalCourses = (await Course.find()).length;
        const totalLecture = (await Lecture.find()).length;
        const totalUsers = (await User.find({ role: "student" })).length;

        const stats = {
            totalCourses,
            totalLecture,
            totalUsers,
        }
        res.json({
            stats,
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}


exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ id: { $ne: req.user.id }, role: "admin" }).select("-password");
        res.json({ admins });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};


exports.downgradeRole = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if (user.role === "admin") {
        user.role = "business";
        await user.save();
        
        return res.status(200).json({
            message: "Role updated",
        });
    }}
    catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.upgradeRole = async (req, res) => { 
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = "admin";
        await user.save();

        return res.status(200).json({ message: "Role updated to Admin" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};