const express = require('express');
const router = express.Router();
const Device = require('../models/devices');
const bearerToken = require('express-bearer-token');
const app = express();
const { json } = require('express');
const mustAuth = require('../middlewares/onlyAdmins');

app.use(json());
app.use(bearerToken());

router.route('/devices')
    .get(async(req, res) => {
        try {
            const devicesList = await Device.find().exec();
            res.status(200).json(devicesList);
        } catch (err) {
            res.status(404).json({ message: e.message })
        }
    })
    .post(mustAuth(), async(req, res) => {
        try {
            const foundDevice = req.body
            const addNewDevice = await new Device(foundDevice).save()
            const deviceJSON = addNewDevice.toJSON()

            res.status(201).json(deviceJSON);
        } catch (e) {
            res.status(404).json({ message: e.message })
            return
        }
    })

router.route('/devices/:id')
    .get(async(req, res) => {
        try {
            const searchID = req.params.id
            const foundDevice = await Device.findById({ _id: searchID })
            if (!foundDevice) {
                res.status(404).json(foundDevice + { 'message': 'El elemento que intentas obtener no existe' })
                return
            }
            res.status(200).json(foundDevice)
        } catch (err) {
            res.status(404).json(err + { message: e.message })
            return
        }
    })
    .put(mustAuth(), async(req, res) => {
        try {
            const searchId = req.params.id
            const updateDevice = await Device.findByIdAndUpdate(searchId, req.body, { new: true })

            if (!updateDevice) {
                res.status(404).json(updateDevice + { 'message': 'El elemento que intentas editar no existe' })
                return
            }

            res.status(200).json(updateDevice)
        } catch (err) {
            res.status(500).json(err + { 'message': ' No se ha podido resolver la solicitud' })
        }
    })
    .delete(mustAuth(), async(req, res) => {
        try {
            const searchId = req.params.id
            const deleteDevice = await Device.deleteOne({ _id: searchId });

            if (deleteDevice.deleteCount === 0) {
                res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
                return
            }
            res.status(204).json(`El comentario con id ${searchId} se ha eliminado correctamente.`)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud' })
        }
    })

router.route('/devicesAleatory')
    .get(async(req, res) => {
        try {
            let devicesList = await Device.find().exec();
            let numbersAleatory = []
            let devicesAleatory = [];
            devicesList = devicesList.filter(device => parseInt(device.price) > 400 && parseInt(device.price) < 700)

            function getRandomNumber(min, max) {
                return Math.random() * (max - min) + min;
            }
            for (let index = 0; numbersAleatory.length < 3; index++) {
                let number = parseInt(getRandomNumber(0, devicesList.length))
                if (!numbersAleatory.includes(number)) {
                    numbersAleatory.push(number)
                }
            }

            devicesAleatory.push(
                devicesList[numbersAleatory[0]],
                devicesList[numbersAleatory[1]],
                devicesList[numbersAleatory[2]]
            )

            res.status(200).json(devicesAleatory);
        } catch (err) {
            res.status(404).json(err)
        }
    })

router.route('/devicesFilter')
    .post(async(req, res) => {
        try {
            let devicesList = await Device.find().exec();
            const dataForm = {
                    ram: req.body.ram,
                    rom: req.body.rom,
                    display: req.body.display,
                    price: req.body.price,
                    so: req.body.so,
                    features: req.body.features
                }
                // Filtro Sistema Operativo
            if (dataForm.so === 'Android') {
                devicesList = devicesList.filter(device => device.os[0].includes('Android'))
            } else if (dataForm.so === 'IOS') {
                devicesList = devicesList.filter(device => device.os[0].includes('iOS'))
            }
            // Filtro rango precio
            let priceToNumber = parseInt(dataForm.price)
            devicesList = devicesList.filter(device => parseInt(device.price) < priceToNumber)
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
            // Filtro Características
            if (dataForm.features.includes('Sensor de huella')) {
                devicesList = devicesList.filter(device => device.features.Fingerprint !== undefined)
            }
            if (dataForm.features.includes('Desbloqueo facial')) {
                devicesList = devicesList.filter(device => device.features.faceUnlock !== undefined)
            }
            if (dataForm.features.includes('Carga inalámbrica')) {
                devicesList = devicesList.filter(device => device.features.wirelessCharging !== undefined)
            }
            if (dataForm.features.includes('Carga rápida')) {
                devicesList = devicesList.filter(device => device.features.fastCharging !== undefined)
            }
            if (dataForm.features.includes('Radio FM')) {
                devicesList = devicesList.filter(device => device.features.radio !== undefined)
            }
            if (dataForm.features.includes('Dual SIM')) {
                devicesList = devicesList.filter(device => device.features.sim.includes('Dual SIM'))
            }
            if (dataForm.features.includes('Jack 3.5mm')) {
                cdevicesList = devicesList.filter(device => device.features._3_5mm_jack_ !== undefined)
            }

            devicesList = devicesList.slice(0, 3)

            res.status(200).json(devicesList);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    })

module.exports = router