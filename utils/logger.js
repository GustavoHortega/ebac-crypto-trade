const winston = require('winston'); //Winston é uma api de logs com vários formatos e níveis. A função

const logger = winston.createLogger({ //Criação do log personalizado.
  level: process.env.LOG_LEVEL, //Definindo o nível minimo do log.
  format: winston.format.combine( //Formatação do log.
    winston.format.json(), //formata o log como json.
    winston.format.colorize(), //coloca cor nos logs
  ),
});

/*Aqui, o sistema verifica se não está em produção. 
Se for ambiente de desenvolvimento ou teste, ele adiciona 
o transporte de console com um formato mais simples e legível.*/
if (process.env.NODE_ENV !== 'production') {    
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
