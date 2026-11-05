const criaUsuario = require('../../../services/cria-usuario');
const { Usuario } = require('../../../models');
const { enviaEmailDeConfirmacao } = require('../../../services/envia-email');
const e = require('express');

jest.mock('../../../services/envia-email', () => {
    return {
        enviaEmailDeConfirmacao: jest.fn()
    };
})

const usuarioMock = {
    email: 'teste@teste.com.br',
    senha: '123456',
    cpf: '829.419.050-06',
    nome: 'Usuário Teste',
}

//describe cria um contexto para agrupar testes relacionados a uma funcionalidade específica

describe('Se uma senha não é informada', () => {
    test('Deve retornar o erro de ausência de senha', async () => {
        const usuarioTeste = { ...usuarioMock, senha: undefined }; // Cria uma cópia do objeto usuarioMock e define a senha como undefined

        return expect(() => criaUsuario(usuarioTeste, 'https://api.exemplo.com')).rejects.toThrow('O campo senha é obrigatório');
    });
});

describe('Se a senha informada é fraca', () => {
    test('Deve retornar o erro de senha fraca', async () => {
        const usuarioTeste = { ...usuarioMock, senha: '123' };

        return expect(() => criaUsuario(usuarioTeste, 'https://api.exemplo.com')).rejects.toThrow('O campo senha deve ter no mínimo 5 caracteres');
    });
});

describe('Se a URL de redirecionamento não for informada', () => {
    test('Deve retornar o erro de ausência de URL de redirecionamento', async () => {

        return expect(() => criaUsuario(usuarioMock, null)).rejects.toThrow('A URL de redirecionamento é obrigatória');
    });
});

describe('Quando as informações são válidas', () => {
    let resposta;

    beforeEach(async () => {
        resposta = await criaUsuario(usuarioMock, 'https://api.exemplo.com');
    });

    test('Deve retornar o usuário criado sem a senha', () => {
        expect(resposta.email).toBe(usuarioMock.email);
        expect(resposta.cpf).toBe(usuarioMock.cpf);
        expect(resposta.nome).toBe(usuarioMock.nome);
        expect(resposta).not.toHaveProperty('senha');
    });

    test('Deve criar um usuário não confirmado', () => {
        expect(resposta.confirmado).toBe(false);
    });

    test('Deve inserir apenas um usuário no banco de dados', async () => {
        expect((await Usuario.find()).length).toBe(1);
    });

    test('Deve chamar corretamente a função enviaEmailDeConfirmacao', () => {
        expect(enviaEmailDeConfirmacao.mock.calls.length).toBe(1); // Verifica se a função foi chamada uma vez
        expect(enviaEmailDeConfirmacao.mock.calls[0][1]).toBe('https://api.exemplo.com'); // Verifica se o segundo argumento da primeira chamada é a URL de redirecionamento 
        expect(enviaEmailDeConfirmacao.mock.calls[0][0].email).toBe(usuarioMock.email); // Verifica se o primeiro argumento da primeira chamada é o usuário criado
    });
});