const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bearerToken = require('express-bearer-token');
const firebase = require('firebase')
const config = require('../config.js');
const app = express();
const { json } = require('express');

app.use(json());
app.use(bearerToken());

firebase.initializeApp(config.firebaseConfig)

router.route('/users')
    .get(async(req, res) => {
        let usersList = await User.find().exec();

        res.json(usersList);
    })
    .post(async(req, res) => {
        try {
            const email = req.body.email
            const password = req.body.password

            let auth = await firebase.auth().createUserWithEmailAndPassword(email, password);

            let userDB = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.email,
                profile: req.body.profile,
                _id: auth.user.uid,
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
    .get(async(req, res) => {
        try {
            let userList = req.app.get('users')
            let searchId = req.params.id

            let foundUser = await User.findById({ _id: searchId }).exec()

            if (!foundUser) {
                res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
                return
            }

            res.json(foundUser)
        } catch (err) {
            res.status(404).json({ message: e.message })
            return
        }
    })
    .put(async(req, res) => {
        try {
            let searchId = req.params.id

            let userUpdated = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                profile: req.body.profile,

            }

            let updateUser = await User.findOneAndUpdate(searchId, userUpdated, { new: true })

            if (!updateUser) {
                res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
                return
            }
            res.json(updateUser)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud' })
        }
    })
    .delete(async(req, res) => {
        try {
            let searchId = req.params.id
            let deleteUser = await User.deleteOne({ _id: searchId })
            let user = firebase.auth().currentUser;

            if (deleteUser.deleteCount === 0) {
                res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
                return
            }
            user.delete()

            res.status(204).json({ 'message': 'El usuario se ha eliminado correctamente.' })
            return
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud' })
        }
    })

module.exports = router