const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');
const topMovimentosWorker = require('./top-movimentos');

// Cria uma fila de jobs chamada "busca-cotacoes" usando o Bull e a URL do Redis definida na variável de ambiente REDIS_URL
const cotacoesQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);
const topMovimentosQueue = new Queue('top-movimentos', process.env.REDIS_URL);

cotacoesQueue.process('cotacoes', cotacoesWorker); // Registra o worker para processar os jobs da fila de cotações
topMovimentosQueue.process('top-movimentos', topMovimentosWorker);

const agendaTarefas = async () => { // Adiciona um job à fila de cotações a cada 15 minutos usando a sintaxe de cron do Bull

    // Remove os jobs repetíveis existentes da fila de cotações
    const cotacoesAgendadas = await cotacoesQueue.getRepeatableJobs(); // Obtém os jobs repetíveis da fila de cotações
    for (const jobDeBusca of cotacoesAgendadas) {
        await cotacoesQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    // Adiciona um novo job repetível à fila de cotações para buscar cotações online a cada 15 minutos
    await cotacoesQueue.add('cotacoes', {},
        {
            repeat: { cron: '*/1 * * * *' },
            attempts: 3, // Número máximo de tentativas em caso de falha
            backoff: 5000, // Tempo de espera entre tentativas em caso de falha (em milissegundos)
        }
    );

    const topJobs = await topMovimentosQueue.getRepeatableJobs();
    for (const job of topJobs) {
        await topMovimentosQueue.removeRepeatableByKey(job.key);
    }
    await topMovimentosQueue.add('top-movimentos',{},
        {
            repeat: { cron: '*/1 * * * *' },//{ cron: '59 23 * * *' },
            attempts: 3,
            backoff: 5000,
        }

    );
};

module.exports = { agendaTarefas };