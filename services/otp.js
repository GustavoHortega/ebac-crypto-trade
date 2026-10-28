const qrcode = require('qr-image');
const { OTP } = require('otplib');
const authenticator = new OTP({strategy: 'totp'}); // Instancia OTP com a estratégia totp

const geraSegredo = (email) => {
    
    const segredo = authenticator.generateSecret();

    const otpauth = authenticator.generateURI({
        issuer: "Cryptotrade", // Responsável pela aplicação
        label: email, // Nome da conta
        secret: segredo, // Segredo
    });

    const imagem = qrcode.imageSync(otpauth, {type: 'svg'}); //Gera svg do QRCODE com uri para totp

    return { // Retorna segredo e qrcode em um dicionário
        segredo,
        qrcode: imagem.toString(),
    }
};

const validaOtp = async (segredo, token) => {
    const resultado = await authenticator.verify({
        secret: segredo,
        token: token,
        epochTolerance: 30 // Toelrancia totp
    });

    return resultado.valid;
};

module.exports = {
    geraSegredo,
    validaOtp
}