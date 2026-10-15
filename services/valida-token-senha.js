const jsonwebtoken = require('jsonwebtoken');
const { Usuario } = require('../models');

const validaTokenAlteracaoDeSenha = async (token) => {
    try {
        const jwt = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findOne({ tokenDeRecuperacao: jwt.token });

        if(!usuario) {
            throw new Error('Token não encontrado');
        }

        return jsonwebtoken.sign({ id: usuario._id }, process.env.JWT_SECRET);
    } catch (e) {
        throw new Error('Token inválido ou expirado');
    }
};

module.exports = validaTokenAlteracaoDeSenha;