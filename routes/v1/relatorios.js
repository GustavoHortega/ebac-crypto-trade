const express = require('express');

const router = express.Router();

const { geraPnl } = require('../../services');
const { logger } = require('../../utils');

router.get('/pnl', async (req, res) => { // PNL é a sigla para Profit and Loss (Lucro e Perda)
    try {
            const pnl = await geraPnl(req.user);

            res.json({
                sucesso: true,
                pnl: pnl,
            })
    } catch (e) {
        logger.error(`Erro ao gerar PNL: ${e.message}`);
        
        res.status(500).json({
            sucesso: false,
            mensagem: e.message,
        });
    }
});

module.exports = router;