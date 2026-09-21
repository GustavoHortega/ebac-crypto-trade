const { Relatorio } = require('../models');

const geraPnl = async (usuario) => {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1); // Define a data de ontem

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
        throw new Error('Nenhum relatório encontrado para o usuário.');
    }

    if (relatorios.length === 1) { // Apenas um relatório encontrado para o usuário, então o PNL é igual ao valor do PNL desse relatório
        return relatorios[0].pnl;        
    }
    
    return relatorios[0].pnl - relatorios[1].pnl; // Calcula o PNL como a diferença entre o PNL do relatório mais recente e o PNL do relatório anterior
};

module.exports = geraPnl;