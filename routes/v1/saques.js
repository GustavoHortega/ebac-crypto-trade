const express = require('express');

const{ logger } = require('../../utils');
const{ checaSaldo } = require('../../services');

const router = express.Router();

router.get('/', (req, res) => { // Retorna todos os saques do usuário logado
    res.json({
        sucesso: true,
        saques: req.user.saques,
    });
});

router.post('/', async (req, res) => { // Realiza saque do usuário logado
    const usuario = req.user;
    try {
        const valor = req.body.valor;
        const saldo = await checaSaldo(usuario);
    
        if (saldo < valor) { // Valida se o Usuário logado possui saldo
            throw new Error('Você não possui saldo para efetuar esse saque.');
        }

        usuario.saques.push({ valor: valor, data: new Date() });
        await usuario.save();

        res.json({
            sucesso: true,
            saldo: saldo - valor,
            saques: usuario.saques
        });
        
    } catch (e) {
        logger.error(`Erro no saque: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;