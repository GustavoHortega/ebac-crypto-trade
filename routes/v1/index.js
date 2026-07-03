const express = require('express');
const passport = require('passport');

require('./auth/jwt'); // Importa a configuração do Passport JWT

const statusRouter = require('./status');
const usuariosRouter = require('./usuarios');
const authRouter = require('./auth');
const depositosRouter = require('./depositos');
const saquesRouter = require('./saques');
const cotacoesRouter = require('./cotacoes');

const router = express.Router();

router.use('/status', statusRouter); // Rota de status do sistema
router.use('/usuarios', usuariosRouter); // Rota de usuários
router.use('/auth', authRouter); // Rota de autenticação
router.use('/cotacoes', cotacoesRouter); // Rota de cotações
router.use('/depositos', passport.authenticate('jwt', { session: false }), depositosRouter); // Rota de depósitos
router.use('/saques', passport.authenticate('jwt', { session: false }), saquesRouter); // Rota de saques

module.exports = router;
