var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

module.exports = mongoose.model("campground", campgroundSchema);