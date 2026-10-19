const { Operacao } = require("../models");

const analisaLucro = async (usuario) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    const operacoes = await Operacao.find({
        usuario_id: usuario._id,
        data: { $lt: hoje },
    })
        .sort({ data: 1 })
        .populate("cotacao_id");

    const compras = [];
    let lucroOntem = 0;

    for (const operacao of operacoes) {
        const moeda = operacao.cotacao_id.moeda;

        if (operacao.tipo === "compra") {
            compras.push({
                moeda,
                quantidade: operacao.quantidade,
                custoUnitario:
                    (operacao.valorBRL + operacao.taxa) /
                    operacao.quantidade,
            });

            continue;
        }

        if (operacao.tipo === "venda") {
            let quantidadeRestante = operacao.quantidade;
            let custoTotal = 0;

            for (const compra of compras) {
                if (
                    compra.moeda !== moeda ||
                    compra.quantidade <= 0 ||
                    quantidadeRestante <= 0
                ) {
                    continue;
                }

                const quantidadeConsumida = Math.min(
                    compra.quantidade,
                    quantidadeRestante
                );

                custoTotal +=
                    quantidadeConsumida * compra.custoUnitario;

                compra.quantidade -= quantidadeConsumida;
                quantidadeRestante -= quantidadeConsumida;
            }

            if (quantidadeRestante > 0) {
                throw new Error(
                    `Histórico insuficiente para calcular a venda ${operacao._id}`
                );
            }

            if (operacao.data >= ontem) {
                lucroOntem +=
                    operacao.valorBRL - operacao.taxa - custoTotal;
            }
        }
    }

    return lucroOntem > 1000;
};

module.exports = analisaLucro;