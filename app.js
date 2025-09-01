require('dotenv').config()

const createError = require('http-errors'); //Biblioteca usada pra criar objetos de erro http padronizados com status code menagens e propriedades
const express = require('express');
const passport = require('passport');

const { logger } = require('./utils');
const { connect } = require('./models');
const router = require('./routes');

const app = express();

//configurando autenticação
app.use(passport.initialize()); //Inicializa o passport

// configurando formatos de parâmetros
app.use(express.json()); //Este middleware analisa o corpo (body) das requisições que usam o formato JSON, e o transforma em um objeto JavaScript acessível via req.body.
app.use(express.urlencoded({ extended: false })); //analisa o corpo das requisições que vêm com application/x-www-form-urlencoded, que é o formato típico de formulários HTML.

// declarando rotas
app.use('/', router);

// caso nenhuma rota de match, redireciona para a 404. Esse middleware genérico é executado para todas as rotas, após as tratativas anteriores.
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler. Este middleware é responsável por interceptar erros que ocorreram em qualquer ponto da aplicação, inclusive os lançados manualmente (como o createError(404)), e enviar uma resposta JSON padronizada ao cliente.
app.use(function(err, _req, res, _next) { //DICA: um middleware com 4 argumentos é exclusivamente para erros.
  res.status(err.status || 500); // Se o erro possui status, ele é utilizado, caso não ele retorna o erro 500 (Internal server error).
  res.json({
    sucesso: false,       //Esse trecho retorna como resposta
    erro: err.message,    //uma mensage de falha com a menssagem do erro
  });
});

const porta = 3000;
app.listen(porta, () => {
  connect();

  logger.info(`Servidor ouvindo na porta ${porta}`);
});

module.exports = app;
