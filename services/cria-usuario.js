const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

const criaUsuario = async(usuario) => {
    if (!usuario.senha) {
        throw new Error('O campo senha é obrigatório');
    }

    if (usuario.senha.length <= 4) {
        throw new Error('O campo senha deve ter no mínimo 5 caracteres');
    }

    const hashSenha = await bcrypt.hash(usuario.senha, 10); //Faz a hash da senha

    usuario.senha = hashSenha; //Sobrescreve a senha

    const {senha, ...usuarioSalvo} = (await Usuario.create(usuario))._doc; // Os três pontos fazem a desestruturação do documento no campo senha restirando esse campo e gravando na variavel senha.

    return usuarioSalvo;
};

module.exports = criaUsuario;