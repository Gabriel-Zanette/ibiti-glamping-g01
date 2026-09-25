---
status: superseded by ADR-0004
---

# Primeira aquisição permitida no mercado secundário

> **Substituído em 23/09/2026:** a anotação 11 confirmou a retirada de todo o mercado secundário. Prevalece o [ADR 0004](0004-sem-mercado-secundario.md). O texto abaixo preserva o aceite anterior e sua trajetória, não a decisão atual.

Em 22/09/2026, o usuário confirmou que participantes previamente aprovados podem adquirir IBT de outros titulares, inclusive sem saldo anterior. Isso substitui a porta de entrada exclusivamente primária, mantendo aprovação prévia, teto por pessoa e conservação dos direitos de hospedagem já consumidos.

## Consequências

- A aprovação deve ser válida no momento da operação; saldo positivo não substitui identidade e elegibilidade.
- O contrato ainda exige saldo positivo para o destinatário de transferência comum; esta decisão não está implementada nesta rodada.
- Pagamento secundário, oferta/cancelamento, informação e garantia das cotas transferidas e reservas de hospedagem dependem de desenho adicional. Não presumir atomicidade entre pagamento, tokens e livro externo de cotas.
- A política vigente de cotas continua: uma por IBT em toda a emissão, sem recriar direitos utilizados, com transferência de cotas livres. Não prometer uma experiência nova para cada compra secundária.
