const nodemailer = require('nodemailer');
const ejs = require('ejs');

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

module.exports = {
    transporter,
    enviaEmailDeConfirmacao,
}