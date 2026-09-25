---
status: accepted
---

> **Implementado na fonte local v4 em 25/09/2026.** Ver [inventário e limites](../decisoes/2026-09-25-inventario-completo-token.md). O texto abaixo registra a decisão e as pendências existentes no momento de sua formulação.

# Retirada do mercado secundário

Em 23/09/2026, na anotação 11, o usuário retirou o mercado secundário por entender que sua complexidade de conciliação com cotas não se justifica pela necessidade esperada da persona. Esta decisão substitui o ADR 0002: a oferta passa a prever aquisição primária, sem revenda entre participantes; não cria promessa de recompra ou resgate pela IBITI.

A restrição deve ser efetiva nas transferências ordinárias entre pessoas, e não apenas na interface, preservando compra primária e recuperação autorizada da mesma pessoa. Sucessão permanece procedimento externo com limites expressos. A [consolidação](../decisoes/2026-09-23-consolidacao-das-anotacoes.md) registra o impacto no contrato, nas cotas e no memorando. Código e pacotes ainda admitem transferências e precisam ser adaptados.
