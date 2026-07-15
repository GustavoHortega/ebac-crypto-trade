const { geraTopMovimentos } = require('../services');

const { logger } = require('../utils');

const topMovimentosWorker = async () => {

    try {

        const resultado = await geraTopMovimentos();

        logger.info(`Top movimentos gerados para ${ resultado.dia }`);

    } catch (e) {

        logger.error(`Erro ao gerar top movimentos: ${ e.message }`);

    }

};

module.exports = topMovimentosWorker;