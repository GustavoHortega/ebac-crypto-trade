const { Cotacao, Corretora, Usuario, Operacao } = require("../models");
const { CNPJ, TAXA_DE_TROCA } = require("../constants");

const buscaCotacao = async (cotacaoId) => {
    const cotacao = await Cotacao.findOne({
        _id: cotacaoId,
        data: {
            $gte: new Date((new Date()).valueOf() - 600000 * 15), // Garante que a cotação seja de no máximo 15 minutos atrás
        }
    });

    if (!cotacao) {
        throw new Error('Cotação inválida ou expirada!');
    }

    return cotacao;
};

const trocaMoedas = async (usuario, cotacaoId, quantidade, operacao) => {
    if (!quantidade || !operacao) {
        throw new Error('Quantidade e operação são obrigatórios!');
    }

    // Checha se a cotação existe
    const cotacaoValida = await buscaCotacao(cotacaoId);

    // Calcula valor necessário em reais e resgata corretora do banco
    const reaisNecessarios = (cotacaoValida.valor * quantidade);
    const corretora = await Corretora.findOne({ cnpj: CNPJ });

    // Checa se o usuário tem saldo suficiente para realizar a operação
    const moedaEmReais = usuario.moedas.find(m => m.codigo === 'BRL');
    const moedaEmCrypto = usuario.moedas.find(m => m.codigo === cotacaoValida.moeda);
    const taxaCorretora = reaisNecessarios * TAXA_DE_TROCA;

    if (operacao === 'compra') {
        if (!moedaEmReais || moedaEmReais.quantidade < reaisNecessarios + taxaCorretora) {
            throw new Error('Saldo insuficiente para realizar a operação de compra!');
        }

        if (moedaEmCrypto) {
            moedaEmCrypto.quantidade += quantidade
        } else {
            usuario.moedas.push({
                codigo: cotacaoValida.moeda,
                quantidade: quantidade
            })
        }

        moedaEmReais.quantidade -= (reaisNecessarios + taxaCorretora);
        corretora.caixa += reaisNecessarios;

    } else {
        if (corretora.caixa < reaisNecessarios) { // Verifica se a corretora tem saldo para pagar o usuário na op de venda
            throw new Error('Valor muito alto para a corretora! Não há caixa suficiente para realizar a operação.');
        }

        if (!moedaEmCrypto || moedaEmCrypto.quantidade < quantidade) {
            throw new Error('Saldo insuficiente para realizar a operação de venda!');
        }

        moedaEmReais.quantidade += (reaisNecessarios - taxaCorretora); // Atualiza o saldo em reais do usuário
        moedaEmCrypto.quantidade -= quantidade; // Atualiza o saldo da moeda do usuário
        corretora.caixa -= reaisNecessarios;
    }

    await Operacao.create({ // Cria registro de operação
        usuario_id: usuario._id,
        tipo: operacao,
        cotacao_id: cotacaoId,
        quantidade: quantidade,
        valorBRL: reaisNecessarios,
        taxa: taxaCorretora
    });

    await usuario.save();
    corretora.caixa += taxaCorretora;
    await corretora.save();

    return usuario.moedas;

};

module.exports = trocaMoedas;
