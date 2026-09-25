---
status: accepted
---

> **Implementado na fonte local v4 em 25/09/2026.** Ver [inventário e limites](../decisoes/2026-09-25-inventario-completo-token.md). O texto abaixo registra a decisão e as pendências existentes no momento de sua formulação.

# Royalties proporcionais à quantidade e ao tempo de posse

Em 23/09/2026, na anotação 1, o usuário escolheu considerar o tempo de posse durante cada semestre para impedir que uma compra imediatamente anterior ao corte receba como se tivesse ocorrido no início do período. A decisão substitui o saldo instantâneo no reporte da v1 e a recomendação intermediária de fotografia no fechamento; não altera a periodicidade semestral.

O código ainda usa saldo no reporte. A implementação deve preservar histórico, posição da tesouraria, contribuição da mesma pessoa em recuperação e recebíveis de períodos fechados. A [consolidação](../decisoes/2026-09-23-consolidacao-das-anotacoes.md) distingue a decisão do método de cálculo proposto e os efeitos sobre o memorando.

Em 25/09/2026, o usuário confirmou expressamente que o sistema recomendado e o exemplo de cinco tokens durante o semestre mais um adquirido no último dia atendem ao objetivo. Não reabrir a escolha de fotografia instantânea. O [planejamento da jornada](../decisoes/2026-09-25-jornada-unificada-waitlist.md) preserva esse aceite.
