# IBIToken — segunda entrega de implementação

Revisão de 25/09/2026, **versão técnica 4** para a Parte 2 acadêmica. Royalties por saldo × tempo, oito semestres desde a abertura, compra somente após abertura, transferências ordinárias bloqueadas, teto pessoal, tesouraria independente, recuperação com sete dias e compra atômica. Governança conjunta e pausa seletiva continuam pendentes.

- [Guia atual, demo e credenciais locais](docs/guia-v4.md).
- [Validação da v4](docs/validacao-v4.md).
- [Inventário integral on-chain/off-chain e pendências](../docs/decisoes/2026-09-25-inventario-completo-token.md).
- [Feedback pontual do memorando v2, sem alterar o PDF](../docs/decisoes/2026-09-25-feedback-memorando-v2.md).

Registros históricos da evolução:

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
npm run demo:portal --prefix offchain
```

Remix é o ambiente de entrega. A alternativa local usa solc 0.8.34, Osaka, viaIR, otimizador 200, Anvil 1.7.1 e ethers, sem Hardhat. Os pacotes ZIP anteriores são históricos e não foram regenerados nesta rodada. Para esta fonte use os diretórios atuais; não atribua suas funcionalidades aos pacotes antigos.

**Estado público:** v4 ainda não publicada em rede pública. A v2 histórica na Sepolia (`0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811) não contém as novas salvaguardas. Editar este repositório não altera contratos publicados. [Evidências históricas](docs/deploy-modelo-pessoa.md).
