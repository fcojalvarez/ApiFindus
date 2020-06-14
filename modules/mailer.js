'use stric'
const config = require('../config.js');
const nodemailer = require('nodemailer')

exports.sendEmail = function(req, res) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.USER_EMAIL,
            pass: config.PASSWORD_EMAIL
        }
    });
    // Definimos el email
    let mailOptions = {
            from: 'req.body.email',
            to: config.USER_EMAIL,
            subject: 'Contacto desde web',
            text: 'req.body.message'
        }
        // Enviamos el email
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.end(500, err.message)
        } else {
            console.log("Email sent");
            res.status(200).jsonp(req.body);
        }
    })
}