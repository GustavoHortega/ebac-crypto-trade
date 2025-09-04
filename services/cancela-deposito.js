const { Usuario } = require('../models');

const cancelaDeposito = async (userId, depositoId) => {
    // Busca o usuário
    const usuario = await Usuario.findById(userId);
    if (!usuario) throw new Error("Usuário não encontrado.");

    // Busca o depósito pelo id dentro do array
    const deposito = usuario.depositos.id(depositoId);
    if (!deposito) throw new Error("Depósito não encontrado ou não pertence ao usuário.");

    // Marca como cancelado
    deposito.cancelado = true;
    await usuario.save();

    return usuario;
}

module.exports = cancelaDeposito;