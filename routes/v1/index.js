const express = require('express');

require('./auth/jwt'); // Importa a configuração do Passport JWT

const statusRouter = require('./status');
const usuariosRouter = require('./usuarios');
const authRouter = require('./auth');

const router = express.Router();

router.use('/status', statusRouter); // Rota de status do sistema
router.use('/usuarios', usuariosRouter); // Rota de usuários
router.use('/auth', authRouter); // Rota de autenticação
module.exports = router;
