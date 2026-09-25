> **Registro da revisão técnica v3 (22/09), preservado como trajetória.** A fonte atual é v4: [guia vigente](guia-v4.md), [inventário de regras e pendências](../../docs/decisoes/2026-09-25-inventario-completo-token.md). Calendário fixo, transferências, corte por fotografia e espera de 48h abaixo foram superados. Memorando v2 já recebido e revisado em feedback separado.

# Decisões e limites da Parte 2

> **Desenho posterior em 23/09/2026:** [12 anotações consolidadas](../../docs/decisoes/2026-09-23-consolidacao-das-anotacoes.md). Rateio passa a considerar tempo de posse; mercado secundário e pré-venda removidos; governança conjunta, pausa por atividade, recuperação de sete dias, identificação híbrida, tesouraria 2 de 3 e cotas de hospedagem off-chain aceitos. A reserva permanece liberável para venda com governança. Código/pacotes ainda exigem adaptação; suas validações anteriores não comprovam esses comportamentos novos. A compra primária atômica existe em contrato/scripts, sem checkout integrado.

> **Decisões posteriores do usuário em 22/09/2026:** início na abertura do Glamping, quatro anos de vigência, períodos de seis meses e entrada secundária para pessoa previamente aprovada. Calendário civil e saldo prévio descritos abaixo ainda são comportamento do código; a adaptação está pendente do fechamento do desenho. [ADRs](../../docs/adr/) · [Entrevista](../../docs/decisoes/2026-09-22-governanca-e-operacao.md).

Implementado: Solidity 0.8.34, OpenZeppelin 5.6.1, Remix, Anvil local; 150/50/20; teto pessoal; tesouraria separada; calendário civil; recuperação com 48h, contestação, geração administrativa e recebíveis sem saldo; compra stablecoin atômica; integração com cotas. Sem Hardhat.

Escolhas técnicas desta revisão: tesouraria imutável, identificação pseudônima permanente, prazo de 48 horas e preço unitário configurável apenas uma vez. Não são evidência de ratificação jurídica/comercial da IBITI. Alternativas e motivos: [evolução](evolucao-v1-v2.md).

Permanecem externos: unicidade/qualidade de KYC, apuração verdadeira de receita, disponibilidade e prestação de hospedagem, recebimento em reais, conversão BRL/stablecoin, definição de custódia e sucessão entre pessoas. A trilha SQLite não é imutável. Prazo de cancelamento/no-show e imposição de 3 noites/5 hóspedes ainda não estão automatizados.

Limites do contrato: o corte de royalties é no reporte, ainda sujeito a atraso; owner concentra poderes; reduzir reserva e pausar não têm espera; o prazo de recuperação exige monitoramento e não elimina abuso do cadastro. Tesouraria e stablecoin não podem ser trocadas. Token com taxa/rebasing não é suportado. Não há auditoria formal de segurança nem integração Mainnet.

A Parte 2 está preparada localmente. A v3 técnica não foi publicada na Sepolia; endereços v1/v2 permanecem históricos. Nova publicação não migra saldos, royalties ou cotas automaticamente. O memorando v1 foi localizado na Sprint 3 do GitLab e consultado em 23/09/2026; [conferência e Q1/Q2](../../docs/decisoes/2026-09-23-anotacoes-e-q1-q2.md). Sua regra de corte é o momento do reporte. O memorando v2 consolidado ainda está pendente; decisões posteriores e condições jurídicas precisam ser conciliadas na revisão final.
