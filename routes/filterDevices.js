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
            console.log(req.body)

            let dataForm = {
                almacenamiento: req.body.almacenamiento,
                camaraFrontal: req.body.camaraFrontal,
                camaraTrasera: req.body.camaraTrasera,
                memoriaRam: req.body.memoriaRam,
                pantalla: req.body.pantalla,
                precio: req.body.precio,
                sistemaOperativo: req.body.sistemaOperativo
            }

            // Filtro rango precio
            devicesList = devicesList.filter(device => device.price < dataForm.precio)

            // Filtro Sistema Operativo
            if (dataForm.sistemaOperativo === 'Android') {
                devicesList = devicesList.filter(device => device.os[0].split(' ')[0] === 'Android')
            } else if (dataForm.sistemaOperativo === 'IOS') {
                devicesList = devicesList.filter(device => device.os[0].split(' ')[0] === 'iOS')
            }

            // Filtro tamaño pantalla
            if (dataForm.pantalla === "Menos de 6''") {
                devicesList = devicesList.filter(device => device.display[1] < 6)
            } else if (dataForm.pantalla === "Más de 6''") {
                devicesList = devicesList.filter(device => device.display[1] >= 6)
            }

            // Filtro memoria RAM (NO PUEDO ACCEDER A STORAGE)

            // Filtro almacenamiento (NO PUEDO ACCEDER A STORAGE)



            res.json(devicesList);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    })

module.exports = router