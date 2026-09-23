const { Cotacao, Corretora, Usuario } = require("../models");
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

    // Checa se a corretora tem saldo suficiente para realizar a operação
    const reaisNecessarios = (cotacaoValida.valor * quantidade);
    const corretora = await Corretora.findOne({ cnpj: CNPJ });
    if (corretora.caixa < reaisNecessarios) {
        throw new Error('Valor muito alto para a corretora! Não há caixa suficiente para realizar a operação.');
    }

    // Checa se o usuário tem saldo suficiente para realizar a operação
    const moedaEmReais = usuario.moedas.find(m => m.codigo === 'BRL');
    const moedaEmCrypto = usuario.moedas.find(m => m.codigo === cotacaoValida.moeda);
    const taxaCorretora = TAXA_DE_TROCA * quantidade;

    if(operacao === 'compra') {
        if (!moedaEmReais || moedaEmReais.quantidade < reaisNecessarios) {
            throw new Error('Saldo insuficiente para realizar a operação de compra!');
        }

        if (moedaEmCrypto) {
            moedaEmCrypto.quantidade += (quantidade - taxaCorretora);
        } else {
            usuario.moedas.push({
                codigo: cotacaoValida.moeda,
                quantidade: (quantidade - taxaCorretora)
            })
        }

        moedaEmReais.quantidade -= (reaisNecessarios + taxaCorretora * cotacaoValida.valor); 

    } else {
        if(!moedaEmCrypto || moedaEmCrypto.quantidade < quantidade) {
            throw new Error('Saldo insuficiente para realizar a operação de venda!');
        }

        moedaEmReais.quantidade += (reaisNecessarios - taxaCorretora * cotacaoValida.valor); // Atualiza o saldo em reais do usuário
        moedaEmCrypto.quantidade -= quantidade; // Atualiza o saldo da moeda do usuário
    }

    await usuario.save();
    corretora.caixa += taxaCorretora * cotacaoValida.valor;
    await corretora.save();

    return usuario.moedas;

};

module.exports = trocaMoedas;
