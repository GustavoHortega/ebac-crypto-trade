const express = require('express');

const { logger } = require('../../utils');
const { checaSaldo, sacaCrypto } = require('../../services');

const router = express.Router();

/**
 * @openapi
 * /v1/saques:
 *  get:
 *      description: Retorna a lista de saques do usuário autenticado
 *      security:
 *          - auth: []
 *      responses:
 *          200:
 *              description: Lista de saques do usuário
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              Saques:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Saque'
 *          401:
 *              description: Usuário não autenticado
 *      tags: 
 *          - Operações
 */
router.get('/', (req, res) => { // Retorna todos os saques do usuário logado
    res.json({
        sucesso: true,
        saques: req.user.saques,
    });
});

/**
 * @openapi
 * /v1/saques:
 *  post:
 *      description: Realiza saque do usuário logado para fora da cryptotrade (em reais)
 *      security:
 *          - auth: []
 *      requestBody:
 *          description: Valor do saque em reais
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          valor:
 *                              type: number
 *      responses:
 *          200:
 *              description: Saque realizado com sucesso, retorna o saldo atualizado e a lista de saques do usuário
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              saldo:
 *                                  type: number
 *                                  example: 500
 *                              Saques:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Saque'
 *          422:
 *              description: Valor do saque inválido ou saldo insuficiente
 *          401:
 *              description: Usuário não autenticado
 *      tags:
 *          - Operações
 */
router.post('/', async (req, res) => { // Realiza saque do usuário logado para fora da cryptotrade (em reais)
    const usuario = req.user;
    try {
        const valor = req.body.valor;
        const saldo = await checaSaldo(usuario);

        if (saldo < valor) { // Valida se o Usuário logado possui saldo
            throw new Error('Você não possui saldo para efetuar esse saque.');
        }

        usuario.saques.push({ valor: valor, data: new Date() });

        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');
        saldoEmMoedas.quantidade -= valor; // Atualiza o saldo em reais do usuário

        await usuario.save();

        res.json({
            sucesso: true,
            saldo: saldo - valor,
            saques: usuario.saques
        });

    } catch (e) {
        logger.error(`Erro no saque: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

/**
 * @openapi
 *  /v1/saques/{codigo}:
 *      post:
 *          description: Realiza saque do usuário logado em uma moeda específica para fora da cryptotrade (carteira externa)
 *          security:
 *            - auth: []
 *          requestBody:
 *              description: Valor do saque em na moeda especificada
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              valor:
 *                                  type: number
 *          parameters:
 *            - in: path
 *              name: codigo
 *              schema:
 *                  type: string
 *                  example: BTC
 *              required: true
 *              description: Código da moeda a ser sacada
 *          responses:
 *              200:
 *                  description: Saque realizado com sucesso, retorna o saldo atualizado e a lista de moedas do usuário
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  sucesso:
 *                                      type: boolean
 *                                      example: true
 *                                  moedas:
 *                                      type: array
 *                                      items: 
 *                                          $ref: '#/components/schemas/Moeda'
 *              422:
 *                  description: Valor para saque inválido ou saldo insuficiente
 *              401:
 *                  description: Usuário não autenticado    
 *          tags:
 *              - Operações
 */
router.post('/:codigo', async (req, res) => { // Realiza saque do usuário logado em uma moeda específica
    const usuario = req.user;
    const codigo = req.params.codigo;

    try {
        const valor = req.body.valor;
        const moedas = await sacaCrypto(usuario, codigo, valor);

        res.json({
            sucesso: true,
            moedas: moedas,
        });
    } catch (e) {
        logger.error(`Erro no saque da moeda ${codigo}: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});


module.exports = router;