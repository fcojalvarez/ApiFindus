const express = require('express');
const router = express.Router();
const Device = require('../models/devices');
const bearerToken = require('express-bearer-token');
const app = express();
const { json } = require('express');
const onlyAdmins = require('../middlewares/onlyAdmins')

app.use(json());
app.use(bearerToken());

router.route('/devices')
    .get(async(req, res) => {
        try {
            let devicesList = await Device.find().exec();
            res.json(devicesList);
        } catch (err) {
            console.log(err)
        }
    })
    .post(onlyAdmins(), async(req, res) => {
        try {
            let foundDevice = req.body
            if (!foundDevice.protection) {
                foundDevice.protection = "unknown"
            }

            let newDevice = {
                _id: foundDevice._id,
                image: foundDevice.image,
                DeviceName: foundDevice.DeviceName,
                Brand: foundDevice.Brand,
                dimensions: foundDevice.dimensions.split(' (')[0],
                weight: foundDevice.weight.split(' (', -5)[0],
                sim: foundDevice.sim,
                display: [
                    foundDevice.type.split(',')[0],
                    foundDevice.size.split(' inches')[0],
                    foundDevice.size.split('(~')[1].substring(0, 5)
                ],
                resolution: [
                    foundDevice.resolution.split(',')[0].split(' (')[0],
                    foundDevice.resolution.split('(~')[1].substring(0, 7)
                ],
                cartSlot: foundDevice.card_slot.split(', '),

                wlan: [
                    foundDevice.wlan.split(',')[0],
                    foundDevice.wlan.split(', ')[1]
                ],
                bluetooth: foundDevice.bluetooth.split(', '),
                gps: foundDevice.gps.split(', '),
                radio: foundDevice.radio.split(', ')[0],
                usb: foundDevice.usb.split(', '),
                battery: foundDevice.battery_c.split(' ')[2] + ' ' + foundDevice.battery_c.split(' ')[3],
                memory_c: foundDevice.memory_c,
                sensors: foundDevice.sensors.split(' '),
                cpu: foundDevice.cpu,
                storage: foundDevice.internal.split(', '),
                os: foundDevice.os.split(', '),
                cpu: foundDevice.cpu,
                video: foundDevice.video,
                camera: {
                    features: foundDevice.features,
                    single: foundDevice.single,
                    double: foundDevice.double,
                    triple: foundDevice.triple
                },
                gpu: foundDevice.gpu,
                price: foundDevice.price,
                protection: foundDevice.protection.split(', '),
                nfc: foundDevice.nfc,
                charging: foundDevice.charging,
                _2g_bands: foundDevice._2g_bands,
                _3g_bands: foundDevice._3g_bands,
                _4g_bands: foundDevice._4g_bands,
                _5g_bands: foundDevice._5g_bands,
                _3_5mm_jack_: foundDevice._3_5mm_jack_
            }

            let addNewDevice = await new Device(req.body).save()
            let deviceJSON = addNewDevice.toJSON()

            res.status(201).json(deviceJSON);
        } catch (e) {
            res.status(404).json({ message: e.message })
            return
        }
    })

router.route('/devices/:id')
    .get(async(req, res) => {
        try {
            let searchId = req.params.id
                /* let foundDevice = await Device.findById({ _id: searchId }).exec() */
            let deviceList = await Device.find().exec()
            let foundDevice = deviceList.find(device => device.id === searchId)

            if (!foundDevice) {
                res.status(404).json(foundDevice + { 'message': 'El elemento que intentas obtener no existe' })
                return
            }

            res.json(foundDevice)
        } catch (err) {
            res.status(404).json(err + { message: e.message })
            return
        }
    })
    .put(onlyAdmins(), async(req, res) => {
        try {
            let searchId = req.params.id
            let updateDevice = await Device.findByIdAndUpdate(searchId, req.body, { new: true })

            if (!updateDevice) {
                res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
                return
            }

            res.json(updateDevice)
        } catch (err) {
            res.status(500).json(err + { 'message': ' No se ha podido resolver la solicitud' })
        }
    })
    .delete(onlyAdmins(), async(req, res) => {
        try {
            let searchId = req.params.id,
                deleteDevice = await Device.deleteOne({ _id: searchId });

            if (deleteDevice.deleteCount === 0) {
                res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
                return
            }
            res.status(204).json(`El comentario con id ${searchId} se ha eliminado correctamente.`)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud' })
        }
    })

module.exports = router