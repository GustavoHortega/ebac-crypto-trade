const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Usuario } = require('.././models');

const logaUsuario = async(email, senha) => {
    if (!senha || !email){
        throw new Error('Campo de senha e email são obrigatórios');
    }

    const usuario = await Usuario.findOne({ email: email }).select('senha'); //localiza o usuário através do e-mail e seleciona a senha para comparação.

    if (!usuario){
        throw new Error('Usuário não encontrado');
    }

    if (!await bcrypt.compare(senha, usuario.senha)){ //Função que compara a senha encriptada e retorna um erro caso estja errada.
        throw new Error('Senha invalida');
    }

    return jsonWebToken.sign({ id: usuario.id }, process.env.JWT_SECRET_KEY); //Retorna o Token baseado no id do usuário
};

module.exports = logaUsuario;