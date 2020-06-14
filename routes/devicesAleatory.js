const express = require('express');
const router = express.Router();
const Device = require('../models/devices');
const app = express();
const { json } = require('express');

app.use(json());

router.route('/devicesAleatory')
    .get(async(req, res) => {
        try {
            let devicesList = await Device.find().exec();
            let devicesAleatory = [];
            devicesList = devicesList.filter(device => parseInt(device.price) > 400 && parseInt(device.price) < 700)

            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }

            for (let index = 0; index < 3; index++) {
                let number = parseInt(getRandomArbitrary(0, devicesList.length))
                devicesAleatory.push(devicesList[number])
            }

            res.json(devicesAleatory);
        } catch (err) {
            res.status(404).json(err)
        }

    })

module.exports = router