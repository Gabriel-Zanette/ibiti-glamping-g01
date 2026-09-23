# Decisões e limites da Parte 2

Implementado: Solidity 0.8.34, OpenZeppelin 5.6.1, Remix, Anvil local; 150/50/20; teto pessoal; tesouraria separada; calendário civil; recuperação com 48h, contestação, geração administrativa e recebíveis sem saldo; compra stablecoin atômica; integração com cotas. Sem Hardhat.

Escolhas técnicas desta revisão: tesouraria imutável, identificação pseudônima permanente, prazo de 48 horas e preço unitário configurável apenas uma vez. Não são evidência de ratificação jurídica/comercial da IBITI. Alternativas e motivos: [evolução](evolucao-v1-v2.md).

Permanecem externos: unicidade/qualidade de KYC, apuração verdadeira de receita, disponibilidade e prestação de hospedagem, recebimento em reais, conversão BRL/stablecoin, definição de custódia e sucessão entre pessoas. A trilha SQLite não é imutável. Prazo de cancelamento/no-show e imposição de 3 noites/5 hóspedes ainda não estão automatizados.

Limites do contrato: o corte de royalties é no reporte, ainda sujeito a atraso; owner concentra poderes; reduzir reserva e pausar não têm espera; o prazo de recuperação exige monitoramento e não elimina abuso do cadastro. Tesouraria e stablecoin não podem ser trocadas. Token com taxa/rebasing não é suportado. Não há auditoria formal de segurança nem integração Mainnet.

A Parte 2 está preparada localmente. A v3 técnica não foi publicada na Sepolia; endereços v1/v2 permanecem históricos. Nova publicação não migra saldos, royalties ou cotas automaticamente. O memorando consolidado não foi fornecido junto do feedback; conferir condições jurídicas antes da apresentação final.
