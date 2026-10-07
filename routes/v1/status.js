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
  
  res.json({
    sucesso: true,
    status: 'ok',
  });
});

module.exports = router;
