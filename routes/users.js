const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Device = require('../models/devices');
const bearerToken = require('express-bearer-token');
const firebase = require('firebase')
const config = require('../config.js');
const app = express();
const { json } = require('express');
const musthAuth = require('../middlewares/mustAuth')

app.use(json());
app.use(bearerToken());

firebase.initializeApp(config.firebaseConfig)

router.route('/users')
    .get(async(req, res) => {
        const usersList = await User.find().exec();
        res.status(200).json(usersList);
    })
    .post(async(req, res) => {
        try {
            const email = req.body.email
            const password = req.body.password

            let auth = await firebase.auth().createUserWithEmailAndPassword(email, password);

            let userDB = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                profile: req.body.profile,
                devicesFavorites: [],
                _id: auth.user.uid,
                image: req.body.image
            };

            let newUser = await new User(userDB).save()
            let userJSON = newUser.toJSON()

            res.status(201).json(userJSON);

        } catch (e) {
            res.status(404).json({ message: e.message })
            return
        }
    })

router.route('/users/:id')
    .get(musthAuth(), async(req, res) => {
        try {
            const searchId = req.params.id
            const foundUser = await User.findById({ _id: searchId }).exec()

            if (!foundUser) {
                res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
                return
            }

            res.status(200).json(foundUser)
        } catch (err) {
            res.status(404).json({ message: e.message })
            return
        }
    })
    .put(musthAuth(), async(req, res) => {
        try {
            let searchId = req.params.id
            let userEdited = req.body
            let updateUser = await User.findByIdAndUpdate(searchId, userEdited, { new: true })

            let userEdit = firebase.auth().currentUser.updateEmail(req.body.email);
            console.log('aaa' + userEdit)
            if (!updateUser) {
                res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
                return
            }

            if (searchId !== userEdited._id || userEdited.profile !== 'admin') {
                return
            }

            res.status(200).json(updateUser)
            return
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud' })
        }
    })
    .delete(musthAuth(), async(req, res) => {
        try {
            let searchId = req.params.id
            let deleteUser = await User.deleteOne({ _id: searchId })
            firebase.auth().currentUser.delete();

            if (deleteUser.deleteCount === 0) {
                res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
                return
            }

            res.status(204).json({ 'message': 'El usuario se ha eliminado correctamente.' })
            return
        } catch (err) {
            res.status(500).json(err + { 'message': 'No se ha podido resolver la solicitud' })
        }
    })

router.route('/users/:id/getDevicesFavorites')
    .get(musthAuth(), async(req, res) => {
        try {
            let userID = req.params.id
            let userDB = await User.findById(userID)
            let devicesID = userDB.devicesFavorites

            let devicesFavorites = await Promise.all(devicesID.map(async deviceID => {
                return await Device.findById(deviceID)
            }))

            res.status(200).json(devicesFavorites)
        } catch (err) {
            res.status(404).json('message: ' + err)
        }
    })

router.route('/users/:id/addDevicesFavorites')
    .post(musthAuth(), async(req, res) => {
        try {
            const userID = req.params.id
            let userDB = await User.findById(userID)
            const devicesFavorites = req.body.deviceID

            if (userDB.devicesFavorites.includes(devicesFavorites)) {
                res.status(200).json('duplicate')
                return
            }

            userDB.devicesFavorites.push(devicesFavorites)

            const userEdited = await User.findByIdAndUpdate(userID, { devicesFavorites: userDB.devicesFavorites }, { new: true })

            res.status(200).json(userEdited)
        } catch (err) {
            res.status(404).json('message: ' + err)
        }
    })

router.route('/users/:id/delDevicesFavorites')
    .post(musthAuth(), async(req, res) => {
        try {
            const userID = req.params.id
            let userDB = await User.findById(userID)
            let devicesFavorites = userDB.devicesFavorites
            let deviceID = req.body.deviceID
            let indexArr = devicesFavorites.indexOf(deviceID)

            if (indexArr === -1) {
                res.status(404).json('El elemento que intentas eliminar no existe.')
                return
            }

            userDB.devicesFavorites.splice(indexArr, 1)

            userEdited = await User.findByIdAndUpdate(userID, { devicesFavorites: userDB.devicesFavorites }, { new: true })

            res.status(200).json(userEdited)
        } catch (err) {
            res.status(404).json('message: ' + err)
        }
    })

module.exports = router