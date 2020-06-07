const mongoose = require("mongoose");
const deviceSchema = require("./schemas/comment");

const deviceModel = mongoose.model("devices", deviceSchema);

module.exports = deviceModel;