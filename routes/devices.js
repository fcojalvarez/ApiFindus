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
        let devicesList = await Device.find().exec();

        res.json(devicesList);
    })
    .post(onlyAdmins(), async(req, res) => {
        try {
            let newDevice = req.body

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
            let searchId = req.params.id,
                foundDevice = await Device.findById({ _id: searchId }).exec();

            if (!foundDevice) {
                res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
                return
            }

            res.json(foundDevice)
        } catch (err) {
            res.status(404).json({ message: e.message })
            return
        }
    })
    .put(onlyAdmins(), async(req, res) => {
        try {

        } catch (err) {

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