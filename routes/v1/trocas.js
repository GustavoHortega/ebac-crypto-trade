const express = require('express');

const { trocaMoedas } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const moedas = await trocaMoedas(
            req.user,
            req.body.cotacaoId,
            req.body.quantidade,
            req.body.operacao,
        );

        res.json({
            sucesso: true,
            moedas: moedas,
        });

    } catch (e) {
        logger.error('Erro ao trocar moedas:', e);

        res.status(422).json({
            sucesso: false,
            mensagem: e.message,
        });
    }
});

module.exports = router;