const nodemailer = require('nodemailer');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');

const { Usuario } = require('../models');

const transporter = nodemailer.createTransport({ // Configuração do transporte de e-mail
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
});

const enviaEmailDeConfirmacao = async (usuario, urlDeRedirecionamento) => {
    const parametros = {
        nome: usuario.nome,
        linkDeConfirmacao: `${process.env.URL_DA_CRYPTOTRADE}/v1/auth/confirma-conta?token=${usuario.tokenDeConfirmacao}&redirect=${urlDeRedirecionamento}`,
    };

    await transporter.sendMail({
        from: '"CryptoTrade" <no-reply@cryptotrade.com>',
        to: usuario.email,
        text: await ejs.renderFile('emails/confirmacao/template.txt', parametros),
        html: await ejs.renderFile('emails/confirmacao/template.html', parametros),
    });
};

const enviaEmailDeRecuperacao = async (email, urlDeRedirecionamento) => {
    if(!urlDeRedirecionamento) {
        throw new Error('Deve ser enviado um com a url de redirecionamento no campo redirect');
    }

    if(!email) {
        throw new Error('Deve ser enviado um email no campo email');
    }

    const usuario = await Usuario.findOne({ email });

    if(usuario) {
        const token = jwt.sign(
            { token: usuario.tokenDeRecuperacao },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '5 minutes' },
        );

        const parametros = {
            nome: usuario.nome,
            linkDeRecuperacao: `${process.env.URL_DA_CRYPTOTRADE}/v1/auth/valida-token?token=${token}&redirect=${urlDeRedirecionamento}`,
        }

        await transporter.sendMail({
            from: '"CryptoTrade" <no-reply@cryptotrade.com>',
            to: usuario.email,
            subject: 'Recuperação de senha',
            text: await ejs.renderFile('emails/recuperacao-de-senha/template.txt', parametros),
            html: await ejs.renderFile('emails/recuperacao-de-senha/template.html', parametros),
        });
    }
};

module.exports = {
    transporter,
    enviaEmailDeConfirmacao,
    enviaEmailDeRecuperacao,
}