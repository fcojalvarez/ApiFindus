const mongoose = require("mongoose");
const commentSchema = require("./schemas/comment");

const commentModel = mongoose.model("comments", commentSchema);

module.exports = commentModel;