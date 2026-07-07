const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');

// Cria uma fila de jobs chamada "busca-cotacoes" usando o Bull e a URL do Redis definida na variável de ambiente REDIS_URL
const cotacoesQueue = new Queue('busca-cotacoes', process.env.REDIS_URL); 

cotacoesQueue.process(cotacoesWorker); // Registra o worker para processar os jobs da fila de cotações

const agendaTarefas = () => { // Adiciona um job à fila de cotações a cada 15 minutos usando a sintaxe de cron do Bull
    cotacoesQueue.add({}, { repeat: { cron: '*/1 * * * *' } });
};

module.exports = { agendaTarefas };