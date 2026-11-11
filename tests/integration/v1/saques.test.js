const request = require('supertest');
const faker = require('faker-br');

const app = require('../../../app');
const {
    checaAutenticacao,
    geraJwt
} = require('./shared/autenticacao');
const { Usuario } = require('../../../models');

describe('/v1/saques', () => {
    checaAutenticacao('/v1/saques');

    describe('Se o usuário existe', () => {
        let usuario, jwt

        beforeEach(async () => {
            usuario = await Usuario.create({
                senha: 'qualqier-uma',
                email: 'usuario@gmail.com',
                confirmado: true,
                nome: 'Um user de teste',
                cpf: faker.br.cpf(),
                saques: [
                    {
                        valor: 1200,
                        data: new Date()
                    },
                    {
                        valor: 200,
                        data: new Date()
                    }
                ]
            });

            jwt = geraJwt(usuario._id);
        });

        describe('GET /', () => { //Consultar saques
            describe('Se o usuario possui saques', () => {
                test('Deve retornar a lista de saques do usuário', () => {
                    return request(app)
                        .get('/v1/saques')
                        .set('Authorization', `Bearer ${jwt}`)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(true);
                            expect(resposta.body.saques.length).toBe(usuario.saques.length);
                            expect(resposta.body.saques[0].valor).toBe(1200)
                            expect(resposta.body.saques[1].valor).toBe(200)
                        });
                });
            });
    
            describe('Se o usuario não possui saques', () => {
                beforeEach(async () => {
                     usuario.saques = [];
                    await usuario.save();
                })
    
    
                test('Deve retornar a lista de saques vazia', () => {
                    return request(app)
                        .get('/v1/saques')
                        .set('Authorization', `Bearer ${jwt}`)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(true);
                            expect(resposta.body.saques.length).toBe(0);
                        });
                });
            });
        });

        describe('POST /', () => { //Sacar reais
            
        });
    });
});