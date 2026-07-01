const express = require('express');

const { logger } = require('../../utils');
const { checaSaldo } = require('../../services');

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
            saldo: await checaSaldo(req.user),
        });
    } catch (e) {
        logger.error(`Erro ao fazer depósito: ${e.message}`);
        res.status(500).json({
            sucesso: false,
            mensagem: e.message,
        });
    }
});

router.post('/cancelar', async (req, res) => { // Rota para cancelar o último depósito do usuário autenticado
    const usuario = req.user;
    try {
        const deposito = await usuario.depositos[usuario.depositos.length - 1]; // Pega o último depósito do usuário
        deposito.cancelado = true;
        await usuario.save();

        res.json({
            sucesso: true,
            mensagem: 'Depósito cancelado com sucesso',
            deposito: deposito,
        });

    } catch (e) {
        logger.error(`Erro ao cancelar depósito: ${e.message}`);

        res.status(500).json({
            sucesso: false,
            mensagem: e.message,
        });
    }
});

module.exports = router;