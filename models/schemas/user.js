const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: { type: String, require: true },
    surname: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    profile: { type: String, require: true }
})

module.exports = userSchema