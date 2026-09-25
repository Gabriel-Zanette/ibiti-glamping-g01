# IBITI Glamping — continuidade entre conversas

## Pedido persistente de Gabriel (25/09/2026)

Em cada nova conversa deste projeto, conferir `docs/decisoes/2026-09-25-pendencias-para-retomada.md` e o estado atual do código. Lembrar brevemente Gabriel das pendências ainda abertas, sem bloquear o assunto novo nem repetir decisões já tomadas. Se uma pendência foi concluída, atualizar o documento em vez de continuar anunciando-a. O lembrete agendado para 26/09/2026 às 09h é complementar a esta instrução.

A lista distingue decisões aceitas ainda não implementadas, definições abertas e integrações para operação real. Não apresentar aceites como funcionalidades prontas e não usar a lista como autorização genérica para alterar condições econômicas.

## Estado de referência

- Versão oficial publicada: v1. Próxima entrega oficial: v2. “v4” é apenas a revisão interna de desenvolvimento/testes, a consolidar na v2 após validação; não tratar como versão oficial publicada.
- Fonte atual: revisão interna v4 do contrato e portal em `offchain/`. Consultar o inventário em `docs/decisoes/2026-09-25-inventario-completo-token.md` e o complemento de UX em `docs/decisoes/2026-09-25-refinamento-do-portal.md`.
- Sem mercado secundário; limite de 20 IBT por pessoa; royalties proporcionais ao tempo; oito semestres desde a abertura oficial, ainda sem data confirmada.
- Cancelamento de hospedagem manual e provisório. Não reativar a proposta supersedida de meia cota automática.
- Cadastro simula interesse sem compromisso. A quantidade continua editável após aprovação; só existe pedido de compra depois da aprovação e conferências. Pedidos em andamento preservam seus termos.
- Custódia IBITI, autocustódia assistida e direta são escolhas distintas; não pedir carteira para login ou reserva de hospedagem.
- Não sobrescrever mudanças locais preexistentes. Não confundir endereços históricos publicados com a versão local. Memorando recebido deve receber feedback separado, sem editar o PDF original.

## Último refinamento do portal

Referência econômica adotada: R$ 34.874,14/IBT do memorando v2. Não repetir que a demo atual usa 100 tBRL. Financeiro acessa somente Compras; titular entra em Experiências, sem simulador. Custódia IBITI sem extensão é exclusiva do adaptador Anvil local. Ver `docs/decisoes/2026-09-25-portal-por-etapa-e-responsavel.md`. A versão oficial futura permanece v2, independentemente das revisões internas de teste.

Revisão visual subsequente: `docs/decisoes/2026-09-25-interface-progressiva.md`. Cadastro agora tem três etapas; detalhes e formulários aparecem sob demanda. O guia para o responsável pelo artefato on-chain e o roteiro mínimo em inglês estão em `docs/entrega/`; não confundir esses materiais com evidências já coletadas de um novo deploy.

## Próxima retomada solicitada por Gabriel — 25/09/2026

Além das pendências antigas, Gabriel quer **remodelar os pilares da administração** e **aprimorar a parte de custódia**. Retomar esses dois assuntos em breve, antes de considerar o desenho administrativo atual definitivo. O pedido desta rodada é registrar a intenção, não implementar uma reorganização sem detalhá-la. Preservar as três modalidades aceitas; o alcance das melhorias e a nova divisão dos pilares serão definidos na retomada.

Preparação de entrega atual: `entrega/v2/README.md`, com espelho local do GitLab e pacotes atualizados. Não usar os ZIPs históricos fora dessa pasta como fonte da nova v2. Regenerar a preparação após mudanças nos módulos canônicos.
