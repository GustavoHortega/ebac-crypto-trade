const mongoose = require('mongoose');

const UsuarioSchema = require('./usuario');
const CotacaoSchema = require('./cotacao');
const CorretoraSchema = require('./corretora');
const TopMovimentoSchema = require('./top-movimento');

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Cotacao = mongoose.model('Cotacao', CotacaoSchema);
const Corretora = mongoose.model('Corretora', CorretoraSchema);
const TopMovimento = mongoose.model('TopMovimento', TopMovimentoSchema);


const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
  connect,
  Usuario,
  Cotacao,
  Corretora,
  TopMovimento,
}