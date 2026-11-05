const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo = undefined;

beforeAll(async () => { //beforeAll é executado antes de todos os testes
    mongo = await MongoMemoryServer.create(); //cria uma instância do MongoMemoryServer
    const uri = mongo.getUri(); //pega a URI do banco de dados em memória
    
    await mongoose.connect(uri);
});

afterAll(async () => { //afterAll é executado depois de todos os testes
    if (mongo) {
        await mongoose.connection.dropDatabase(); //deleta o banco de dados em memória
        await mongoose.connection.close();
        await mongo.stop(); //para a instância do MongoMemoryServer
    }
});

afterEach(async () => { //afterEach é executado depois de cada teste
    //Limpa o banco de dados em memória após cada teste, para que os testes não interfiram uns nos outros
    if (mongo) {
        const collections = mongoose.connection.collections; //pega todas as coleções do banco de dados em memória

        for (const modelo in collections) {
            const collection = collections[modelo];
            await collection.deleteMany({}); //deleta todos os documentos da coleção
        }
    }
});
