const express = require('express');
const router = express.Router();
const bearerToken = require('express-bearer-token');
const app = express();
const { json } = require('express');
const Message = require('../models/messages');
const nodemailer = require('nodemailer');
const onlyAdmins = require('../middlewares/onlyAdmins');
const config = require('../config.js');

app.use(json());

router.route('/contact')
    .get(onlyAdmins(), async(req, res) => {
        let messageList = await Message.find().exec();

        res.json(messageList);
    })
    .post(async(req, res) => {
        const { fullName, email, message } = req.body;

        let contentEmail = `
            <h1>Correo de contacto desde la web:</h1>
            <ul>
                <li>Nombre: ${fullName}</li>
                <li>email: ${email}</li>
            </ul>
            <p>${message}</p>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'finduspage@gmail.com' /* config.configMailer.user */ ,
                pass: 'QwErT12345' /* config.configMailer.password */
            }
        });

        let mailOptions = {
            from: 'fcojalvarezrodriguez@gmail.com',
            to: 'fcojalvarezrodriguez@gmail.com',
            subject: 'Formulario de contacto desde Findus Page',
            text: `
            ${message}
            ` /* contentEmail */
        }

        transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
                console.log('Error: ')
            } else {
                console.log('Email send')
            }
        })

        res.send(contentEmail)
    })

module.exports = router