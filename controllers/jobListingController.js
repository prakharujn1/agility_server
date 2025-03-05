const JobListing = require("../models/JobListing");

// Get all job listings
exports.getJobListings = async (req, res) => {
    try {
        const jobListings = await JobListing.find();
        res.json(jobListings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a job listing
exports.createJobListing = async (req, res) => {
    const { title, location, description, skills } = req.body;
    const jobListing = new JobListing({ title, location, description, skills });

    try {
        const newJobListing = await jobListing.save();
        res.status(201).json(newJobListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a job listing
exports.updateJobListing = async (req, res) => {
    const { id } = req.params;
    const { title, location, description, skills } = req.body;

    try {
        const updatedJobListing = await JobListing.findByIdAndUpdate(
            id,
            { title, location, description, skills },
            { new: true }
        );
        res.json(updatedJobListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a job listing
exports.deleteJobListing = async (req, res) => {
    const { id } = req.params;

    try {
        await JobListing.findByIdAndDelete(id);
        res.json({ message: "Job listing deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};