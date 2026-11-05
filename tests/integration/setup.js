const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.test') //Caminho para variáveis de ambiente de teste

});

const { connect } = require('../../models');
const { setupFilesAfterEnv } = require('../../jest.integracao.config');

beforeAll(async () => {
    await connect();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();

});

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const modelo in collections) {
        const collection = collections[modelo];
        await collection.deleteMany();
    }
});