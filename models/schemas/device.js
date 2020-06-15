const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let deviceSchema = new Schema({
    image: { type: String, require: false },
    DeviceName: { type: String, require: false },
    Brand: { type: String, require: false },
    dimensions: { type: String, require: false },
    weight: { type: String, require: false },
    camera: { type: Object, require: false },
    gps: [
        { type: String, require: false }
    ],
    os: [
        { type: String, require: false }
    ],
    protection: [
        { type: String, require: false }
    ],
    display: [
        { type: String, require: false }
    ],
    ram: [
        { type: Number, require: false }
    ],
    rom: [
        { type: Number, require: false }
    ],
    battery: { type: String, require: false },
    usb: [
        { type: String, require: false }
    ],
    wlan: [
        { type: String, require: false }
    ],
    price: { type: String, require: false },
    cpu: { type: String, require: false },
    gpu: { type: String, require: false },
    bands: { type: Object, require: false },
    features: { type: Object, require: false }
})

module.exports = deviceSchema