const request = require('supertest');

const app = require('../../../app');
const {
    checaAutenticacao,
    geraJwt
} = require('./shared/autenticacao');
const { Usuario, Relatorio } = require('../../../models');
const faker = require('faker-br');

describe('/v1/relatorios/pnl', () => {
    checaAutenticacao('/v1/relatorios/pnl', 'get');

    describe('Se o usuario existe', () => {
        let usuario, jwt;

        beforeEach(async () => {
            usuario = await Usuario.create({
                senha: 'qualqier-uma',
                email: 'usuario@gmail.com',
                confirmado: true,
                nome: 'Um user de teste',
                cpf: faker.br.cpf(),
            });

            jwt = geraJwt(usuario._id);
        });

        describe('Se o usuario não tem relatórios', () => {
            test('Deve retornar um 200', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(200)
            });

            test('Deve retornar um pnl zerado', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .then(resposta => {
                        expect(resposta.body.pnl).toBe(0);
                        expect(resposta.body.sucesso).toBe(true);
                    });
            });
        });

        describe('Se o usuário tem um dia de relatórios', () => {
            beforeEach(async () => {
                const dataRelatorio = new Date();

                await Relatorio.create({
                    saldo: 4200,
                    usuarioId: usuario._id,
                    data: dataRelatorio
                })
            });

            test('Deve retornar um 200', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(200)
            });

            test('Deve retornar um pnl com o valor do dia', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .then(resposta => {
                        expect(resposta.body.pnl).toBe(4200);
                        expect(resposta.body.sucesso).toBe(true);
                    });
            });
        });

        describe('Se o usuário tem mais de um dia de relatórios', () => {
            beforeEach(async () => {
                const dataRelatorio = new Date();

                await Relatorio.create({
                    saldo: 4200,
                    usuarioId: usuario._id,
                    data: dataRelatorio
                });

                dataRelatorio.setDate(dataRelatorio.getDate() - 1);

                await Relatorio.create({
                    saldo: 4000,
                    usuarioId: usuario._id,
                    data: dataRelatorio
                });
            });

            test('Deve retornar um 200', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(200)
            });

            test('Deve retornar um pnl com o valor do dia', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .then(resposta => {
                        expect(resposta.body.pnl).toBe(200);
                        expect(resposta.body.sucesso).toBe(true);
                    });
            });
        });
        
    });
});