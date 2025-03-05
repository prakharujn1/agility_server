const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model("Enquiry", EnquirySchema);