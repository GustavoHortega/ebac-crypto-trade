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
        }
    }
};

const opcoes = {
    definition: swaggerBase,
    apis: ['./routes/v1/*.js']
};

module.exports = swaggerJSDoc(opcoes);