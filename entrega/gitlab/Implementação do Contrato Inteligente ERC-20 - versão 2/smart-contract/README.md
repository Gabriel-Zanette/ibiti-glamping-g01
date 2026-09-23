# IBIToken — segunda entrega de implementação

Revisão de 22/09/2026, **versão técnica 3**. A Parte 1 acadêmica continha o contrato técnico v2 publicado em 11/09. Esta Parte 2 corrige o feedback: teto de 20 por pessoa, tesouraria independente, calendário semestral, recuperação anunciada por 48 horas e compra atômica em stablecoin.

- [Evolução, justificativas e matriz dos critérios](docs/evolucao-v1-v2.md).
- [Guia do Remix e execução local](docs/guia-de-execucao.md).
- [Regras do contrato](docs/regras-de-negocio-para-contrato.md).
- [Relatório de testes](docs/relatorio-de-testes.md).
- [Limites e pendências](docs/premissas-e-pendencias.md).

`contracts/` contém um ERC-20 de negócio e moeda fictícia de teste; `vendor/` reúne os componentes OpenZeppelin 5.6.1 necessários. `scripts/` publica/opera no Remix; `tests/` tem suítes Solidity e testes Node/Anvil; `tools/` oferece validação e empacotamento. Hospedagens permanecem por pessoa em `../offchain/`.

Na raiz do repositório, com Node 24+:

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

Remix é o ambiente de entrega. A alternativa local usa solc 0.8.34, Osaka, otimizador 200, Anvil 1.7.1 e ethers, sem Hardhat. Extraia `../entrega/IBITI-Remix.zip` para importar no Remix. O pacote completo da Parte 2 inclui também o serviço e os testes de integração.

**Estado público:** v3 ainda não publicada. A v2 histórica na Sepolia (`0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811) não contém as novas salvaguardas. Editar este repositório não altera contratos publicados. [Evidências históricas](docs/deploy-modelo-pessoa.md).
