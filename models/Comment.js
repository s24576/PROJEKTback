const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    author: {type: String, required: true},
    comment: { type: String, required: true },
})

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;