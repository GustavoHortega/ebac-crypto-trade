const { Usuario } = require("../models");

const sacaCrypto = async (usuario, codigo, valor) => {
    const chamadaDeAtualizacao = await Usuario.updateOne(
        { // Atualiza o usuário
            id: usuario._id,
            moedas: {  // Verifica se o usuário possui a moeda e a quantidade suficiente para o saque
                $elemMatch: {
                    codigo: codigo,
                    quantidade: {
                        $gte: valor
                    }
                }
            }
        },
        {
            $inc: {
                'moedas.$.quantidade': -valor, // Atualiza a quantidade da moeda do usuário
            }
        }
    );

    if (chamadaDeAtualizacao.matchedCount === 0) { // Se não encontrou o usuário ou a moeda, lança um erro
        throw new Error(`Você não possui saldo suficiente em ${codigo} para efetuar esse saque.`);
    }

    return (await Usuario.findOne({ _id: usuario._id })).moedas; // Retorna as moedas atualizadas do usuário
};

module.exports = sacaCrypto;