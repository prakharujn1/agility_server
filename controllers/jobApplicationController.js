const JobApplication = require("../models/JobApplication");

// Get all job applications
exports.getJobApplications = async (req, res) => {
    try {
        const jobApplications = await JobApplication.find();
        res.json(jobApplications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a job application
exports.createJobApplication = async (req, res) => {
    const { name, email, phone, linkedIn, resume, jobtitle } = req.body;
    const jobApplication = new JobApplication({ name, email, phone, linkedIn, resume, jobtitle });

    try {
        const newJobApplication = await jobApplication.save();
        res.status(201).json(newJobApplication);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a job application
exports.deleteJobApplication = async (req, res) => {
    const { id } = req.params;

    try {
        await JobApplication.findByIdAndDelete(id);
        res.json({ message: "Job application deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};