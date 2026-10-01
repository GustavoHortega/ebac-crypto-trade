const express = require('express');

const { logger } = require('../../utils');
const { checaSaldo } = require('../../services');

const router = express.Router();

/**
 * @openapi
 * /v1/depositos:
 *  get:
 *      description: Retorna a lista de depósitos do usuário autenticado
 *      security:
 *          - auth: []
 *      responses:
 *          200:
 *              description: Lista de depósitos do usuário
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              depositos:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Depósito'
 *          401:
 *              description: Usuário não autenticado
 *      tags: 
 *          - Operações
 */
router.get('/', async (req, res) => { // Rota para listar os depósitos do usuário autenticado
    res.json({
        sucesso: true,
        depositos: req.user.depositos,
    });
});

/**
 * @openapi
 * /v1/depositos:
 *  post:
 *      description: Cria um novo depósito para o usuário autenticado
 *      security:
 *          - auth: []
 *      requestBody:
 *          description: Informações do depósito
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          valor:
 *                              type: number
 *                              example: 1000
 *      responses:
 *          200:
 *              description: Depósito criado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              depositos:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Depósito'
 *                              saldo:
 *                                  type: number
 *                                  example: 1000
 *          401:
 *              description: Usuário não autenticado
 *          500:
 *              description: Erro ao criar depósito
 *      tags:
 *          - Operações
 */
router.post('/', async (req, res) => { // Rota para criar um novo depósito para o usuário autenticado
    const usuario = req.user;

    try {
        const valor = req.body.valor;
        usuario.depositos.push({ valor, data: new Date() });

        const saldoEmMoedas = await usuario.moedas.find(m => m.codigo === 'BRL');
        if (saldoEmMoedas) {
            saldoEmMoedas.quantidade += valor;
        } else {
            usuario.moedas.push({ codigo: 'BRL', quantidade: valor });
        }

        await usuario.save();

        res.json({
            sucesso: true,
            depositos: usuario.depositos,
            saldo: await checaSaldo(req.user),
        });
    } catch (e) {
        logger.error(`Erro ao fazer depósito: ${e.message}`);
        res.status(500).json({
            sucesso: false,
            mensagem: e.message,
        });
    }
});

/**
 * @openapi
 * /v1/depositos/cancelar:
 *  post:
 *      description: Cancela o último depósito do usuário autenticado
 *      security:
 *          - auth: []
 *      responses:
 *          200:
 *              description: Depósito cancelado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              mensagem:
 *                                  type: string
 *                                  example: Depósito cancelado com sucesso
 *                              depositos:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Depósito'
 *          401:
 *              description: Usuário não autenticado
 *          500:
 *              description: Erro ao cancelar depósito
 *      tags:
 *          - Operações
 */
router.post('/cancelar', async (req, res) => { // Rota para cancelar o último depósito do usuário autenticado
    const usuario = req.user;
    try {
        const deposito = await usuario.depositos[usuario.depositos.length - 1]; // Pega o último depósito do usuário
        deposito.cancelado = true;
        await usuario.save();

        res.json({
            sucesso: true,
            mensagem: 'Depósito cancelado com sucesso',
            deposito: deposito,
        });

    } catch (e) {
        logger.error(`Erro ao cancelar depósito: ${e.message}`);

        res.status(500).json({
            sucesso: false,
            mensagem: e.message,
        });
    }
});

module.exports = router;