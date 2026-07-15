const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const logaUsuario = async(email, senha) => {
    if (!senha || !email) {
        throw new Error('E-mail e senha são obrigatórios');
    }

    const usuario = await Usuario.findOne({ email: email }).select('senha');

    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }

    if (!await bcrypt.compare(senha, usuario.senha)) {
        throw new Error('Senha incorreta');
    };

    return jwt.sign({ id: usuario._id }, process.env.JWT_SECRET_KEY);
};

module.exports = logaUsuario;