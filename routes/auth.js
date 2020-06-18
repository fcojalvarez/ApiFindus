const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require("jsonwebtoken");
const firebase = require('firebase')
const config = require('../config.js');


router.route('/auth/login')
    .post(async(req, res) => {
        try {
            let auth = await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)

            let userDB = await User.findById(auth.user.uid).exec()

            let payload = {
                id: auth.user.uid,
                profile: userDB.profile,
                name: userDB.name,
                email: userDB.email
            };
            let token = jwt.sign(payload, config.jwtKey)

            if (!token) {
                res.status(500).json({ 'message': 'No ha sido posible iniciar sesión con el usuario. Inténtalo más tarde' })
                return
            }
            res.status(200).json({ 'token': token })
        } catch (e) {
            res.status(401).json({ message: e.message });
            return
        }
    })

router.route('/auth/resetPassword')
    .post(async(req, res) => {
        try {
            let auth = firebase.auth()
            let email = req.body.email
            let remindPassword = await auth.sendPasswordResetEmail(email)
            res.status(201).json({ message: 'Se ha enviado un mensaje a su email para restablecer su contraseña' })
        } catch (e) {
            res.status(404).json({ 'message': 'No se ha podido realizar su solicitud vuelva a intentarlo' })
        }
    })

module.exports = router