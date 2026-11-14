const express = require('express');

const { logger } = require('../../utils');
const { checaSaldo } = require('../../services');

const router = express.Router();

// GET /v1/saldo
router.get('/', async (req, res) => {
    try {
        const saldo = await checaSaldo(req.user);

        res.json({
            sucesso: true,
            saldo: saldo,
        });
    } catch (e) {
        logger.error(`Erro ao consultar saldo: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;