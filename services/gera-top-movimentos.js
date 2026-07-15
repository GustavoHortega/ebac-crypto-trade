const { Cotacao, TopMovimento } = require('../models');

const geraTopMovimentos = async () => {

    const hoje = new Date();
    const inicioHoje = new Date(hoje);

    inicioHoje.setHours(0, 0, 0, 0);

    const inicioOntem = new Date(inicioHoje);

    inicioOntem.setDate(inicioOntem.getDate() - 1);

    const fimOntem = new Date(inicioHoje);

    fimOntem.setMilliseconds(-1);

    const moedas = await Cotacao.distinct('moeda');

    const variacoes = [];

    for (const moeda of moedas) {

        const cotacaoOntem = await Cotacao.findOne({moeda, data: { $gte: inicioOntem, $lte: fimOntem }}).sort({ data: -1 }).lean();
        const cotacaoHoje = await Cotacao.findOne({moeda, data: { $gte: inicioHoje }}).sort({ data: -1 }).lean();

        if (!cotacaoOntem || !cotacaoHoje) continue;

        const variacao = ((cotacaoHoje.valor - cotacaoOntem.valor) / cotacaoOntem.valor) * 100;

        variacoes.push({ moeda, variacao: Number(variacao.toFixed(2)), valorAnterior: cotacaoOntem.valor, valorAtual: cotacaoHoje.valor, });

    }

    const gainers = [...variacoes].sort((a, b) => b.variacao - a.variacao).slice(0, 3);
    const losers = [...variacoes].sort((a, b) => a.variacao - b.variacao).slice(0, 3);

    const dia = inicioHoje.toISOString().split('T')[0];

    await TopMovimento.findOneAndUpdate({ dia }, { dia, gainers, losers }, { upsert: true, new: true });

    return { dia, gainers, losers };

};

module.exports = geraTopMovimentos;