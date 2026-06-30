const { Schema } = require('mongoose');
const { cpf } = require('cpf-cnpj-validator');

const SaqueSchema = new Schema({ //Subdocumento de Saque aninhado no documento de Usuário
    valor: {
        type: Number,
        required: true,
        min: 1,
    },
    data: {
        type: Date,
        required: true,
    },
})

const DepositoSchema = new Schema({ //Subdocumento de Depósito aninhado no documento de Usuário
    valor: {
        type: Number,
        required: true,
        min: 100
    },
    data: {
        type: Date,
        required: true,
    }

});

const UsuarioSchema = new Schema({//Documento de Usuário
    nome: {
        type: String,
        required: true,
        min: 4,
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v){
                return cpf.isValid(v);
            },
            message: props => `${props.value} não é um CPF válido`
        },
    },
    email: {
        type: String,
        required: true,
        min: 4,
        unique: true,
        validade: {
            validator: function(v) {
                return v.match('@')
            },
            message: props => `${props.value} não é um e-mail válido`,

        },
    },
    senha: {
        type: String,
        required: true,
        select: false, //Garante que em alguma listagem o campo senha não seja mostrado.
    },
    depositos: [DepositoSchema],
    saques: [SaqueSchema],

});

module.exports = UsuarioSchema