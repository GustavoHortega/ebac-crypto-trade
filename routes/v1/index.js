const express = require('express');
const passport = require('passport');

const statusRouter = require('./status');
const usuariosRouter = require('./usuarios');
const authRouter = require('./auth');
const depositosRouter = require('./depositos');
const saquesRouter = require('./saques');

const router = express.Router();

require('./auth/jwt');

router.use('/depositos', passport.authenticate('jwt', { session: false }), depositosRouter);
router.use('/saques', passport.authenticate('jwt', { session: false }), saquesRouter);
router.use('/status', statusRouter);
router.use('/usuarios', usuariosRouter);
router.use('/auth', authRouter);

module.exports = router;
