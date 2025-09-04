const express = require('express');

const { checaSaldo, cancelaDeposito } = require('../../services');
const { logger } = require('../../utils')

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        sucesso: true,
        depositos: req.user.depositos,
    })
});

router.post('/', async(req, res) => {
    const usuario = req.user;

    try {
        const valor = req.body.valor;
        usuario.depositos.push({ valor: valor, data: new Date() });
        await usuario.save();

        res.json({
            sucesso: true,
            saldo: await checaSaldo(usuario),
            depositos: usuario.depositos,

        })
    } catch (e) {
        logger.error(`Erro no depósito: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message
        })
    }
})

router.delete('/:depositoId', async (req, res) => {
    try{
        const userId = req.user._id;
        const { depositoId } = req.params;

        const usuario = await cancelaDeposito(userId, depositoId);

        res.json({
            sucesso: true,
            mensagem: 'Depósito cancelado com sucesso!',
            saldo: await checaSaldo(usuario),
            depositos: usuario.depositos
        });
    } catch (e) {
        logger.error(`Erro ao cancelar deposito: ${e.message}`);
        res.status(400).json({
            sucesso: false,
            erro: e.message5
        });
    }
});

module.exports = router;