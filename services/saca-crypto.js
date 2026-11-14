const { Usuario } = require("../models");

const sacaCrypto = async (usuario, codigo, valor) => {
    if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
        throw new Error('Informe um valor válido para o saque.');
    }

    const chamadaDeAtualizacao = await Usuario.updateOne(
        {
            _id: usuario._id,
            moedas: {
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
                'moedas.$.quantidade': -valor,
            }
        }
    );

    if (chamadaDeAtualizacao.matchedCount === 0) {
        throw new Error(`Você não possui saldo suficiente em ${codigo} para efetuar esse saque.`);
    }

    return (await Usuario.findOne({ _id: usuario._id })).moedas;
};

module.exports = sacaCrypto;