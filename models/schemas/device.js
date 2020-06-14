const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let deviceSchema = new Schema({
    image: { type: String, require: false },
    DeviceName: { type: String, require: false },
    Brand: { type: String, require: false },
    dimensions: { type: String, require: false },
    weight: { type: String, require: false },
    sim: { type: String, require: false },
    card_Slot: [
        { type: String, require: false }
    ],
    camera: {
        features: { type: String, require: false },
        single: { type: String, require: false },
        triple: { type: String, require: false }
    },
    bluetooth: [
        { type: String, require: false }
    ],
    card_slot: [
        { type: String, require: false }
    ],
    gps: [
        { type: String, require: false }
    ],
    os: [
        { type: String, require: false }
    ],
    protection: [
        { type: String, require: false }
    ],
    resolution: [
        { type: String, require: false }
    ],
    ram: [
        { type: Number, require: false }
    ],
    rom: [
        { type: Number, require: false }
    ],
    display: [
        { type: String, require: false }
    ],
    sensors: [
        { type: String, require: false }
    ],
    usb: [
        { type: String, require: false }
    ],
    wlan: [
        { type: String, require: false }
    ],
    radio: { type: String, require: false },
    battery: { type: String, require: false },
    cpu: { type: String, require: false },
    video: { type: String, require: false },
    gpu: { type: String, require: false },
    price: { type: String, require: false },
    charging: { type: String, require: false },
    nfc: { type: String, require: false },
    radio: { type: String, require: false },
    _2g_bands: { type: String, require: false },
    _3_5mm_jack_: { type: String, require: false },
    _3g_bands: { type: String, require: false },
    _4g_bands: { type: String, require: false }
})

module.exports = deviceSchema