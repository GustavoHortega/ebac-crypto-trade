const { Relatorio, Usuario } = require('../models');

const { logger } = require('../utils');
const { checaSaldo } = require('../services');


const relatorioWorker = async () => {
    try {
        logger.info('buscando todos so usuários da base de dados...');

        let temMaisUsuarios = true;
        let skip = 0;

        while (temMaisUsuarios) {

            const usuarios = await Usuario.find().skip(skip).limit(10); // Limita a busca a 10 usuários para evitar sobrecarga

            if (!usuarios.length) { // Verifica se a lista retornada é vazia
                temMaisUsuarios = false;
            }

            for (const usuario of usuarios) {
                logger.info(`processando relatório para o usuário: ${usuario._id}`);

                await Relatorio.create({ // Cria o relatório no banco
                    usuarioId: usuario._id,
                    data: new Date(),
                    saldo: await checaSaldo(usuario),
                });
            }

            skip += 10;
        }


        logger.info('Relatórios criados com sucesso');
        
    } catch (e) {
        logger.error(`Errp ao processar o job ${e.message}`);
        throw e;
    }
};

module.exports = relatorioWorker;