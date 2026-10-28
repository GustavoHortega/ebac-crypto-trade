const { Usuario } = require("../../../models");
const { validaOtp } = require("../../../services");

const checaOtp = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const usuarioId = req.user._id;

        const usuario = await Usuario.findById(usuarioId).select('segredoOtp');
        const segredoOtp = usuario.segredoOtp;
        const token = req.get('totp') //Pega o totp dos headers da req
        console.log(token);

        if (!token || !/^\d{6}$/.test(token)) {// Valida com regex se o valor totp no header está correta
            return res.status(401).json({
                sucesso: false,
                erro: 'Informe um código de 6 dígitos.'
            });
        }

        if (!segredoOtp) { // Valida se existe um segredo totp
            return res.status(401).json({
                sucesso: false,
                erro: 'OTP não configurado.'
            });
        }

        const otpValidado = await validaOtp(segredoOtp, token);

        if (otpValidado) { // Retorna next se a validação for true
            return next();
        }

        return res.status(401).json({
            sucesso: false,
            erro: 'OTP inválido.'
        });

    } else {
        return res.status(401).json({ // Se o usuário não estiver logado
            sucesso: false,
            erro: 'Para prosseguir, faça login.'
        });
    }
}

module.exports = { checaOtp }