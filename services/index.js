const { validaOtp } = require('./otp');

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
    enviaEmailDeConfirmacao: require('./envia-email').enviaEmailDeConfirmacao,
    enviaEmailDeRecuperacao: require('./envia-email').enviaEmailDeRecuperacao,
    enviaEmailDeParabens: require('./envia-email').enviaEmailDeParabens,
    confirmaConta: require('./confirma-conta'),
    validaTokenAlteracaoDeSenha: require('./valida-token-senha'),
    analisaLucro: require('./analisa-lucro'),
    geraSegredo: require('./otp').geraSegredo,
    validaOtp: require('./otp').validaOtp,
};