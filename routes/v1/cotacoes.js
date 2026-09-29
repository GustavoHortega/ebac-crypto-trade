const express = require('express');

const { buscaCotacoesNoBanco } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

/**
 * @openapi
 * /v1/cotacoes:
 *  get:
 *      description: Retorna a ultima cotação válida de cada moeda no nosso sistema.
 *      responses:
 *          200:
 *              description: Recebe uma lista de cotações, atente-se ao ID da cotações.
 *      tags:
 *          - operacoes
 */
router.get('/', async (_req, res) => { // Rota para buscar cotações de criptomoedas
    try {
        const cotacoes = await buscaCotacoesNoBanco();

        res.json({
            sucesso: true,
            cotacoes,
        })
    } catch (e) {
        logger.error('Erro ao buscar cotações:', e);
        res.status(500).json({
            sucesso: false,
            mensagem: `Erro ao buscar cotações: ${e.message}`,
        });
    }
});

module.exports = router;