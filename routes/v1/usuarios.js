const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { logger } = require('../../utils');
const { criaUsuario, geraSegredo, checaSaldo } = require('../../services');

const router = express.Router();

router.post('/', async (req, res) => { // Rota para criar um novo usuário
    const dados = req.body.usuario;
    const urlDeRedirecionamento = req.body.redirect;

    if (!urlDeRedirecionamento) {
        return res.status(422).json({
            sucesso: false,
            erro: 'URL de redirecionamento não informada para confirmação de e-mail',
        });
    }

    try {
        const usuario = await criaUsuario(dados, urlDeRedirecionamento);

        res.json({
            sucesso: true,
            usuario: usuario,
        });
    }
    catch (e) {
        logger.error(`Erro na criação do usuário ${e.message}`);
        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

router.put('/senha', passport.authenticate('jwt', { session: false }), async (req, res) => { // Rota para alterar a senha do usuário
    const { senha } = req.body;

    try {
        const usuario = req.user;
        usuario.senha = await bcrypt.hash(senha, 10);
        await usuario.save();

        res.json({
            sucesso: true,
            mensagem: 'Senha alterada com sucesso',
        });

    } catch (e) {
        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

router.post('/otp', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const usuario = req.user;

    try {
        const { segredo, qrcode } = geraSegredo(usuario.email);

        usuario.segredoOtp = segredo;
        await usuario.save();

        return res.send(qrcode); //Não é um json, é um svg.
    } catch (e) {
        logger.error(`Erro na geração do TOTP: ${e.message}`);

        return res.status(500).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

/**
 * @openapi
 * /v1/usuarios/me:
 *  get:
 *      description: Rota que retorna perfil do usuário
 *      security:
 *          - auth: []
 *      responses:
 *          200:
 *              description: Informações do perfil do usuário
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              usuario:
 *                                  $ref: '#/components/schemas/Usuário' 
 *          401:
 *              description: Autorização está faltando ou inválida
 *      tags:
 *          - Usuário
 */

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => { // Rota para obter informações do perfil do usuário
    res.json({
        sucesso: true,
        usuario: req.user,
        saldo: await checaSaldo(req.user),
    });
});

module.exports = router;