# IBIToken — contrato da entrega v2

ERC-20 em Solidity 0.8.34, OpenZeppelin 5.6.1 vendorizada, EVM Osaka, otimizador 200 e viaIR. `contracts/` contém a fonte e as licenças; `scripts/` contém os fluxos Remix; `tests/` contém regressões Solidity e integração EVM; `tools/` contém compilação e rede local.

Instalação e comandos: [guia de execução](../docs/EXECUCAO.md). Regras, evolução e limitações: [modelo](../docs/MODELO-E-LIMITES.md). Os caminhos partem da raiz do pacote, que deve preservar `smart-contract/` e `offchain/` como pastas irmãs.

Para Remix, importar `contracts/`, `scripts/` e `tests/` juntos. `01_publicar.js` bloqueia Sepolia por padrão; conferir as configurações antes de publicar. Datas e moeda de teste não representam abertura ou operação comercial. A versão 4.0.0 no package.json é a revisão interna, destinada à entrega oficial v2.
