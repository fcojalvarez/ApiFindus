const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let deviceSchema = new Schema({
    model: { type: String, require: true },
    operatingSystem: { type: String, require: true },
    display: {
        inches: String,
        tecnology: String,
    },
    camera: {
        rear: String,
        lead: String
    },
    processor: { type: String, require: true },
    memory: {
        ram: String,
        rom: String
    },
    batery: { type: String, require: true },
    otherFeatures: [{
        wirelessCharge: Boolean,
        fastCharge: Boolean,
        fingerprintSensor: String,
        faceUnlock: Boolean,
        jack: Boolean,
        dualSIM: Boolean,
        RadioFM: Boolean,
        updates: Boolean
    }],
    price: { type: Number, require: true },
    link: { type: String, require: true },
    image: { type: String, require: true }
})

module.exports = deviceSchema