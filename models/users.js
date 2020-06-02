const mongoose = require("mongoose");
const userSchema = require("./schemas/user");

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;