const Enquiry = require("../models/Enquiry");

// Get all enquiries
exports.getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.json(enquiries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create an enquiry
exports.createEnquiry = async (req, res) => {
    const { name, email, company, description } = req.body;
    const enquiry = new Enquiry({ name, email, company, description });

    try {
        const newEnquiry = await enquiry.save();
        res.status(201).json(newEnquiry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an enquiry
exports.deleteEnquiry = async (req, res) => {
    const { id } = req.params;

    try {
        await Enquiry.findByIdAndDelete(id);
        res.json({ message: "Enquiry deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};