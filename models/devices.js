const mongoose = require("mongoose");
const deviceSchema = require("./schemas/device");

const deviceModel = mongoose.model("devices", deviceSchema);

module.exports = deviceModel;