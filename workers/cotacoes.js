const { buscaCotacoesOnline } = require('../services');

const { logger } = require('../utils');

const { Cotacao } = require('../models');

const cotacoesWorker = async (_job) => { // Worker para buscar cotações de criptomoedas online e salvar no banco de dados
    logger.info('buscando cotações online...');

    const cotacoes = await buscaCotacoesOnline();

    logger.info('cotações online buscadas com sucesso!');

    await Cotacao.insertMany(cotacoes);

    logger.info('cotações online salvas no banco de dados!');
};

module.exports = cotacoesWorker;