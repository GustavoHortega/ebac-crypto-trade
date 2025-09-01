const mongoose = require('mongoose');

const UsuarioSchema = require('./usuario');

const Usuario = mongoose.model('Usuario', UsuarioSchema);

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL); //coneta ao banoco de dados
}

module.exports = {
  connect,
  Usuario,
}
