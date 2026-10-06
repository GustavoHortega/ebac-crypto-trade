![Logo Crypto Trade](images/logo.png)

# EBAC Crypto Trade

API REST desenvolvida em **Node.js** durante o curso de Node.js da **EBAC**, simulando o funcionamento de uma corretora de criptomoedas.

O projeto implementa autenticação, gerenciamento de saldo, depósitos, saques, compra e venda de criptomoedas, consulta de cotações e processamento assíncrono com filas e workers.

## Destaques

* API REST com **Node.js + Express**
* Autenticação com **JWT + Passport**
* Senhas protegidas com **Bcrypt**
* Persistência com **MongoDB + Mongoose**
* Integração com **CoinMarketCap API**
* Processamento assíncrono com **Bull + Redis**
* Workers para atualização de cotações, relatórios e rankings
* Documentação da API com **Swagger / OpenAPI**
* Logs estruturados com **Winston**
* Arquitetura organizada em **Routes, Services, Models e Workers**

## Funcionalidades

### Usuários e autenticação

* Cadastro de usuários
* Login com JWT
* Consulta do perfil autenticado
* Gerenciamento de saldo

### Operações financeiras

* Depósitos em BRL
* Saques em BRL
* Saques de criptomoedas
* Compra e venda de criptomoedas
* Aplicação de taxa de corretagem
* Validação de saldo e disponibilidade

### Criptomoedas

* Consulta de cotações
* Integração com CoinMarketCap
* Atualização periódica das cotações
* Ranking de movimentação das criptomoedas
* Relatórios e cálculo de PNL

## Arquitetura

O projeto utiliza uma arquitetura modular, separando responsabilidades entre as principais camadas:

```text
src/
├── models/       # Modelos e persistência
├── routes/       # Endpoints HTTP
├── services/     # Regras de negócio
├── utils/        # Utilitários e logs
└── workers/      # Processamento assíncrono
```

Fluxo principal:

```text
Cliente
   ↓
Routes
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

Processamentos assíncronos:

```text
Scheduler
   ↓
Bull / Redis
   ↓
Workers
   ↓
Services / Models
```

## Stack

| Categoria       | Tecnologias              |
| --------------- | ------------------------ |
| Runtime         | Node.js                  |
| API             | Express                  |
| Banco de dados  | MongoDB, Mongoose        |
| Autenticação    | JWT, Passport            |
| Segurança       | Bcrypt                   |
| Filas           | Bull, Redis              |
| Integrações     | Axios, CoinMarketCap API |
| Documentação    | Swagger, OpenAPI         |
| Logs            | Winston                  |
| Desenvolvimento | Nodemon, dotenv          |

## API

A API utiliza versionamento através do prefixo `/v1`.

Principais endpoints:

| Método | Endpoint               | Descrição            |
| ------ | ---------------------- | -------------------- |
| `POST` | `/v1/usuarios`         | Cadastro             |
| `POST` | `/v1/auth`             | Autenticação         |
| `GET`  | `/v1/usuarios/me`      | Perfil e saldo       |
| `GET`  | `/v1/cotacoes`         | Cotações             |
| `POST` | `/v1/depositos`        | Depósito             |
| `POST` | `/v1/saques`           | Saque em BRL         |
| `POST` | `/v1/saques/:codigo`   | Saque de criptomoeda |
| `POST` | `/v1/trocas`           | Compra/venda         |
| `GET`  | `/v1/relatorios/pnl`   | Consulta de PNL      |
| `GET`  | `/v1/topclientes/:dia` | Ranking de clientes  |

A documentação interativa está disponível em:

```text
/v1/docs
```

## Processamento assíncrono

O projeto utiliza **Bull + Redis** para executar tarefas em background, incluindo:

* atualização das cotações;
* atualização de saldo;
* geração de rankings;
* geração de relatórios.

Esse processamento permite separar tarefas periódicas e mais pesadas do fluxo das requisições HTTP.

## Regras de negócio

Algumas regras implementadas:

* **0,5%** de taxa nas operações de troca;
* **R$ 150.000** como reserva mínima da corretora;
* depósitos a partir de **R$ 100**;
* cotações utilizadas nas operações devem possuir no máximo **15 minutos**;
* validação de saldo antes das operações financeiras.

## Executando o projeto

### Requisitos

* Node.js
* MongoDB
* Redis
* Chave da API da CoinMarketCap

### Instalação

```bash
git clone https://github.com/GustavoHortega/ebac-crypto-trade.git

cd ebac-crypto-trade

npm install
```

Configure as variáveis de ambiente com base no `.env.example`.

Depois, execute o seed:

```bash
npm run seed
```

Para desenvolvimento:

```bash
npm run dev
```

Para iniciar a aplicação:

```bash
npm start
```

## O que este projeto demonstra

Este projeto foi desenvolvido para praticar conceitos de backend além da criação básica de endpoints, incluindo:

* arquitetura em camadas;
* autenticação e autorização;
* modelagem de dados;
* regras de negócio;
* integração com serviços externos;
* processamento assíncrono;
* filas e workers;
* documentação de APIs;
* logs e tratamento de erros.

## Status

Projeto educacional desenvolvido durante o curso de **Node.js da EBAC**.

Não representa uma corretora real ou um sistema financeiro destinado à produção.

## Créditos

Desenvolvido durante o curso de Node.js da **EBAC**, com orientação do professor **Rafael Costella**.

---

**Tecnologias:** Node.js · Express · MongoDB · Mongoose · JWT · Passport · Bull · Redis · Axios · Swagger · Winston
