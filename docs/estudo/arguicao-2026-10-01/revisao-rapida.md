# IBIToken: revisão antes da arguição

Leia primeiro esta folha; use o guia completo para explicar o “porquê”.

## A fala de abertura

“O IBIToken é uma proposta de antecipação de royalties para fortalecer o ecossistema IBITI. Combina uma experiência de hospedagem, pertencimento e participação em 15% da receita bruta elegível do Glamping. Não representa propriedade do hotel ou participação societária. O contrato registra regras e pagamentos; identidade, receita e prestação da hospedagem dependem de processos externos. A entrega é acadêmica, com implantação na Sepolia e demonstração operacional no Anvil.”

## Os números que precisam estar claros

| Número | Significado |
|---|---|
| 150 / 100 / 50 | Supply total / colocação inicial / reserva inicial. |
| 20 | Limite por pessoa, somando carteiras registradas. |
| 15% | Fração da receita bruta destinada ao royalty, não retorno anual. |
| 0,1% | Parcela da receita para 1 IBT mantido pelo semestre inteiro. |
| 8 semestres | Contados da abertura oficial, ainda sem data real confirmada. |
| R$ 34.874,14 | Preço indicativo do memorando v2. |
| 20,4601% | Taxa anual de desconto; TIR-base coincide por construção. |
| R$ 5,231 milhões | Valor presente dos royalties dos 150 tokens. |
| R$ 3,487 milhões | Captação potencial para 100 tokens, não captação realizada. |
| 5.000 | Cenários de Monte Carlo. |
| 51,04% / 2,9% | VP abaixo do preço / soma nominal abaixo do preço, dentro do modelo. |
| 7 dias | Espera de recuperação de carteira da mesma pessoa. |

## Três contas para explicar de cabeça

**Valuation:** unidades × 365 × ocupação = diárias vendidas. Multiplique pela diária e some consumo das hospedagens, que são diárias ÷3. Tire 15%, desconte os fluxos a valor presente e divida por 150.

**Royalty temporal:** receita de 150.000 gera 22.500. Dois IBT no semestre inteiro: 300. Dois IBT só pela metade: 150. Mesma quantidade final, tempo diferente.

**Risco:** 50% corresponde ao peso 3; impacto muito alto ao peso 5; score 15, crítico. Não multiplique 0,5 por 5. A17 usa faixa de 90%, peso 5 × impacto 4 = 20.

## Gestão e riscos

As ameaças críticas da Sprint 4 são A1, esforço/prazo; A4, aderência ao IBITI; A17, omissão de requisitos. Saiba explicar responsável, mitigação, contingência, indicador e gatilho. “Mitigado” não significa eliminado.

A17: houve omissões nas três sprints, com contagens 6, 2 e 2. Laplace estima 80% de ocorrência; Poisson com média 2 dá 86,47%; a matriz enquadra em 90%. São aproximações com poucos dados, não precisão comprovada sobre a próxima entrega.

Rastreabilidade: requisito → decisão/tarefa → implementação/documento → teste/evidência. Pronto exige revisão e coerência, não só arquivo exportado.

## Programação em oito respostas

1. **Compra:** entrega IBT e cobra tBRL na mesma transação; se falha o pagamento, tudo reverte.
2. **Pessoa:** UUID opaco vincula carteiras; o contrato soma posições. CPF não vai para a rede.
3. **Hospedagem:** cota consumível no banco por pessoa; usar não queima IBT.
4. **Duplicação:** transação SQLite, idempotência e histórico impedem repetir débito ou recriar cotas.
5. **Receita:** administrador informa valor e hash; o contrato não audita a verdade do faturamento.
6. **Saque:** obrigação zerada antes do envio, proteção contra reentrada e retirada individual.
7. **Recuperação:** mesma pessoa, destino validado, sete dias, possibilidade de cancelar e carteira antiga revogada.
8. **Administração:** Ownable2Step troca proprietário em duas etapas; não é multisig.

## Não caia nestas armadilhas

- Não há mercado secundário nem transferência ordinária, mesmo entre carteiras da mesma pessoa.
- O contrato atual só permite compra após abertura; isso precisa ser conciliado com a tese de antecipação pré-operacional.
- 2027–2030 é o horizonte da planilha, não data real confirmada da operação.
- Custódia sem extensão foi demonstrada no adaptador Anvil; não está pronta como serviço institucional real.
- Cancelamento é manual e provisório. Não afirmar regra automática de 30 dias ou meia cota.
- Verificado no Sourcify significa correspondência de fonte, não auditoria de segurança.
- Deploy na Sepolia; ciclo operacional do vídeo no Anvil. Rejeições por eth_call não têm hash minerado.
- Os 31 testes anexados são uma regressão específica; os 60 casos pertencem à documentação histórica.
- 2,9% não é risco total real: o modelo não inclui todas as fontes de perda.
- Blockchain não comprova regeneração, KYC ou receita; isso exige evidência externa.

## Se precisar responder a uma divergência

“Esse trecho registra a versão anterior. Na entrega atual, a regra é esta, demonstrada por este código/teste. A documentação precisa ser conciliada.”

Se não houver evidência: “O que demonstramos é X. Y continua como premissa ou pendência.”
