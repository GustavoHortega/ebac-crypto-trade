const { TopCliente } = require('../models');

const buscaTopClientes = async (dia) => {
    const top = await TopCliente.aggregate([
        {
            $match: {
                dia: { $eq: dia }
            }
        },
        {
            $facet: {
                gainers: [
                    { $unwind: { path: '$gainers', preserveNullAndEmptyArrays: true } },
                    { $set: { nomeEncontrado: { $regexFind: { input: '$gainers.usuario', regex: /nome: '([^']+)'/ } } } },
                    { $project: { _id: 0, nome: { $arrayElemAt: ['$nomeEncontrado.captures', 0] }, variacao: '$gainers.variacao' } },
                    { $sort: { variacao: -1 } }
                ],
                loosers: [
                    { $unwind: { path: '$loosers', preserveNullAndEmptyArrays: true } },
                    { $set: { nomeEncontrado: { $regexFind: { input: '$loosers.usuario', regex: /nome: '([^']+)'/ } } } },
                    { $project: { _id: 0, nome: { $arrayElemAt: ['$nomeEncontrado.captures', 0] }, variacao: '$loosers.variacao' } },
                    { $sort: { variacao: 1 } }
                ]
            }
        }
    ]);

    return top;
};

module.exports = buscaTopClientes;