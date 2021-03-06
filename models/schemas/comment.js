const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    image: { type: String, require: true },
    body: { type: String, require: true },
    userCreate: { type: String, require: true },
    userCreateID: { type: String, required: true },
    smartphoneID: { type: String, require: true },
    creationDate: { type: String, require: true },
    usersVotes: [
        { type: String, require: true }
    ],
    votes: { type: Number, require: true }
})

module.exports = commentSchema