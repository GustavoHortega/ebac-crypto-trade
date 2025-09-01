const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

const criaUsuario = async (usuario) => {
    if (!usuario.senha) {
        throw new Error('O campo senha é obrigatório');
    }

    if (usuario.senha.length <= 4) {
        throw new Error('A senha precisa ter pelo menos 5 caracteres');
    }

    const hashSenha = await bcrypt.hash(usuario.senha, 10);

    usuario.senha = hashSenha;

    const { senha, ...usuarioSalvo } = (await Usuario.create(usuario))._doc; // com essa sintaxe de destruturação eu garanto que a variaval do usuário não terá o campo da senha. O ._doc retorna um document.z
};

module.exports = criaUsuario;