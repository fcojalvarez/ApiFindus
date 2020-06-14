const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema({
    fullName: { type: String, require: true },
    email: { type: String, require: true },
    message: { type: String, require: true }
})

module.exports = messageSchema