
const { Usuario } = require('../models');

const checaSaldo = async (usuario) => {
    const operacoes = await Usuario.aggregate([
        { $match: { cpf: usuario.cpf } },
        {
            $unwind: {
                path: '$moedas',
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $match: {
                'moedas.codigo': 'BRL'
            }
        },
        {
            $project: {
                totalBrl: '$moedas.quantidade'
            }
        }
    ]);

    return operacoes.reduce((acc, operacao) => acc + operacao.totalBrl, 0);
}

module.exports = checaSaldo;
