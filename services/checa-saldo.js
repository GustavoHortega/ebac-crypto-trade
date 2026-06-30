const { Usuario } = require('../models');

const checaSaldo = async (usuario) => {
    const operacoes = (await Usuario.aggregate([ // Aggregation pipeline (recebe uma lista de agragadores)
        { $match: { cpf: usuario.cpf } }, // Seleciona o usuário pelo CPF
        {
            $unwind: { // Separa todos os depósitos em um objeto para cada depósito, repetindo as demias informações de usuario
                path: "$depositos",
                preserveNullAndEmptyArrays: true, //Faz com que documentos com campos vazios ou nulos sejam preservados
            }
        },
        {
            $group: { // Agruppa todos os documentos separados anteriormente através do id com a soma dos depósitos
                _id: "$id",
                depositos: { $sum: "$depositos.valor" },
                saques: { $last: "$saques" }
            }
        },
        {
            $unwind: { // Separa todos os saques em um objeto para cada depósito, repetindo as demias informações de usuario
                path: "$saques",
                preserveNullAndEmptyArrays: true, //Faz com que documentos com campos vazios ou nulos sejam preservados
            }
        },
        {
            $group: { // Agruppa todos os documentos separados anteriormente através do id com a soma dos saques
                _id: "$id",
                saques: { $sum: "$saques.valor" },
                depositos: { $last: "$depositos" }
            }
        },
    ]))[0];
    
    return operacoes.depositos - operacoes.saques; // Faz a diferença entre depósitos e saques.
}

module.exports = checaSaldo;