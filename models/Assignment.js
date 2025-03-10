const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    title:{
        type:String, required : true, 
    },
    docs:{
        type:String, required : true, 
    },
    course:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },
    createdAt:{
        type: Date,
        default : Date.now,
    }
}
)

module.exports = mongoose.model("Assignment", AssignmentSchema);