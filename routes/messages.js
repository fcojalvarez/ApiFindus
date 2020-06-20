const express = require('express');
const router = express.Router();
const app = express();
const { json } = require('express');
const Message = require('../models/messages');
const nodemailer = require('nodemailer');
const mustAuth = require('../middlewares/onlyAdmins');
const config = require('../config.js');

app.use(json());

router.route('/contact')
    .get(mustAuth(), async(req, res) => {
        let messageList = await Message.find().exec();

        res.status(200).json(messageList);
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
                user: 'finduspage@gmail.com',
                /* config.configMailer.user, */
                pass: 'QwErT12345' /* config.configMailer.password */
            }
        });

        let mailOptions = {
            from: req.body.email,
            to: 'fcojalvarezrodriguez@gmail.com',
            subject: 'Formulario de contacto desde Findus Page',
            html: `
            <br>
            <h1 style="background: #ddd; padding: 20px"><b>${req.body.subject}</b></h1>
            <p>Escrito por: ${req.body.fullName}</p>
            <hr>
            <h2><b>Mensaje:</b></h2>
            <p>${req.body.message}</p>
            <hr>
            Mensaje enviado desde: ${req.body.email} 
        `
        }

        transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
                console.log('error' + err)
                    /* res.end(500, err.message) */
            } else {
                console.log('send')
                    /* res.status(200).jsonp(req.body); */
            }
        })

        res.status(200).send(contentEmail)
    })

module.exports = router