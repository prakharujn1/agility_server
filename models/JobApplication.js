const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedIn: { type: String, required: true },
    resume: { type: String, required: true },
    jobtitle: { type: String, required: true },
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);