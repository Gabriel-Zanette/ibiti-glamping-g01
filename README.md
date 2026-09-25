# IBITI Glamping · Grupo G01

## Testar o projeto passo a passo

Comece pelo **[guia da v2 em preparação e acessos locais](smart-contract/docs/guia-v4.md)**: waitlist, login individual, administração, compra conciliada e uso de cotas. O [guia anterior](GUIA-DE-TESTES.md) permanece como registro da interface histórica.

## Entrega funcional do token

**Revisão de 25/09/2026:** revisão interna v4, destinada à versão oficial v2, com royalties por tempo, calendário desde a abertura, proibição de transferências ordinárias e recuperação com sete dias. [Inventário completo de mudanças e pendências](docs/decisoes/2026-09-25-inventario-completo-token.md), [validação](smart-contract/docs/validacao-v4.md) e [feedback do memorando v2](docs/decisoes/2026-09-25-feedback-memorando-v2.md). Governança conjunta e pausa seletiva ainda pendentes; contratos históricos não foram alterados.

- **[smart-contract/](smart-contract/README.md):** workspace Remix para a v2 oficial (revisão interna v4) com `contracts/`, `scripts/` e `tests/`; documentação e evidências de publicação.
- **[offchain/](offchain/README.md):** cadastro, assinatura de carteira, cotas por pessoa, API e Passaporte. É necessário ao fluxo de hospedagens.
- **[documentacao/](documentacao/README.md):** contexto, decisões, hipóteses e histórico do projeto.
- **[guia-de-comunicacao/](guia-de-comunicacao/README.md):** artefato de comunicação separado da implementação do token.

Para o Remix, usar as fontes atuais e o [guia atual](smart-contract/docs/guia-v4.md), com viaIR habilitado. A preparação atual e os ZIPs regenerados ficam em [entrega/v2/](entrega/v2/README.md); os pacotes fora dessa pasta permanecem históricos.

## Executar o sistema completo localmente

Node 24 ou superior:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm test --prefix smart-contract
npm test --prefix offchain
npm run demo:portal --prefix offchain
```

Abra http://localhost:3000. A demonstração usa **Anvil**, compila pelo **solc** e mantém o banco local em `data/portal-demo-*/`. Não há dependência de Hardhat. KYC e reservas reais do hotel não estão integrados.

## Estado da rede

**Histórico — piloto da entrega oficial v1 (revisão técnica então chamada v2), publicado em 11/09 na Sepolia:** IBIToken em `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811, 150 IBT, sem resgates ou contadores de hospedagem on-chain. Publicada pelo Remix/MetaMask e verificada no Sourcify (correspondência exata). A tBRL existente foi reutilizada. As revisões técnicas anteriores permanecem como histórico, sem migração automática; a próxima entrega oficial v2 ainda está em preparação. [Evidências e distinção entre versões](smart-contract/docs/deploy-modelo-pessoa.md).

Uma experiência por IBT por toda a emissão, sem renovação. A fonte atual não permite circulação ordinária entre participantes. Experiência de 3 noites para até 5 pessoas; cancelamento manual provisório e três modalidades de custódia na jornada. O whitepaper anterior ainda precisa acompanhar as decisões posteriores registradas no inventário.

## Whitepaper e referência financeira

O [whitepaper da revisão anterior](output/pdf/whitepaper_ibiti_revisado.pdf) registra o modelo anterior e utiliza os números do arquivo Modelo Glamping.xlsx fornecido pelo grupo em 11/09/2026, sem alterar a planilha. A [fonte editável](whitepaper/whitepaper_ibiti_revisado.md) inclui as premissas e sensibilidades no capítulo 4 e no Apêndice B.

A referência histórica é de **R$ 37.055,19 por IBT**, com taxa de desconto de **17,8609% a.a.**, ocupação de 35% / 20% / 25% / 30% entre 2027 e 2030, royalties nominais projetados de R$ 8.923.259,16 e valor presente de R$ 5.558.278,01. A referência para 100 unidades é de R$ 3.705.518,67, calculada com o valor unitário integral da planilha. O desconto é anual; a planilha não detalha recebimentos semestrais. São projeções, não garantia de receita ou retorno.

O memorando v2 recebido nesta rodada usa R$ 34.874,14 e taxa de 20,46%; a diferença está documentada no feedback para conciliação pelo responsável financeiro, sem sobrescrever valuation ou planilha.

## Entrega acadêmica no GitLab (histórico)

A próxima entrega oficial está estruturada em [entrega/v2/](entrega/v2/README.md), com três pastas de artefatos do GitLab, código executável, guias de apoio e ZIPs atuais. Memorando e PDF de evidências finais continuam pendentes. As preparações anteriores e a primeira entrega foram preservadas; não houve envio desta estrutura ao GitLab.

O artefato técnico foi publicado na `main` do GitLab no [commit c9093569](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/commit/c9093569df8b5737bd6ca69b7680031de17434c1), em `Sprint 3/Implementação do Contrato Inteligente ERC-20 - versão 1`. O nome acadêmico “versão 1” contém a implementação técnica IBIToken v2.

A entrega documental da Sprint 3 utiliza `Whitepaper Técnico do Ativo Digital`, preservando o nome da pasta histórica da Sprint 2. A cópia de preparação do README do repositório acadêmico está em `entrega/gitlab/README.md`; seus caminhos seguem a organização por sprints do GitLab, enquanto este repositório local mantém `smart-contract/`, `offchain/` e `whitepaper/`.

## Preparação de Deploy e Evidências Operacionais

[Guia completo para o responsável](docs/entrega/guia-deploy-e-evidencias-v2.md), [roteiro mínimo em inglês](docs/entrega/roteiro-minimo-relatorio-onchain-en.md) e [índice CSV de evidências](docs/entrega/registro-evidencias-modelo.csv). São materiais de preparação; não representam novo deploy ou relatório de operações públicas concluídas.

[Revisão de usabilidade de todas as telas](docs/decisoes/2026-09-25-interface-progressiva.md) e [pendências consolidadas](docs/decisoes/2026-09-25-pendencias-para-retomada.md).
