const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    body: { type: String, require: true },
    userCreate: { type: String, require: true },
    smartphoneID: { type: String, require: true },
    creationDate: { type: String, require: true },
    votes: { type: Number, require: true }
})

module.exports = commentSchema