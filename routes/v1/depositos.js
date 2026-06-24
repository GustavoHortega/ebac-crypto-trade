const express = require('express');

const { logger } =  require('../../utils');

const router = express.Router();

router.get('/', async (req, res) => { // Rota para listar os depósitos do usuário autenticado
    res.json({
        sucesso: true,
        depositos: req.user.depositos,
    });
});

router.post('/', async (req, res) => { // Rota para criar um novo depósito para o usuário autenticado
    const usuario = req.user;

    try {
        const valor = req.body.valor;
        usuario.depositos.push({ valor, data: new Date() });
        await usuario.save();

        res.json({
            sucesso: true,
            depositos: usuario.depositos,
        });
    } catch (e) {
        logger.error(`Erro ao fazer depósito: ${e.message}`);
        res.status(500).json({
            sucesso: false,
            mensagem: e.message,
        });
    }
});

module.exports = router;