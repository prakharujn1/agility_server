const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_secret,
});

module.exports = razorpayInstance;