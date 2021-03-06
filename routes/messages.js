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
        const messageList = await Message.find().exec();
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
            pool: true,
            host: "petplus.xyz",
            port: 465,
            secure: true,
            auth: {
                user: config.configMailer.user,
                pass: config.configMailer.password
            }
        });

        let mailOptions = {
            from: "noreply@petplus.app",
            to: 'fcojalvarezrodriguez@gmail.com',
            subject: 'Formulario de contacto desde Findus Page',
            html: `
            <br>
            <h1 style="background: #545c64; padding: 20px"><b style="color: #FFEC6B">${req.body.subject}</b></h1>
            <p>Escrito por: ${req.body.fullName}</p>
            <hr>
            <h2><b>Mensaje:</b></h2>
            <p>${req.body.message}</p>
            <hr>
            Mensaje enviado desde: ${req.body.email} 
        `
        }

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                res.status(500)
            } else {
                res.status(200)
            }
        })
    })

module.exports = router