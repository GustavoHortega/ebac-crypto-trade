const { Schema } = require('mongoose');
const { cpf } = require('cpf-cnpj-validator'); //biblioteca de validação de cpf.

const SaqueSchema = new Schema ({ //schema para saques
    valor: {
        type: Number,
        required: true,
        min: 1
    },
    data: {
        type: Date,
        required: true

    }
});

const DepositoSchema = new Schema({ //schema para depositos
    valor: {
        type: Number,
        required: true,
        min: 100

    },
    data: {
        type: Date,
        required: true
    }
});

const UsuarioSchema = new Schema({ //schema do usuário
    nome: {
        type: String,
        required: true,
        min: 4
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        validate: { //validação do cpf
            validator: function(v) {
                return cpf.isValid(v);
            },
        message: props => `${props.value} nao é um CPF valido`, //Essa mensagem é mostrada caso o validação falhe.
        
        },
    },
    email: {
        type: String,
        required: true,
        min: 4,
        unique: true,
        validate: {
            validator: function(v) {
                return v.match('@');
            },
        message: props => `${props.value} nao é um email válido`,
        
        },
    },
    senha: {
        type: String,
        required: true,
        select: false, // nao mostra a senha quano busca um usuario
    },
    depositos: [DepositoSchema],
    saques: [SaqueSchema],
});

module.exports = UsuarioSchema;