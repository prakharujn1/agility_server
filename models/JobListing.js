const mongoose = require("mongoose");

const JobListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
});

module.exports = mongoose.model("JobListing", JobListingSchema);