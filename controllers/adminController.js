const Course = require("../models/Course");
const Lecture = require("../models/Lecture");
const User = require("../models/User");
const fs = require("fs");
const { promisify } = require("util");

exports.createCourse = async (req, res) => {
    const { title, description, category, createdBy, duration, price } = req.body;

    const image = req.file;

    await Course.create({
        title,
        description,
        category,
        createdBy,
        image: image?.path,
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
        const course = await Course.findById(req.params.id)

        if (!course) return res.status(404).json({
            message: "No Course with this id",
        })

        const { title, description } = req.body;

        const file = req.file;

        const lecture = await Lecture.create({
            title,
            description,
            video: file?.path,
            course: course._id,
        })

        res.status(201).json({
            message: "Lecture Added",
            lecture,
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

exports.deleteLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id);

        // fs.unlink(lecture.video, (err) => {
        //     if (err) {
        //         console.error("Error deleting video file:", err);
        //     } else {
        //         console.log("Video file deleted");
        //     }
        // })

        await lecture.deleteOne();
        res.json({ message: "Lecture deleted" });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

const unlinkAsync = promisify(fs.unlink)

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const lectures = await Lecture.find({ course: course._id })

        await Promise.all(
            lectures.map(async (lecture) => {
                await unlinkAsync(lecture.video);
                console.log("video deleted");
            })
        )

        fs.unlink(course.image, (err) => {
            if (err) {
                console.error("Error deleting video file:", err);
            } else {
                console.log("image deleted");
            }
        })

        await Lecture.find({ course: req.params.id }).deleteMany();
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