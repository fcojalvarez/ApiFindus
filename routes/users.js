const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const firebase = require('firebase')
const config = require('../config.js');
const app = express();
const { json } = require('express');

app.use(json());
app.use(bearerToken());

const JWT_PASSWORD = config.JWT_PASSWORD

firebase.initializeApp(config.firebaseConfig)

async function checkEmailAndPassword(email, pass) {
    let auth = await firebase.auth().signInWithEmailAndPassword(email, pass);
    return auth;
}

router.route('/users')
    .get(async(req, res) => {
        let usersList = await User.find().exec();

        res.json(usersList);
    })
    .post(async(req, res) => {
        try {
            let auth = await firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password);

            let userForMongo = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email
            };

            let newUser = await new User(userForMongo).save()
            let userJSON = newUser.toJSON()

            res.status(201).json(userJSON);

        } catch (e) {
            res.status(404).json({ message: e.message })
            return
        }
    })


module.exports = router