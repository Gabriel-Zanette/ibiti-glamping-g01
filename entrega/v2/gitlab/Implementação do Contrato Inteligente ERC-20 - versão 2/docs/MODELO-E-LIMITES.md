# Modelo, evolução e limites da implementação v2

## Regras implementadas

| Regra | Comportamento atual |
| --- | --- |
| Emissão | 150 IBT indivisíveis, sem novas emissões; reserva inicial de 50 na tesouraria. |
| Reserva | Pode ser reduzida, nunca aumentada. Reduzir libera estoque para compra; não cria nem vende tokens automaticamente. |
| Identidade e teto | Carteiras vinculadas a um identificador opaco permanente; soma limitada a 20 IBT por pessoa. A autenticidade da identidade depende do cadastro externo. |
| Administração | `owner` separado da tesouraria imutável. Trocar administrador não move estoque nem elimina a reserva. |
| Compra primária | Cadastro aprovado, carteira registrada e autorização da stablecoin; pagamento e entrega de IBT na mesma transação. Pedido protegido contra liquidação repetida. |
| Circulação | Sem mercado secundário: `transfer` e `transferFrom` ordinários são bloqueados, inclusive entre carteiras da mesma pessoa. Compra e recuperação são caminhos controlados. |
| Vigência | Abertura registrada uma vez; oito semestres civis e quatro anos desde esse marco. Nenhuma data real de inauguração é presumida. |
| Royalties | 15% do faturamento informado. Cada pessoa recebe pela quantidade de IBT multiplicada pelo tempo de posse dentro do semestre. Reporte sequencial somente após o encerramento. |
| Financiamento e saque | O reporte deposita a soma dos recebíveis na mesma transação; saque individual protegido contra reentrada. Diferença de arredondamento permanece com o pagador. |
| Recuperação | Mesma pessoa, destino restrito, anúncio público, sete dias de espera e cancelamento. Preserva tempo acumulado e recebíveis, inclusive sem saldo de tokens. |
| Hospedagem | Livro externo de cotas; uso não queima IBT nem altera royalties. Cancelamento manual provisório, sem crédito automático de meia cota. |

O peso de uma carteira no semestre é a soma de `saldo × segundos` de cada intervalo. Sua parcela é `royalty do semestre × peso / (150 × duração do semestre)`, com arredondamento para baixo na unidade mínima da moeda. A tesouraria também participa. Exemplo: dois IBT mantidos pelo semestre inteiro recebem o dobro de dois IBT comprados na metade, sob o mesmo faturamento. A compra tardia não cria participação retroativa.

## Integração com o portal

Uma identidade relaciona conta, candidatura, carteiras, compras e cotas. A aprovação da waitlist não concede tokens. Somente uma compra confirmada e conciliada pode liberar direitos na mesma conta. Reservas usam login; não exigem redigitar carteira.

O prazo de análise é de cinco dias úteis após cadastro completo, com suspensão enquanto aguarda complemento. Quantidade simulada é editável; pedido financeiro começa após aprovação. A referência é R$ 34.874,14 por IBT; tBRL é moeda fictícia de teste. O pedido reconfere o preço efetivo do contrato.

Há custódia IBITI com carteira dedicada, autocustódia assistida e direta. A escolha pode mudar antes da compra enviada/concluída, invalidando preparações incompatíveis. Transações enviadas precisam ser conciliadas. A compra institucional sem extensão funciona somente no adaptador Anvil local.

## Evolução em relação à primeira entrega

| Fragilidade identificada | Correção e justificativa | Teste de referência |
| --- | --- | --- |
| Concentração em várias carteiras | Teto agregado por pessoa protege a participação econômica. | `feedback.test.ts` |
| Recuperação imediata e para administrador | Destino restrito, anúncio e espera de sete dias reduzem abuso e permitem contestação. | `feedback.test.ts`, `time-weighted.test.ts` |
| Troca de administrador quebrava compras | Tesouraria separada conserva estoque e reserva. | `feedback.test.ts` |
| Oito reportes antecipados | Encerramentos derivados da abertura impedem consumir semestres futuros. | `time-weighted.test.ts` |
| Recebíveis sem saldo irrecuperáveis | Recuperação considera saldo ou recebíveis e preserva obrigações. | `time-weighted.test.ts` |
| Entrega primária manual | Compra paga em stablecoin e entrega atômica evitam pagamento on-chain sem token. | `Settlement_test.sol`, `portal.test.ts` |
| Corte favorecia compras tardias | Acúmulo por tempo substitui a fotografia no dia da apuração. | `time-weighted.test.ts` |
| Complexidade do mercado secundário e cotas | Circulação secundária removida por decisão do modelo; direitos consumidos continuam no livro externo. | `time-weighted.test.ts`, `offchain.test.ts` |

Os arquivos de teste citados ficam em `smart-contract/tests/`. O serviço possui sua própria suíte em `offchain/test/`. Executar os comandos do guia para obter o resultado da revisão efetivamente entregue; testes locais não equivalem a auditoria de produção.

## Limitações e trabalho restante

- O contrato mantém administrador único e pausa global. Governança por pilares, segunda aprovação crítica, pausas seletivas e tesouraria 2 de 3 ainda não foram implementadas. Papéis do portal não substituem assinaturas on-chain.
- Recuperação tem travas contratuais, mas o processo completo de atendimento, revisão independente, avisos e contestação integrado ao contrato permanece pendente. Não há sucessão entre pessoas.
- Cadastro depende de verificação externa: CPF válido, HMAC e assinatura de carteira não comprovam identidade civil. Não há fornecedor KYC, MFA, avisos por e-mail ou recuperação automatizada de senha integrados.
- O administrador informa a receita; o contrato verifica cálculo e financiamento, não a verdade contábil. Prazo operacional, retificação de relatório e responsáveis ainda exigem definição.
- Custódia comercial, pagamentos/conversão reais, disponibilidade hoteleira e política definitiva de cancelamento ainda dependem de integração e definição operacional.
- A tesouraria é imutável nesta instância. Publicar outra fonte não atualiza contratos antigos. A evidência pública de implantação e os ensaios locais têm escopos distintos, explicitados no artefato de Deploy.

A revisão interna v4 é identificador técnico de desenvolvimento; a entrega acadêmica em preparação é a v2. Não apresentar limitações acima como funcionalidades concluídas.
