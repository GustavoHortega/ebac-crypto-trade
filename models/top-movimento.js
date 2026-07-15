const { Schema } = require('mongoose');

const MovimentoSchema = new Schema({

    moeda: {
        type: String,
        required: true
    },
    variacao: {
        type: Number,
        required: true
    },
    valorAnterior: {
        type: Number,
        required: true
    },
    valorAtual: {
        type: Number,
        required: true
    }

});

const TopMovimentoSchema = new Schema({

    dia: {
        type: String,
        required: true,
        unique: true,
    },
    gainers: [MovimentoSchema],
    losers: [MovimentoSchema],

});

module.exports = TopMovimentoSchema;