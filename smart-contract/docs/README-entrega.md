# Implementação do Contrato Inteligente ERC-20 — versão 2 acadêmica

Grupo G01 · IBITI Glamping · revisão de 22/09/2026.

Esta segunda entrega utiliza código técnico **IBIToken v3**, com as correções do feedback da Parte 1 (nota 8,4). Os contratos técnicos v1/v2 publicados em 11/09 continuam históricos; a v3 ainda não tem deploy público.

Comece pela [evolução e matriz dos oito critérios](smart-contract/docs/evolucao-v1-v2.md), pelo [guia de execução](smart-contract/docs/guia-de-execucao.md) e pelo [relatório de testes](smart-contract/docs/relatorio-de-testes.md). O [whitepaper](output/pdf/whitepaper_ibiti_revisado.pdf) foi alinhado; sua [fonte](whitepaper/whitepaper_ibiti_revisado.md) está incluída.

## Reproduzir

Node.js 24+; na raiz deste pacote:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm run build --prefix smart-contract
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
npm run demo --prefix offchain
```

Remix é o ambiente da entrega. solc e Anvil oferecem validação local sem Hardhat. Os dois módulos precisam estar instalados para os testes de integração. O demo abre em localhost:3000, com janela civil demonstrativa 2025–2028, tBRL fictícia e cadastro simulado.

## O que mudou

Teto 20 por pessoa na blockchain; tesouraria separada do owner; oito semestres civis; recuperação anunciada por 48 horas, contestável, com royalties sem saldo; compra stablecoin atômica; cadastro/cotas conciliados. Emissão 150, reserva 50, alíquota 15% e política de cotas preservadas.

A entrega não inclui bancos, credenciais ou node_modules. `MANIFEST.sha256` identifica os arquivos incluídos. Não houve push/deploy público nesta revisão. O pacote pode ser colocado na sprint correspondente do GitLab; o nome dessa sprint não foi informado.
