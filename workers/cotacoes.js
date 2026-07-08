const { buscaCotacoesOnline } = require('../services');

const { logger } = require('../utils');

const { Cotacao } = require('../models');

const cotacoesWorker = async (job) => { // Worker para buscar cotações de criptomoedas online e salvar no banco de dados
    try {
        logger.info(`buscando cotações online... Tentativa ${job.attemptsMade + 1}/${job.opts.attempts}`);

        const cotacoes = await buscaCotacoesOnline();

        logger.info('cotações online buscadas com sucesso!');

        await Cotacao.insertMany(cotacoes);

        logger.info('cotações online salvas no banco de dados!');

    } catch (e) {
        logger.error(`Erro ao buscar cotações online: ${e.message}`);
    };


};

module.exports = cotacoesWorker;