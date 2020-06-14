const express = require('express');
const router = express.Router();
const Device = require('../models/devices');
const app = express();
const { json } = require('express');


app.use(json());


router.route('/filterDevices')
    .post(async(req, res) => {
        try {
            let devicesList = await Device.find().exec();
            let dataForm = {
                storage: req.body.storage,
                frontCamera: req.body.frontCamera,
                leadCamera: req.body.leadCamera,
                ram: req.body.ram,
                rom: req.body.rom,
                display: req.body.display,
                price: req.body.price,
                so: req.body.so
            }
            let priceToNumber = parseInt(dataForm.price)
                // Filtro rango precio
            devicesList = devicesList.filter(device => parseInt(device.price) < priceToNumber)
                // Filtro Sistema Operativo
            if (dataForm.so === 'Android') {
                devicesList = devicesList.filter(device => device.os[0].split(' ')[0] === 'Android')
            } else if (dataForm.so === 'iOS') {
                devicesList = devicesList.filter(device => device.os[0].split(' ')[0] == 'iOS')
            }
            // Filtro tamaño pantalla
            if (dataForm.display === "Menos de 6''") {
                devicesList = devicesList.filter(device => device.display[1] < 6)
            } else if (dataForm.display === "Más de 6''") {
                devicesList = devicesList.filter(device => device.display[1] >= 6)
            }
            // Filtro memoria RAM
            if (dataForm.ram === 'Más de 8GB') {
                devicesList = devicesList.filter(element => Math.min(...element.ram) >= 8 || Math.max(...element.ram) >= 8)
            } else if (dataForm.ram === 'Menos de 8GB') {
                devicesList = devicesList.filter(element => Math.min(...element.ram) < 8 || Math.max(...element.ram) < 8)
            }
            // Filtro almacenamiento
            if (dataForm.rom === 'Más de 128GB') {
                devicesList = devicesList.filter(element => Math.min(...element.rom) >= 128 || Math.max(...element.rom) >= 128)
            } else if (dataForm.rom === 'Menos de 128GB') {
                devicesList = devicesList.filter(element => Math.min(...element.rom) < 128 || Math.max(...element.rom) < 128)
            }


            devicesList = devicesList.slice(0, 3)

            res.json(devicesList);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    })

module.exports = router