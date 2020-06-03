const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    title: { type: String, require: true },
    body: { type: String, require: true },
    votes: { type: Number, require: true }
})

module.exports = commentSchema