const request = require('supertest');
const jsonwebtoken = require('jsonwebtoken');
const faker = require('faker-br');
const mongoose = require('mongoose')

const app = require('../../../../app');

const geraJwt = (usuarioId) => {
    return jsonwebtoken.sign({ id: usuarioId }, process.env.JWT_SECRET_KEY, )
};

const checaAutenticacao = (rota) => {
    describe('Se o usuario não estiver autenticado', () => {
        test('Deve retornar 401', () => {
            return request(app)
                .get(rota)
                .expect(401);
        });

        test('Deve retornar mensagem de erro de autenticação', () => {
            return request(app)
                .get(rota)
                .then(resposta => {
                    expect(resposta.text).toBe('Unauthorized');
                });
        });
    });

    describe('Se o usuario estiver logado e não existe', () => {
        const jwt = geraJwt(new mongoose.Types.ObjectId());

        test('Deve retornar 401', () => {
            return request(app)
            .get(rota)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(401);
        });

        test('Deve retornar mensagem de erro de autenticação', () => {
            return request(app)
            .get(rota)
            .set('Authorization', `Bearer ${jwt}`)
            .then(resposta => {
                expect(resposta.text).toBe('Unauthorized');
            })
        });
    });
};

module.exports = {
    geraJwt,
    checaAutenticacao
};