# IBIToken · workspace Remix

Versão 2, 11/09/2026. Contrato ERC-20 indivisível, com 150 IBT, transferências restritas, reserva, recuperação de acesso e royalties. Hospedagens são controladas por pessoa no serviço `../offchain/`.

## Estrutura

```text
smart-contract/
├── contracts/      IBIToken.sol, moeda fictícia de testes e dependências Solidity
├── scripts/        publicar e operar diretamente no Remix
├── tests/          testes Solidity do Remix e integração automatizada
├── docs/           execução, regras, premissas e evidências
├── deployments/    recibos, parâmetros e fontes das versões publicadas
├── tools/          compilador solc e Anvil, somente para validação local
├── package.json    comandos opcionais de validação local
└── README.md
```

`contracts/vendor/` contém apenas os 16 arquivos OpenZeppelin 5.6.1 necessários. São dependências herdadas, não contratos adicionais a publicar. `contracts/mocks/MockStablecoin.sol` é a moeda fictícia para royalties. Contratos em `tests/` nunca são publicados como parte do produto.

## Executar pelo Remix

Siga [o guia do Remix](docs/guia-de-execucao.md). Extraia `../entrega/IBITI-Remix.zip` e importe a pasta em **New workspace → Import Project**. Não é necessário instalar Node para compilar, testar e operar o token no Remix.

## Validar o sistema completo localmente

Na raiz do repositório, usando Node 24 ou superior:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
npm run demo --prefix offchain
```

O compilador oficial `solc` 0.8.34 gera ABI e bytecode. O Anvil 1.7.1 executa a EVM local. Os mesmos testes Solidity usados no Remix rodam nessa EVM; `node:test` também verifica a integração com cotas e os scripts. Não há dependência, configuração ou comando de Hardhat.

`npm run package:remix --prefix smart-contract` recompila e gera o ZIP com uma lista explícita de arquivos, sem dependências Node, ferramentas locais, segredos ou fontes históricas.

## Versão publicada versus versão de entrega

A **v2 está publicada na Sepolia** em `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811, com 150 IBT e verificação exata no Sourcify. Ela remove os resgates e contadores on-chain. A v1 permanece histórica em `0x111B510517087a76eF7D1914849898A0718A2734`; os saldos e o banco não foram migrados. [Recibos e procedimento de atualização](docs/deploy-modelo-pessoa.md).

[Regras e arquitetura](docs/regras-de-negocio-para-contrato.md) · [Testes](docs/relatorio-de-testes.md) · [Premissas pendentes](docs/premissas-e-pendencias.md)
