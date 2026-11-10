const { Relatorio } = require('../models');
const { logger } = require('../utils');

const geraPnl = async (usuario) => {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1); // Define a data de ontem
    ontem.setUTCHours(0, 0, 0, 0); // Define a hora para 00:00:00.000 para garantir que estamos pegando todos os relatórios de ontem

    const relatorios = await Relatorio.aggregate([
        {
            $match: {
                usuarioId: usuario._id,
                data: { $gte: ontem },
            }
        },
        {
            $sort: { data: -1 }
        }
    ]);

    if (relatorios.length === 0) { // Nenhum relatório encontrado para o usuário
        return 0;
    }

    if (relatorios.length === 1) { // Apenas um relatório encontrado para o usuário, então o PNL é igual ao valor do PNL desse relatório
        return relatorios[0].saldo;        
    }
    
    return relatorios[0].saldo - relatorios[1].saldo; // Calcula o PNL como a diferença entre o PNL do relatório mais recente e o PNL do relatório anterior
};

module.exports = geraPnl;