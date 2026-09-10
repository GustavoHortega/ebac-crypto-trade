const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');
const saldoWorker = require('./saldo');
const topMovimentosWorker = require('./top-movimentos');

// Cria uma fila de jobs chamada "busca-cotacoes" usando o Bull e a URL do Redis definida na variável de ambiente REDIS_URL
const cotacoesQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);
const aumentaSaldoQueue = new Queue('saldo', process.env.REDIS_URL);
const topMovimentosQueue = new Queue('top-movimentos', process.env.REDIS_URL);

cotacoesQueue.process('cotacoes', cotacoesWorker); // Registra o worker para processar os jobs da fila de cotações
aumentaSaldoQueue.process('saldo', saldoWorker); // Registra o worker para processar os jobs da fila de aumento de saldo
topMovimentosQueue.process('top-movimentos', topMovimentosWorker); // Registra o worker para processar os jobs da fila de top movimentos

const agendaTarefas = async () => { // Adiciona um job à fila de cotações a cada 15 minutos usando a sintaxe de cron do Bull

    // Remove os jobs repetíveis existentes da fila de cotações
    const cotacoesAgendadas = await cotacoesQueue.getRepeatableJobs(); // Obtém os jobs repetíveis da fila de cotações
    for (const jobDeBusca of cotacoesAgendadas) {
        await cotacoesQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    // Adiciona um novo job repetível à fila de cotações para buscar cotações online a cada 15 minutos
    await cotacoesQueue.add('cotacoes', {},
        {
            repeat: { cron: '*/15 * * * *' }, // Executa a cada 15 minutos
            attempts: 3, // Número máximo de tentativas em caso de falha
            backoff: 5000, // Tempo de espera entre tentativas em caso de falha (em milissegundos)
        }
    );

    const topJobs = await topMovimentosQueue.getRepeatableJobs();
    for (const job of topJobs) {
        await topMovimentosQueue.removeRepeatableByKey(job.key);
    }

    await topMovimentosQueue.add('top-movimentos', {},
        {
            //Cron para testes que executa a cada um minuto -> { cron: '*/1 * * * *' }
            repeat: { cron: '59 23 * * *' }, // Executa diariamente às 23:59
            attempts: 3,
            backoff: 5000,
        }

    );

    const saldoJobs = await aumentaSaldoQueue.getRepeatableJobs();
    for (const job of saldoJobs) {
        await aumentaSaldoQueue.removeRepeatableByKey(job.key);
    }

    await aumentaSaldoQueue.add('saldo', {},
        {
            repeat: { cron: '0 0 * * *' }, // Executa diariamente à meia-noite
            attempts: 3,
            backoff: 5000,
        }
        
    );
};

module.exports = { agendaTarefas };