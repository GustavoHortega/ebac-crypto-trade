const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({ // Configuração do transporte de e-mail
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
});

module.exports = transporter;