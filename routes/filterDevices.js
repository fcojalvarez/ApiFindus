const express = require('express');
const router = express.Router();
const Device = require('../models/devices');
const app = express();
const { json } = require('express');


app.use(json());


router.route('/filterDevices')
    .get(async(req, res) => {
        try {
            let devicesList = await Device.find().exec();

            let dataForm = {
                almacenamiento: req.body.almacenamiento,
                camaraFrontal: req.body.camaraFrontal,
                camaraTrasera: req.body.camaraTrasea,
                memoriaRam: req.body.memoriaRam,
                pantalla: req.body.pantalla,
                precio: req.body.precio,
                sistemaOperativo: req.body.sistemaOperativo
            }

            devicesList.filter(device => device.price < dataForm.precio)


            res.json(devicesList);
        } catch (err) {
            console.log(err)
        }
    })

module.exports = router