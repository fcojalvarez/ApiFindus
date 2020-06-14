const mongoose = require("mongoose");
const messageSchema = require("./schemas/message");

const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel;