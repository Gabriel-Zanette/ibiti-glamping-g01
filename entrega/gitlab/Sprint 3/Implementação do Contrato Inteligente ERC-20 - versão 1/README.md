# Implementação do Contrato Inteligente ERC-20 - versão 1

Artefato acadêmico da Sprint 3 · IBITI Glamping · G01.

**“Versão 1” identifica a entrega do artefato. O código entregue é o IBIToken v2, publicado na Sepolia em 11/09/2026.**

## Estrutura

```text
contracts/     IBIToken.sol, stablecoin fictícia de testes e dependências OpenZeppelin
scripts/       publicação e operação no Remix
tests/        testes Solidity e integração automatizada
docs/         execução, regras, resultados e limites
deployments/  recibos, parâmetros e fontes das publicações
offchain/     Passaporte: autenticação, pessoa, carteiras e cotas de hospedagem
tools/        compilador solc, Anvil e empacotamento para validação local
```

Os contratos do produto são IBIToken e a moeda fictícia de teste. Bibliotecas herdadas e contratos de testes não são contratos adicionais a publicar. A arquitetura não utiliza Hardhat.

## Executar no Remix

Siga o [guia de execução](docs/guia-de-execucao.md). Importe esta pasta em **New workspace → Import Project**. Compile `contracts/IBIToken.sol` usando Solidity **0.8.34**, EVM **Osaka**, otimizador **200 runs**. Dependências OpenZeppelin **5.6.1** estão em `contracts/vendor/`.

Os quatro arquivos `tests/*_test.sol` contêm 37 testes para o plugin Solidity Unit Testing. Scripts `01_publicar.js` e `02_operar.js` publicam e operam na Remix VM. O script de operação inicia em consulta de status.

## Publicação comprovada

- Rede: Ethereum Sepolia, chain ID **11155111**.
- IBIToken v2: [`0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`](https://sepolia.etherscan.io/address/0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030).
- Transação: [`0x415a6618a50981407552e4297c48ab0e66c724d03d846cc3f9c165b5a114fb5c`](https://sepolia.etherscan.io/tx/0x415a6618a50981407552e4297c48ab0e66c724d03d846cc3f9c165b5a114fb5c).
- Bloco **11684811**, recibo com sucesso, **150 IBT**, zero decimais; 50 em reserva e limite de 20 por carteira.
- tBRL reutilizada: `0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE`. É moeda fictícia, distinta dos 150 IBT.
- Verificação Sourcify exata de criação e runtime. [Registro v2](deployments/sepolia-remix-v2-2026-09-11.json) e [procedimento](docs/deploy-modelo-pessoa.md).

Não é necessário republicar para consultar o contrato. A v1 permanece histórica; uma publicação nova não migra seus saldos ou histórico.

## Funcionamento

O ERC-20 controla posse, transferências, reserva, recuperação e royalties. Hospedagens são controladas por pessoa no [serviço off-chain](offchain/README.md), com assinatura de carteira, sincronização de blocos finalizados, persistência SQLite e prevenção de reutilização de cotas. Pedir hospedagem não queima nem marca tokens no contrato.

A política concede uma experiência por IBT durante toda a emissão; transferências levam apenas cotas livres. Regras completas em [regras de negócio](docs/regras-de-negocio-para-contrato.md) e [Passaporte](offchain/README.md).

## Reproduzir a validação local

Na pasta deste artefato, com **Node 24 ou superior**:

```bash
npm ci
npm ci --prefix offchain
npm test
npm test --prefix offchain
npm run typecheck
npm run typecheck --prefix offchain
npm run demo --prefix offchain
```

O compilador é `solc` 0.8.34, e a EVM local é Anvil 1.7.1. A demonstração abre em localhost:3000 e usa uma rede local isolada. Para consultar Sepolia, configure `offchain/.env` a partir de `.env.example`, gere os dois segredos da aplicação e siga o README do serviço. Não há chave privada no backend. Bancos, credenciais e dependências instaladas não fazem parte desta entrega.

## Evidências e limites

[Relatório de testes](docs/relatorio-de-testes.md) · [Premissas e pendências](docs/premissas-e-pendencias.md).

Trata-se de piloto acadêmico em testnet. Não inclui integração real com KYC, reservas hoteleiras ou conversão BRL/stablecoin, nem auditoria independente. A definição de 3 noites e até 5 pessoas ainda não é validada pela API; prazo de cancelamento e no-show dependem de definição. A publicação na Sepolia não equivale a operação em produção.
