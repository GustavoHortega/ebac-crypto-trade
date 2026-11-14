const request = require('supertest');
const faker = require('faker-br');

const app = require('../../../app');
const {
    checaAutenticacao,
    geraJwt,
    geraOtp,
    geraSegredoOtp,
    checaOtp
} = require('./shared/autenticacao');
const { Usuario } = require('../../../models');

describe('/v1/saques', () => {

    describe('Se o usuário existe', () => {
        let usuario, jwt, totp;

        const contexto = {
            usuario: null,
            jwt: null
        };

        beforeEach(async () => {
            usuario = await Usuario.create({
                senha: 'qualqier-uma',
                email: 'usuario@gmail.com',
                confirmado: true,
                nome: 'Um user de teste',
                cpf: faker.br.cpf(),
                segredoOtp: geraSegredoOtp(),
                saques: [
                    {
                        valor: 1200,
                        data: new Date()
                    },
                    {
                        valor: 200,
                        data: new Date()
                    }
                ],
                depositos: [
                    {
                        valor: 4000,
                        data: new Date()
                    }
                ],
                moedas: [
                    {
                    quantidade: 2600,
                    codigo: 'BRL',
                    },
                    {
                    quantidade: 122,
                    codigo: 'ADA',
                    }
                ],

            });

            jwt = geraJwt(usuario._id);
            totp = await geraOtp(usuario.segredoOtp);

            contexto.usuario = usuario;
            contexto.jwt = jwt;
        });

        describe('GET /', () => { //Consultar saques
            checaAutenticacao('/v1/saques', 'get');

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
            checaAutenticacao('/v1/saques', 'post');
            checaOtp('/v1/saques', 'post', contexto);

            describe('Se o saldo do usuário é menor que o valor que ele quer sacar', () => {
                test('Deve retornar uma menságem de erro de saldo insuficiente', () => {
                    return request(app)
                        .post('/v1/saques')
                        .send({
                            valor: 4000
                        })
                        .set('Authorization', `Bearer ${jwt}`)
                        .set('totp', totp)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false)
                            expect(resposta.body.erro).toBe('Você não possui saldo para efetuar esse saque.')  
                        })
                });
            });

            describe('Se o saldo do usuário é maior ou igual ao valor do saque', () => {

                test('Deve realizar o saque e retornar os dados atualizados', () => {
                    return request(app)
                        .post('/v1/saques')
                        .send({
                            valor: 1000
                        })
                        .set('Authorization', `Bearer ${jwt}`)
                        .set('totp', totp)
                        .expect(200)
                        .then(async resposta => {
                            expect(resposta.body.sucesso).toBe(true);
                            expect(resposta.body.saldo).toBe(1600);

                            expect(resposta.body.saques).toHaveLength(3);
                            expect(resposta.body.saques[2].valor).toBe(1000);

                            const usuarioAtualizado = await Usuario.findById(usuario._id);

                            expect(usuarioAtualizado.saques).toHaveLength(3);
                            expect(usuarioAtualizado.saques[2].valor).toBe(1000);
                        });
                });
            });


            describe('Se o valor do saque é inválido', () => {

                test('Não deve permitir saque com valor zero', () => {
                    return request(app)
                        .post('/v1/saques')
                        .send({ valor: 0 })
                        .set('Authorization', `Bearer ${jwt}`)
                        .set('totp', totp)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                        });
                });

                test('Não deve permitir saque com valor negativo', () => {
                    return request(app)
                        .post('/v1/saques')
                        .send({ valor: -100 })
                        .set('Authorization', `Bearer ${jwt}`)
                        .set('totp', totp)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                        });
                });

                test('Não deve permitir saque sem informar o valor', () => {
                    return request(app)
                        .post('/v1/saques')
                        .send({})
                        .set('Authorization', `Bearer ${jwt}`)
                        .set('totp', totp)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                        });
                });

                test('Não deve permitir saque com valor em formato inválido', () => {
                    return request(app)
                        .post('/v1/saques')
                        .send({ valor: 'texto' })
                        .set('Authorization', `Bearer ${jwt}`)
                        .set('totp', totp)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                        });
                });
            });
        });

        describe('POST /:codigo', () => {
            checaAutenticacao('/v1/saques/ADA', 'post');

            describe('Se o saldo da moeda é suficiente', () => {
                test('Deve realizar o saque e retornar as moedas atualizadas', () => {
                    return request(app)
                        .post('/v1/saques/ADA')
                        .send({ valor: 20 })
                        .set('Authorization', `Bearer ${jwt}`)
                        .expect(200)
                        .then(async resposta => {
                            expect(resposta.body.sucesso).toBe(true);

                            const ada = resposta.body.moedas.find(m => m.codigo === 'ADA');
                            const brl = resposta.body.moedas.find(m => m.codigo === 'BRL');

                            expect(ada.quantidade).toBe(102);
                            expect(brl.quantidade).toBe(2600);

                            const usuarioAtualizado = await Usuario.findById(usuario._id);
                            const adaAtualizada = usuarioAtualizado.moedas.find(m => m.codigo === 'ADA');

                            expect(adaAtualizada.quantidade).toBe(102);
                        });
                });
            });

            describe('Se o saldo da moeda é insuficiente', () => {
                test('Deve retornar uma mensagem de erro', () => {
                    return request(app)
                        .post('/v1/saques/ADA')
                        .send({ valor: 200 })
                        .set('Authorization', `Bearer ${jwt}`)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                            expect(resposta.body.erro).toBe(
                                'Você não possui saldo suficiente em ADA para efetuar esse saque.'
                            );
                        });
                });
            });

            describe('Se o usuário não possui a moeda', () => {
                test('Deve retornar uma mensagem de erro', () => {
                    return request(app)
                        .post('/v1/saques/DOGE')
                        .send({ valor: 10 })
                        .set('Authorization', `Bearer ${jwt}`)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                            expect(resposta.body.erro).toBe(
                                'Você não possui saldo suficiente em DOGE para efetuar esse saque.'
                            );
                        });
                });
            });

            describe('Se o valor do saque é inválido', () => {
                test('Não deve permitir saque com valor zero', () => {
                    return request(app)
                        .post('/v1/saques/ADA')
                        .send({ valor: 0 })
                        .set('Authorization', `Bearer ${jwt}`)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                        });
                });

                test('Não deve permitir saque com valor negativo', () => {
                    return request(app)
                        .post('/v1/saques/ADA')
                        .send({ valor: -10 })
                        .set('Authorization', `Bearer ${jwt}`)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                        });
                });

                test('Não deve permitir saque sem informar o valor', () => {
                    return request(app)
                        .post('/v1/saques/ADA')
                        .send({})
                        .set('Authorization', `Bearer ${jwt}`)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                        });
                });

                test('Não deve permitir saque com valor em formato inválido', () => {
                    return request(app)
                        .post('/v1/saques/ADA')
                        .send({ valor: 'texto' })
                        .set('Authorization', `Bearer ${jwt}`)
                        .expect(422)
                        .then(resposta => {
                            expect(resposta.body.sucesso).toBe(false);
                        });
                });
            });
        });

    });
});