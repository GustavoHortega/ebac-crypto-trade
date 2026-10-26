const qrcode = require('qr-image');
const { OTP } = require('otplib');
const authenticator = new OTP();

const geraSegredo = (email) => {
    
    const segredo = authenticator.generateSecret();

    const otpauth = authenticator.generateURI({
        issuer: "Cryptotrade", // Responsável pela aplicação
        label: email, // Nome da conta
        secret: segredo, // Segredo
    });

    const imagem = qrcode.imageSync(otpauth, {type: 'svg'});

    return {
        segredo,
        qrcode: imagem.toString(),
    }
};

const validaOtp = (token, segredo) => {
    return authenticator.check(token, segredo);
};

module.exports = {
    geraSegredo,
    validaOtp
}