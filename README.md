# IBITI Glamping · Grupo G01

## Entrega funcional do token

- **[smart-contract/](smart-contract/README.md):** workspace Remix v2 com `contracts/`, `scripts/` e `tests/`; documentação e evidências de publicação.
- **[offchain/](offchain/README.md):** cadastro, assinatura de carteira, cotas por pessoa, API e Passaporte. É necessário ao fluxo de hospedagens.
- **[documentacao/](documentacao/README.md):** contexto, decisões, hipóteses e histórico do projeto.
- **[guia-de-comunicacao/](guia-de-comunicacao/README.md):** artefato de comunicação separado da implementação do token.

Para o Remix, extraia `entrega/IBITI-Remix.zip`, importe a pasta e siga [o guia](smart-contract/docs/guia-de-execucao.md). A compilação e os testes do token no navegador não precisam de Node. O ZIP é gerado somente com os arquivos necessários ao workspace.

## Executar o sistema completo localmente

Node 24 ou superior:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm test --prefix smart-contract
npm test --prefix offchain
npm run demo --prefix offchain
```

Abra http://localhost:3000. A demonstração usa **Anvil**, compila pelo **solc** e mantém o banco local em `offchain/data/`. Não há dependência de Hardhat. KYC e reservas reais do hotel não estão integrados.

## Estado da rede

**v2 publicada na Sepolia:** IBIToken em `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811, 150 IBT, sem resgates ou contadores de hospedagem on-chain. Publicada pelo Remix/MetaMask e verificada no Sourcify (correspondência exata). A tBRL existente foi reutilizada. A versão 1 permanece apenas como histórico, sem migração automática. [Evidências e distinção entre versões](smart-contract/docs/deploy-modelo-pessoa.md).

A política `unused-first-v1` foi confirmada: uma experiência por IBT por toda a emissão, sem renovação e com circulação apenas das cotas livres. O projeto definiu 3 noites para até 5 pessoas. Prazo de cancelamento e custódia seguem em fechamento; essas condições e os limites do software estão no whitepaper revisado.

## Whitepaper e referência financeira

O [whitepaper atualizado](output/pdf/whitepaper_ibiti_revisado.pdf) descreve o modelo atual e utiliza os números do arquivo Modelo Glamping.xlsx fornecido pelo grupo em 11/09/2026, sem alterar a planilha. A [fonte editável](whitepaper/whitepaper_ibiti_revisado.md) inclui as premissas e sensibilidades no capítulo 4 e no Apêndice B.

A referência é de **R$ 37.055,19 por IBT**, com taxa de desconto de **17,8609% a.a.**, ocupação de 35% / 20% / 25% / 30% entre 2027 e 2030, royalties nominais projetados de R$ 8.923.259,16 e valor presente de R$ 5.558.278,01. A referência para 100 unidades é de R$ 3.705.518,67, calculada com o valor unitário integral da planilha. O desconto é anual; a planilha não detalha recebimentos semestrais. São projeções, não garantia de receita ou retorno.

## Entrega acadêmica no GitLab

O artefato técnico foi publicado na `main` do GitLab no [commit c9093569](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/commit/c9093569df8b5737bd6ca69b7680031de17434c1), em `Sprint 3/Implementação do Contrato Inteligente ERC-20 - versão 1`. O nome acadêmico “versão 1” contém a implementação técnica IBIToken v2.

A entrega documental da Sprint 3 utiliza `Whitepaper Técnico do Ativo Digital`, preservando o nome da pasta histórica da Sprint 2. A cópia de preparação do README do repositório acadêmico está em `entrega/gitlab/README.md`; seus caminhos seguem a organização por sprints do GitLab, enquanto este repositório local mantém `smart-contract/`, `offchain/` e `whitepaper/`.
