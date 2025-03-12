const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Usuario } = require('.././models');

const logaUsuario = async(email, senha) => {
    if (!senha || !email){
        throw new Error('Campo de senha e email são obrigatórios');
    }

    const usuario = await Usuario.findOne({ email: email }).select('senha');

    if (!usuario){
        throw new Error('Usuário não encontrado');
    }

    if (!await bcrypt.compare(senha, usuario.senha)){
        throw new Error('Senha invalida');
    }

    return jsonWebToken.sign({ id: usuario.id }, process.env.JWT_SECRET_KEY);
};

module.exports = logaUsuario;