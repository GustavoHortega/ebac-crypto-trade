const express = require('express');

const { trocaMoedas } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

/**
 * @openapi
 * /v1/trocas:
 *  post:
 *      description: Realiza troca de moedas para o usuário logado
 *      security:
 *          - auth: []
 *      requestBody:
 *          description: Dados da troca de moedas
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          cotacaoId:
 *                              type: string
 *                              example: 64a1f3e2c9b1f2a3b4c5d6e7
 *                          quantidade:
 *                              type: number
 *                          operacao:
 *                              type: string
 *                              example: compra
 *      responses:
 *          200:
 *              description: Troca realizada com sucesso, retorna a lista de moedas do usuário
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              moedas:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Moeda'
 *          422:
 *              description: Dados da troca inválidos ou cotação expirada
 *          401:
 *              description: Usuário não autenticado
 *      tags:
 *          - Operações
 */
router.post('/', async (req, res) => {
    try {
        const moedas = await trocaMoedas(
            req.user,
            req.body.cotacaoId,
            req.body.quantidade,
            req.body.operacao,
        );

        res.json({
            sucesso: true,
            moedas: moedas,
        });

    } catch (e) {
        logger.error('Erro ao trocar moedas:', e);

        res.status(422).json({
            sucesso: false,
            mensagem: e.message,
        });
    }
});

module.exports = router;