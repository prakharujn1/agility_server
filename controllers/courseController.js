const razorpayInstance = require("../config/razorpay.js");
const Course = require("../models/Course.js")
const Lecture = require("../models/Lecture.js")
const User = require("../models/User.js");
const Payment = require("../models/Payment.js");

const crypto = require("crypto");
const Assignment = require("../models/Assignment.js");

exports.getAllCourses = async(req,res)=>{
    try{
        const courses = await Course.find();
        res.json({
            courses,
        })
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

exports.getSingleCourse = async(req,res) =>{
    try{
        const course = await Course.findById(req.params.id);
        res.json({
            course,
        })
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

exports.fetchLectures = async(req,res) =>{
    try{
        const lectures = await Lecture.find({course: req.params.id})

        const user = await User.findById(req.user.id);

        if(user.role==="admin"){
            return res.json({lectures});
        }

        if(!user.subscription.includes(req.params.id)){
            return res.status(400).json({message: "You have not subscribed to this course"})
        }

        res.json({lectures});

    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

//fetch assignments
exports.fetchAssignments = async(req,res) =>{
    try{
        const assignments = await Assignment.find({course: req.params.id})

        const user = await User.findById(req.user.id);

        if(user.role==="admin"){
            return res.json({assignments});
        }

        if(!user.subscription.includes(req.params.id)){
            return res.status(400).json({message: "You have not subscribed to this course"})
        }

        res.json({assignments});

    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}


exports.fetchLecture = async(req,res) =>{
    try{
        const lecture = await Lecture.findById(req.params.id);

        const user = await User.findById(req.user.id);

        if(user.role==="admin"){
            return res.json({lecture});
        }

        if(!user.subscription.includes(lecture.course)){
            return res.status(400).json({message: "You have not subscribed to this course"})
        }

        res.json({lecture});
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

//fetch single assignment
exports.fetchAssignment = async(req,res) =>{
    try{
        const assignment = await Assignment.findById(req.params.id);

        const user = await User.findById(req.user.id);

        if(user.role==="admin"){
            return res.json({assignment});
        }

        if(!user.subscription.includes(assignment.course)){
            return res.status(400).json({message: "You have not subscribed to this course"})
        }

        res.json({assignment});
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}


exports.getMyCourses = async(req,res)=>{
    try{
        const courses = await Course.find({_id: req.user.subscription});
        res.json({
            courses,
        })
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

exports.checkout = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id);
        const course = await Course.findById(req.params.id);
        
        if(user.subscription.includes(course._id)){
            return res.status(400).json({
                message:"you already have this course"
            })
        }

        const options = {
            amount: Number(course.price * 100),
            currency: "INR",
        }

        const order = await razorpayInstance.orders.create(options);

        res.status(201).json({
            order,
            course,
        })
    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}

exports.paymentVerification = async(req,res) =>{
    try{
        const {razorpay_order_id, razorpay_payment_id,razorpay_signature} = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac(
            "sha256",process.env.Razorpay_secret
        ).update(body)
        .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if(isAuthentic){
            await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            })

            const user = await User.findById(req.user.id);
            const course = await Course.findById(req.params.id);
            user.subscription.push(course._id);

            await user.save();

            res.status(200).json({
                message: "Course purchased successfully"
            })
        }else{
            res.status(400).json({
                message:"Payment Failed"
            })
        }

    }
    catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
}