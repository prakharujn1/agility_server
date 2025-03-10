const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true , unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["business", "student", "admin"], default: "student" },
    subscription : [{type : mongoose.Schema.Types.ObjectId , ref : "Course"}],
    resetPasswordExpire : Date,
},{
    timestamps:true,
});

module.exports = mongoose.model("User", UserSchema);