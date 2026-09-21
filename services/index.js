module.exports = {
    criaUsuario: require('./cria-usuario'),
    logaUsuario: require('./loga-usuario'),
    checaSaldo: require('./checa-saldo'),
    trocaMoedas: require('./troca-moedas'),
    buscaCotacoesOnline: require('./busca-cotacoes').buscaCotacoesOnline,
    buscaCotacoesNoBanco: require('./busca-cotacoes').buscaCotacoesNoBanco,
    geraTopMovimentos: require('./gera-top-movimentos'),
    sacaCrypto: require('./saca-crypto'),
    geraPnl: require('./gera-pnl'),
};