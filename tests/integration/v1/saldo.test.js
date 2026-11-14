const request = require('supertest');
const faker = require('faker-br');

const app = require('../../../app');
const { geraJwt, checaAutenticacao } = require('./shared/autenticacao');
const { Usuario } = require('../../../models');

describe('/v1/saldo', () => {
    describe('Se o usuário existe', () => {
        let usuario, jwt;

        beforeEach(async () => {
            usuario = await Usuario.create({
                senha: 'qualquer-uma',
                email: 'usuario@gmail.com',
                confirmado: true,
                nome: 'Um user de teste',
                cpf: faker.br.cpf(),
                moedas: [
                    { quantidade: 2600, codigo: 'BRL' },
                    { quantidade: 122, codigo: 'ADA' }
                ],
            });

            jwt = geraJwt(usuario._id);
        });

        describe('GET /', () => {
            checaAutenticacao('/v1/saldo', 'get');

            test('Deve retornar o saldo disponível do usuário', () => {
                return request(app)
                    .get('/v1/saldo')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(200)
                    .then(resposta => {
                        expect(resposta.body.sucesso).toBe(true);
                        expect(resposta.body.saldo).toBe(2600);
                    });
            });

            test('Deve retornar saldo zero quando o usuário não possui BRL', async () => {
                usuario.moedas = [
                    { quantidade: 122, codigo: 'ADA' }
                ];

                await usuario.save();

                return request(app)
                    .get('/v1/saldo')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(200)
                    .then(resposta => {
                        expect(resposta.body.sucesso).toBe(true);
                        expect(resposta.body.saldo).toBe(0);
                    });
            });
        });
    });
});