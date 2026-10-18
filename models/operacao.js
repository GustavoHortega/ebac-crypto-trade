const { Schema } = require('mongoose');

const OperacaoSchema = new Schema({
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tipo: {
        type: String,
        enum: ['compra', 'venda'],
        required: true
    },
    cotacao_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cotacao',
        required: true
    },
    quantidade: {
        type: Number,
        required: true,
        min: 0
    },
    valorBRL: {
        type: Number,
        required: true,
        min: 0
    },
    taxa: {
        type: Number,
        required: true,
        min: 0
    },
    data: {
        type: Date,
        default: Date.now
    }
});

module.exports = OperacaoSchema;