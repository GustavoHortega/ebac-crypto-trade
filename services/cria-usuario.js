const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { Usuario } = require('../models');

//TODO
// const {enviaEmailDeConfirmacao} = require('./envia-email');

const criaUsuario = async(usuario, urlDeRedirecionamento) => {
    if (!usuario.senha) {
        throw new Error('O campo senha é obrigatório');
    }

    if (usuario.senha.length <= 4) {
        throw new Error('O campo senha deve ter no mínimo 5 caracteres');
    }

    const hashSenha = await bcrypt.hash(usuario.senha, 10); //Faz a hash da senha

    usuario.senha = hashSenha; //Sobrescreve a senha

    usuario.tokenDeConfirmacao = crypto.randomBytes(32).toString('hex'); //Gera um token de confirmação aleatório

    const {senha, ...usuarioSalvo} = (await Usuario.create(usuario))._doc; // Os três pontos fazem a desestruturação do documento no campo senha restirando esse campo e gravando na variavel senha.

    //TODO
    // await enviaEmailDeConfirmacao(usuarioSalvo, urlDeRedirecionamento);

    return usuarioSalvo;
};

module.exports = criaUsuario;