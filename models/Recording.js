const mongoose = require("mongoose");

const RecordingSchema = new mongoose.Schema({
    title:{
        type:String, required : true, 
    },
    description:{
        type:String, required : true, 
    },
    image:{
        type:String, required : true, 
    },
    imageId:{
        type:String, required : true, 
    },
    time:{
        type:String, required : true, 
    },
    createdBy:{
        type:String, required : true, 
    },
    link:{
        type:String, required : true, 
    },
    createdAt:{
        type: Date, default : Date.now(),
    },
}
)

module.exports = mongoose.model("Recording", RecordingSchema);