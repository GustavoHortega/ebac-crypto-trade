const { Corretora } = require('../models');
const { CNPJ, RESERVA_MINIMA } = require('../constants');
const { logger } = require('../utils/logger');

const saldoWorker = async (job, done) => {
    try {
        logger.info(`Checando aumento de saldos... Tentativa ${job.attemptsMade + 1}/${job.opts.attempts}`);
    
        const corretora = await Corretora.findOne({ cnpj: CNPJ });
    
        if (corretora.caixa < RESERVA_MINIMA) {
            corretora.caixa += RESERVA_MINIMA;
        }
    
        await corretora.save();
    
        logger.info(`Saldo atualizado para ${corretora.caixa}`);

        done();
    } catch (e) {
        logger.error(`Erro ao atualizar saldo: ${e.message}`);
        done(e);
    }
};

module.exports = saldoWorker;