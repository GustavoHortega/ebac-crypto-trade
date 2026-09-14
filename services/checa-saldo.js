const { Usuario } = require('../models');

const checaSaldo = async (usuario) => {
    console.log(usuario);
    const operacoes = (await Usuario.aggregate([ // Aggregation pipeline (recebe uma lista de agragadores)
        { $match: { cpf: usuario.cpf } }, // Seleciona o usuário pelo CPF
        {
            $unwind: { // Desestrutura o array de moedas para que cada moeda seja um documento separado
                path: '$moedas',
                preserveNullAndEmptyArrays: true, // Garante que mesmo que não haja moedas, o usuário ainda seja retornado
            }
        },
        {
            $project: { // Seleciona os campos que serão retornados
                'moedas.quantidade': 1,
                'moedas.codigo': 1,
            }
        },
        {
            $lookup: { // Faz um join com a coleção de operações para trazer os depósitos e saques
                from: 'cotacaos', // Nome da coleção de operações
                localField: 'moedas.codigo', // Campo local que será usado para o join
                foreignField: 'moeda', // Campo da coleção de operações que será usado para o join
                as: 'cotacoes' // Nome do campo que será criado com os resultados do join
            }
        },
        {
            $project: {
                quantidade: '$moedas.quantidade',
                codigo: '$moedas.codigo',
                cotacao: {
                    $first: {
                        $sortArray: { // Ordena as cotações para pegar a mais recente
                            input: '$cotacoes',
                            sortBy: { data: -1 } // Ordena por data decrescente
                        }
                    }
                }
            }
        },
        {
            $project: {
                totalBrl: {
                    $multiply: [ '$quantidade',{ $ifNull: [ '$cotacao.valor', 1 ] }] // Calcula o valor total em BRL multiplicando a quantidade pela cotação
                },
                código: 1,
            }
        }

    ]));

    return operacoes.reduce((acc, operacao) => acc + operacao.totalBrl, 0); // Soma todos os valores em BRL das moedas do usuário
}

module.exports = checaSaldo;