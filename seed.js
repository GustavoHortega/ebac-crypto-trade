require('dotenv').config();

const { mongoose } = require('mongoose');

const { CNPJ, RESERVA_MINIMA } = require('./constants');
const { Corretora, connect } = require('./models');

(async () => {
    await connect();

    await Corretora.findOneAndUpdate({
        cnpj: CNPJ
    }, {
        caixa: RESERVA_MINIMA
    }, {
        upsert: true // Insere o documento se não existir
    });

    await mongoose.disconnect();
})();