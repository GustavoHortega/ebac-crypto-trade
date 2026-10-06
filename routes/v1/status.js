const express = require('express');

const router = express.Router();

const { enviaEmail } = require('../../services');

/**
 * @openapi
 * /v1/status:
 *  get:
 *    description: Rota de checagem de status
 *    responses:
 *      200:
 *        description: A API está funcional!
 *    tags:
 *      - Healthcheck
 */
router.get('/', async (_req, res) => {

  //APAGAR DEPOIS DE TESTAR O ENVIO DE EMAIL
  await enviaEmail.sendMail({
    from: '"Gustavo" <guga32716@gmail.com>',
    to: 'usuario-1@exemplo.com, usuario-2@exemplo.com',
    subject: 'Teste de envio de e-mail',
    text: 'Este é um teste de envio de e-mail usando Nodemailer.',
    html: '<h1>Este é um teste de envio de e-mail usando Nodemailer.</h1>',
  });

  res.json({
    sucesso: true,
    status: 'ok',
  });
});

module.exports = router;
