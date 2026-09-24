const { Schema } = require('mongoose');

const  ClienteSchema = new Schema({
    usuario: {
        type: Object,
        required: true
    },
    variacao: {
        type: Number,
        required: true
    }
});

const TopClienteSchema = new Schema({
    dia: {
        type: String,
        required: true,
        unique: true
    },
    gainers:[ClienteSchema],
    loosers:[ClienteSchema]

});

module.exports = TopClienteSchema

