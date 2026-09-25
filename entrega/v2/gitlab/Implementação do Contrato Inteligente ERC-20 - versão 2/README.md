# Implementação do Contrato Inteligente ERC-20 — versão 2

IBITI Glamping · Grupo G01 · preparação da segunda entrega oficial, 25/09/2026.

A única versão oficial já publicada é a v1. Esta pasta reúne a fonte atual destinada à **v2**, ainda em preparação. “v4” em nomes de arquivos, package.json e registros é a revisão interna de desenvolvimento/testes. Não representa uma quarta publicação oficial nem atualização de endereços históricos.

## Começar por aqui

- [Execução, Remix e contas de demonstração](smart-contract/docs/guia-v4.md).
- [Inventário das mudanças on-chain e off-chain](docs/decisoes/2026-09-25-inventario-completo-token.md).
- [Pendências e critérios de conclusão](docs/decisoes/2026-09-25-pendencias-para-retomada.md).
- [Jornada e revisão das telas](docs/decisoes/2026-09-25-interface-progressiva.md).
- [Feedback do memorando v2](docs/decisoes/2026-09-25-feedback-memorando-v2.md).

## Estrutura executável

`smart-contract/` contém contratos, bibliotecas, scripts Remix, testes e ferramentas. `offchain/` contém cadastro, administração, compras e livro de cotas. `guia-de-comunicacao/landing/` contém as páginas públicas e seus recursos, utilizadas pelo servidor. Esses módulos precisam permanecer juntos; não entregar apenas o Solidity nem remover a landing.

`docs/` preserva decisões e a trajetória entre versões. Os documentos históricos identificados como tal, inclusive registros de publicação, não substituem os guias atuais. O whitepaper e o memorando finais ainda precisam de conciliação editorial; não se inclui um PDF antigo sob o nome de documento final novo.

## Reproduzir

Node.js 24+; executar da raiz desta pasta:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm run build --prefix smart-contract
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
npm run demo:portal --prefix offchain
```

A demonstração inicia a landing em `http://localhost:3000/`, com login em `/conta#entrar`; `DEMO_PORT` permite escolher outra porta. Cria rede Anvil e banco isolados, pessoas sintéticas, abertura simulada e moeda fictícia. Os perfis e senhas exclusivamente de teste estão no guia de execução. `Ctrl+C` encerra essa demonstração. Não é Sepolia nem operação comercial; não usar chaves de teste com recursos reais.

Solidity 0.8.34, EVM Osaka, otimizador 200 e viaIR habilitado; OpenZeppelin 5.6.1 vendorizada. Não há Hardhat.

## Modelo atual e limites

Emissão de 150 IBT indivisíveis; reserva inicial de 50; teto de 20 por pessoa; tesouraria separada de owner; royalties por quantidade × tempo; oito semestres civis e quatro anos desde a abertura; ausência de mercado secundário; recuperação da mesma pessoa anunciada com sete dias; compra em stablecoin atômica. Referência econômica: R$ 34.874,14/IBT; tBRL na demonstração é fictício.

Waitlist com prazo de cinco dias úteis, três modalidades de custódia, compra após aprovação e conta integrada às cotas. Cancelamento de hospedagem é manual. A custódia sem extensão funciona no adaptador Anvil local; não equivale a contratar um custodiante real.

Governança conjunta por pilares, pausas seletivas, recuperação/contestação integrada e tesouraria 2 de 3 continuam incompletas. Integrações comerciais de identidade, pagamento e hospedagem não estão prontas. A pasta permite revisar o formato e executar o estado atual, mas não sinaliza essas pendências como concluídas.

## Integridade e histórico

`MANIFEST.sha256` identifica o conteúdo do pacote; `FONTE.json` informa a base de origem e que se trata de preparação. O manifesto é a referência para as alterações locais incluídas; o commit-base sozinho não as representa. Registros em `smart-contract/deployments/` são históricos, não evidências de um novo deploy desta v2.

Os arquivos `.env.example` e `.env.portal.example` são modelos sem segredos reais. Bancos, sessões, configurações privadas e node_modules ficam fora do pacote. Não editar cópias geradas nesta pasta; alterar os módulos canônicos e executar `npm run package:delivery --prefix smart-contract` no repositório de trabalho.
