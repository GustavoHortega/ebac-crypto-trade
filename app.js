const createError = require('http-errors');
const express = require('express');


const router = require('./routes');
const passport = require('passport');

const app = express();

// config de autenticação
app.use(passport.initialize());

// configurando formatos de parâmetros
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// rotas
app.use('/', router);

// caso nenhuma rota de match, redireciona para a 404
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, _req, res, _next) {
  res.status(err.status || 500);
  res.json({
    sucesso: false,
    erro: err.message,
  });
});

module.exports = app;
