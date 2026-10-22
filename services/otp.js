const qrcode = require('qr-image');
const { authenticator } = require('otplib');

const geraSegredo = (email) => {
    const segredo = authenticator.generateSecret();

    const otpauth = authenticator.keyuri(
        email, // Nome da conta
        'Cryptotrade', // Responsável pela aplicação
        segredo // Segredo
    );

    const imagem = qrcode.imageSync(otpauth, {type: 'svg'});

    return {
        segredo,
        qrcode: imagem,
    }
};

const validaOtp = (token, segredo) => {
    return authenticator.check(token, segredo);
};

module.exports = {
    geraSegredo,
    validaOtp
}