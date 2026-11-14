const request = require('supertest');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose')
const { OTP } = require('otplib');

const app = require('../../../../app');
const { Usuario } = require('../../../../models');

const otp = new OTP({strategy: 'totp'});

const geraJwt = (usuarioId) => {
    return jsonwebtoken.sign({ id: usuarioId }, process.env.JWT_SECRET_KEY, )
};

const geraOtp = (segredoOtp) => {
    return otp.generate({secret: segredoOtp});
};

const geraSegredoOtp = () => {
    return otp.generateSecret();
}

const fazRequisicao = (rota, verbo) => {
    return request(app)[verbo](rota);
};

const checaAutenticacao = (rota, verbo) => {
    describe('Se o usuario não estiver autenticado', () => {
        test('Deve retornar 401', () => {
            return fazRequisicao(rota, verbo)
                .expect(401);
        });

        test('Deve retornar mensagem de erro de autenticação', () => {
            return fazRequisicao(rota, verbo)
                .then(resposta => {
                    expect(resposta.text).toBe('Unauthorized');
                });
        });
    });

    describe('Se o usuario estiver logado e não existe', () => {
        const jwt = geraJwt(new mongoose.Types.ObjectId());

        test('Deve retornar 401', () => {
            return fazRequisicao(rota, verbo)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(401);
        });

        test('Deve retornar mensagem de erro de autenticação', () => {
            return fazRequisicao(rota, verbo)
            .set('Authorization', `Bearer ${jwt}`)
            .then(resposta => {
                expect(resposta.text).toBe('Unauthorized');
            })
        });
    });
};

const checaOtp = (rota, verbo, contexto) => {

    describe('Se o token totp está ausente no header ou incorreto', () => {
        
        test('Deve retornar 401', () => {
            return fazRequisicao(rota, verbo)
                .set('Authorization', `Bearer ${contexto.jwt}`)
                .expect(401)
        });

        test('Deve retorna uma mensagem de solicitando um token válido', () => {
            return fazRequisicao(rota, verbo)
                .set('Authorization', `Bearer ${contexto.jwt}`)
                .then(resposta => {
                    expect(resposta.body.sucesso).toBe(false)
                    expect(resposta.body.erro).toBe('Informe um código totp válido de 6 dígitos.')
                })
        });
    });

    describe('Se o usuário não possui um segredo otp', () => {
        beforeEach(async () => {
            await Usuario.updateOne({_id: contexto.usuario._id}, {$set: {segredoOtp: null}})
        });

        test('Deve retonar 401 e uma mensagem de erro', () => {
            return fazRequisicao(rota, verbo)
                .set('Authorization', `Bearer ${contexto.jwt}`)
                .set('totp', 123456)
                .expect(401)
                .then(resposta => {
                    expect(resposta.body.sucesso).toBe(false)
                    expect(resposta.body.erro).toBe('OTP não configurado.')
                })
        });
    });

    describe('Se o usuário possui um segredo otp', () => {
        
        describe('Se o usuário informar um otp inválido', () => {
            
            test('Deve retonar mensagem de OTP inválido e status 401', () => {
                return fazRequisicao(rota, verbo)
                    .set('Authorization', `Bearer ${contexto.jwt}`)
                    .set('totp', 123456)
                    .expect(401)
                    .then(resposta => {
                        expect(resposta.body.sucesso).toBe(false)
                        expect(resposta.body.erro).toBe('OTP inválido.')

                    });
            });
        });
    });

}

module.exports = {
    geraJwt,
    checaAutenticacao,
    geraOtp,
    geraSegredoOtp,
    checaOtp
};