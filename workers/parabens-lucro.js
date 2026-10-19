
const { Usuario } = require('../models');

const { logger } = require('../utils');
const { analisaLucro, enviaEmailDeParabens } = require('../services');

const parabensLucroWorker = async () => {
    try {
        logger.info('Buscando todos os usuários da base de dados...');

        let temMaisUsuarios = true;
        let skip = 0;

        while (temMaisUsuarios) {
            const usuarios = await Usuario.find()
                .skip(skip)
                .limit(10);

            if (!usuarios.length) {
                temMaisUsuarios = false;
                continue;
            }

            for (const usuario of usuarios) {
                logger.info(`Processando usuário: ${usuario._id}`);

                const lucro = await analisaLucro(usuario);

                if (lucro) {
                    await enviaEmailDeParabens(usuario);

                    logger.info(
                        `E-mail enviado ao usuário ${usuario._id} com lucro superior a R$ 1.000,00.`
                    );
                }
            }

            skip += 10;
        }

        logger.info('Processamento dos e-mails concluído.');
    } catch (e) {
        logger.error(`Erro ao processar o job: ${e.message}`);
        throw e;
    }
};

module.exports = parabensLucroWorker;
