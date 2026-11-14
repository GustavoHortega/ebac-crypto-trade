jest.mock('../../../models', () => ({
    TopCliente: {
        aggregate: jest.fn()
    }
}));

const { TopCliente } = require('../../../models');
const { buscaTopClientes } = require('../../../services');

describe('buscaTopClientes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Quando existem registros para o dia informado', () => {
        test('Deve retornar o ranking de ganhadores e perdedores', async () => {
            const resultadoEsperado = [
                {
                    gainers: [
                        { nome: 'Gustavo', variacao: 15 },
                        { nome: 'Maria', variacao: 10 }
                    ],
                    loosers: [
                        { nome: 'João', variacao: -20 },
                        { nome: 'Pedro', variacao: -5 }
                    ]
                }
            ];

            TopCliente.aggregate.mockResolvedValue(resultadoEsperado);

            const resultado = await buscaTopClientes('2026-11-13');

            expect(TopCliente.aggregate).toHaveBeenCalledTimes(1);
            expect(resultado).toEqual(resultadoEsperado);
        });
    });

    describe('Quando não existem registros para o dia informado', () => {
        test('Deve retornar uma lista vazia', async () => {
            TopCliente.aggregate.mockResolvedValue([]);

            const resultado = await buscaTopClientes('2026-11-12');

            expect(resultado).toEqual([]);
            expect(TopCliente.aggregate).toHaveBeenCalledTimes(1);
        });
    });

    describe('Quando ocorre um erro na consulta', () => {
        test('Deve propagar o erro', async () => {
            const erro = new Error('Erro ao consultar o ranking');

            TopCliente.aggregate.mockRejectedValue(erro);

            await expect(
                buscaTopClientes('2026-11-13')
            ).rejects.toThrow('Erro ao consultar o ranking');
        });
    });
});