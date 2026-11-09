const nock = require('nock').default;
const { buscaCotacoesOnline } = require('../../../services/busca-cotacoes');

describe('buscaCotacoesOnline', () => {
    describe('Quando a rota de cotações não retornar nenhuma cotação', () => {
        beforeEach(() => {
            nock(process.env.COINMARKET_API_URL)
                .get('/v2/cryptocurrency/quotes/latest?symbol=BTC,ETH,BNB,XRP,ADA,SOL&convert=BRL')
                .reply(200, {
                    data: {}
                });
        });

        test('Deve retornar uma lista vazia', async () => {
            const resposta = await buscaCotacoesOnline();
            expect(resposta.length).toBe(0);
        });
    });
});

describe('Quando a rota de cotações retornar cotações válidas', () => {
    let resposta;
    
    beforeEach(async () => {
            nock(process.env.COINMARKET_API_URL)
                .get('/v2/cryptocurrency/quotes/latest?symbol=BTC,ETH,BNB,XRP,ADA,SOL&convert=BRL')
                .reply(200, {
                    data: {
                        BTC: [{
                            symbol: 'BTC',
                            quote: {
                                BRL: {
                                    price: 100000
                                }
                            }
                        }],
                        ETH: [{
                            symbol: 'ETH',
                            quote: {
                                BRL: {
                                    price: 100000
                                }
                            }
                        }],
                        BNB: [{
                            symbol: 'BNB',
                            quote: {
                                BRL: {
                                    price: 100000
                                }
                            }
                        }]
                    }
            });
        
        resposta = await buscaCotacoesOnline();
    });
    
    test('Deve retornar uma lista com as cotações', async () => {
        expect(resposta.length).toBe(3);
    });

    test('Deve converter as cotações corretamente', async () => {
        expect(resposta[0].valor).toBe(100000);
        expect(resposta[0].moeda).toBe('BTC');
        expect(resposta[1].valor).toBe(100000);
        expect(resposta[1].moeda).toBe('ETH');
        expect(resposta[2].valor).toBe(100000);
        expect(resposta[2].moeda).toBe('BNB');
    });

    test('Adiciona hoje como data da cotação', async () => {
        const hoje = new Date().getDate();
        expect(resposta[0].data.getDate()).toBe(hoje);
        expect(resposta[1].data.getDate()).toBe(hoje);
        expect(resposta[2].data.getDate()).toBe(hoje);
    });
});