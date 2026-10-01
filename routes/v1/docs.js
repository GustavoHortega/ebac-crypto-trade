const swaggerJSDoc = require('swagger-jsdoc');

const swaggerBase = {
    failOnError: true,
    openapi: '3.0.0',
    info: {
        title: 'API da Cryptotrade',
        description: 'Onde trocar cryptos é simples e rápido',
        version: '0.0.1',
    },
    components: {
        securitySchemes: {
            auth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            'Cotação': {
                type: 'object',
                properties: {
                    moeda: {
                        type: 'string',
                        example: 'BTC'
                    },
                    data: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-10-09T16:00:00.398Z'
                    },
                    id: {
                        type: 'string',
                        example: '6a5666604a590d34af9ea71c'
                    },
                    valor: {
                        type: 'number',
                        example: 329830.36851116066
                    }
                }
            },
            'Depósito': {
                type: 'object',
                properties: {
                    valor: {
                        type: 'number',
                        example: 1000
                    },
                    data: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-10-09T16:00:00.398Z'
                    },
                    cancelado: {
                        type: 'boolean',
                        example: false
                    },
                    _id: {
                        type: 'string',
                        example: '6a5666604a590d34af9ea71c'
                    }
                }
            }
        }
    }
};

const opcoes = {
    definition: swaggerBase,
    apis: ['./routes/v1/*.js']
};

module.exports = swaggerJSDoc(opcoes);
