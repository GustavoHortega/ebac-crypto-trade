const mongoose = require('mongoose');

const UsuarioSchema = require('./usuario');
const CotacaoSchema = require('./cotacao');
const CorretoraSchema = require('./corretora');
const RelatorioSchema = require('./relatorio');
const TopMovimentoSchema = require('./top-movimento');
const TopClienteSchema = require('./top-cliente');

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Cotacao = mongoose.model('Cotacao', CotacaoSchema);
const Corretora = mongoose.model('Corretora', CorretoraSchema);
const Relatorio = mongoose.model('Relatorio', RelatorioSchema);
const TopMovimento = mongoose.model('TopMovimento', TopMovimentoSchema);
const TopCliente = mongoose.model('TopCliente', TopClienteSchema);


const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
  connect,
  Usuario,
  Cotacao,
  Corretora,
  Relatorio,
  TopMovimento,
  TopCliente
}