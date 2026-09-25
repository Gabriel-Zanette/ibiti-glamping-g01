# Decisões após as 12 anotações

23/09/2026. As 12 anotações foram recebidas integralmente como texto nesta conversa, após as respostas Q3–Q13. Este documento prevalece sobre as propostas da entrevista de 22/09 e sobre os registros intermediários que aguardavam as anotações. Aceites do usuário definem o desenho do projeto; não comprovam implementação, contratação ou ratificação institucional da IBITI.

## Matriz atual

| Tema | Decisão e origem | Limite ou detalhe pendente |
| --- | --- | --- |
| Royalties — Q1, anotação 1 | **Rateio proporcional à quantidade e ao tempo de posse dentro de cada semestre.** | Substitui tanto o saldo no reporte quanto o saldo isolado no encerramento; método abaixo e [ADR 0003](../adr/0003-royalties-proporcionais-ao-tempo.md). |
| Abertura — Q2 | **Início do atendimento comercial regular**, quatro anos e oito semestres; recomendação aceita com condição de verificação durante o período. | A condição ainda precisa ser localizada: acompanhamento dos saldos, operação contínua do Glamping ou ambos. Pergunta enviada nesta rodada. Não inventar suspensão ou reinício do prazo. |
| Pré-venda — Q3 | **Removida.** Aquisição não antecede a abertura. | Cadastro e preparação administrativa anteriores não são compra; ajustar guarda temporal. |
| Governança — Q4, anotações 2–3 | **Quatro pilares aceitos:** cadastro/atendimento, financeiro, segurança e supervisão; revisão por outra pessoa nos atos críticos e na alteração dos próprios responsáveis. | Mapear pares autorizados por ato e substitutos. Quórum financeiro não equivale automaticamente à aprovação pelos papéis exigidos. |
| Reserva — Q5, anotação 5 | **Preservar inicialmente 50, permitindo liberação comercial para venda pela IBITI.** | Não há piso permanente de 50 incompatível com essa liberação. Quantidades, piso residual e eventual espera ainda abertos; governança conjunta deve ser respeitada. |
| Pausa — Q6, anotação 4 | **Por atividade afetada**, preservando saques quando pagamentos não forem afetados. | Autoridade de contenção/retomada e comunicação precisam da matriz operacional. |
| Recuperação — Q7, anotação 6 | **Fluxo proposto aceito:** protocolo privado, revalidação, prova da nova carteira, revisão independente, anúncio, contatos anteriores, sete dias corridos e execução sem disputa; contestação externa precisa impedir execução no contrato. | Precisar início da contagem e tratamento das exceções, inclusive contato anterior indisponível. Documentos pessoais ficam fora da blockchain. |
| Identificação e sucessão — Q8, anotações 6–7 | **Identificação híbrida aceita:** verificação independente + seleção IBITI + revisão de exceções. KYC real e sucessão externos, interfaces e simulações explícitas nesta entrega. | Nenhum fornecedor ou uso obrigatório de biometria foi escolhido. Sucessão entre pessoas não é recuperação da mesma pessoa. |
| Tesouraria — Q9, anotação 8 | **Endereço estável com duas de três assinaturas independentes**, backups separados e proteção da troca de signatários/quórum. | Selecionar responsáveis/substitutos. Não converter a escolha em custódia dos participantes. |
| Carteira do participante — Q10, anotação 8 | A anotação 8 endossa também **autocustódia assistida como direção**, enquanto Q10 pede conhecer as demais opções. | A comparação continua necessária; não interpretar como escolha de custodiante externo ou carteira contratual. [Comparação](2026-09-23-respostas-q3-q13.md#q10--alternativas-de-custódia-do-participante). |
| Financeiro — anotação 9 | Memorando v1 **localizado e conferido** na Sprint 3. | Detalhamento da base bruta, prazo e retificações continuam em aberto; 30 dias não foram aprovados. |
| Pagamento primário — anotação 10 | **Manter por enquanto referência econômica em reais e compra atômica**, preservando valuation; explicar fluxo efetivo. | Moeda efetiva, conversão, taxas e prestador ainda não definidos. Checkout atual é incompleto; descrição abaixo. |
| Mercado secundário — Q11, anotação 11 | **Removido integralmente do desenho.** Substitui o aceite anterior de entrada secundária. | Restrição precisa valer no contrato para transferências ordinárias entre pessoas, não apenas na interface; preservar compra primária e recuperação autorizada. [ADR 0004](../adr/0004-sem-mercado-secundario.md). |
| Hospedagem — Q12, anotação 12 | **Cotas comprometidas/consumidas no sistema off-chain.** Reformular retirando cenários de revenda e de bloqueio de IBT para proteger estadias. | Conservar cotas e histórico em recuperação. Regras de cancelamento continuam abertas. |
| Cancelamento — Q13 | **Em aberto por pedido expresso.** | Não aprovar automaticamente 14 dias, restituição irrestrita, penalidade ou prazo de ausência. |

## Q1 — proporcionalidade dentro do semestre

O pedido está suficientemente claro para fixar o princípio: cada quantidade adquirida participa somente pelo tempo em que pertenceu à pessoa durante aquele semestre. A idade anterior dos tokens não acumula bônus em semestres futuros. Não há identificação individual de cada IBT; mudanças do saldo agregado e seus instantes permitem calcular a posição ponderada.

Exemplo didático com semestre hipotético de 180 dias (o calendário real continua sendo de seis meses, com sua duração efetiva): cinco IBT durante todo o semestre e um IBT adicional no último dia resultam em `5 × 180 + 1 × 1 = 901 tokens-dia`. A posição média é `901 / 180 ≈ 5,00556 IBT`, em vez de seis. O token adicional participa por `1/180` da parcela de um token mantido durante todo esse semestre.

**Recomendação técnica para operacionalizar a decisão:** acumular quantidade × segundos decorridos em registros on-chain sempre que a posição mudar; fechar a contribuição nos limites reais de cada semestre. Isso dispensa consultas diárias e não depende do administrador escolher uma fotografia favorável. Compras posteriores ao encerramento não afetam o período encerrado; atraso de reporte não prolonga a contribuição. Preservar os dados dos oito períodos, inclusive após expiração e em recuperação, sem sobrescrever histórico necessário.

Mantendo a regra econômica existente de participação de toda a emissão, inclusive da tesouraria, a fórmula proposta é:

`royalty da pessoa = royalty total do semestre × soma(saldo × duração) / (150 × duração total do semestre)`

O royalty total continua sendo 15% da receita bruta elegível. Antes de uma venda primária, a contribuição temporal da unidade é da tesouraria; depois, do comprador. Não dividir somente pelo tempo dos compradores, pois isso poderia entregar uma parcela desproporcional a uma entrada tardia. A extensão temporal da regra da tesouraria é uma proposta de coerência com o modelo existente, não texto expresso do memorando v1.

O rateio usa o total de receita do semestre, ponderado pelo tempo de posse. Não vincula cada dia de posse ao faturamento daquele dia; essa seria outra regra econômica e exigiria receita segmentada. Frações do cálculo não tornam o IBT divisível. Tratar arredondamento apenas na unidade da moeda de pagamento, preservando a regra de resíduos que vier a ser documentada.

Recuperação da mesma pessoa deve preservar contribuição e recebíveis, sem reiniciar contagem ou contabilizar duas vezes. O teto de 20 continua agregado por pessoa. A implementação atual ainda usa saldo no reporte; nenhum teste anterior prova este modelo novo.

Referência técnica do princípio, não dependência escolhida: [PoolTogether — saldo médio ponderado pelo tempo](https://dev.pooltogether.com/protocol/design/twab-controller/). Sua política de retenção não deve ser copiada sem adaptação ao período de quatro anos do IBIToken.

## O que significa pagamento atômico

Na compra primária configurada com stablecoin, pagamento à tesouraria e entrega de IBT integram a mesma transação do contrato. Se uma parte falha, os dois movimentos dessa transação são revertidos. Isso não torna simultâneos a aprovação anterior da moeda, uma conversão de reais, a atualização do sistema de hospedagem ou o atendimento humano.

Hoje há duas transações do comprador: `approve`, que concede uma autorização limitada de gasto, e `buyPrimary`, que paga e recebe IBT. A aprovação anterior não é desfeita porque a compra falhou depois. Taxas de execução podem ser cobradas mesmo quando uma transação reverte. [ERC-20](https://eips.ethereum.org/EIPS/eip-20) e [taxas de execução no Ethereum](https://ethereum.org/developers/docs/gas/).

## Anotação 10 — percurso atual da compra

| Etapa do participante/operação | O que existe hoje | Limite |
| --- | --- | --- |
| 1. Cadastro e aprovação | API administrativa cria pessoa, trata CPF e registra aprovação. | Validação sintática e flag administrativa não são prova real de identidade; integração híbrida ainda não existe. |
| 2. Vínculo da carteira | Desafio e assinatura comprovam controle e criam sessão no Passaporte. | Assinar login não paga nem compra. Backend não guarda chave privada; assinaturas atuais são de carteiras EOA. |
| 3. Habilitação on-chain | API prepara `registerWallet` com identificador opaco. | Administrador ainda assina no Remix; a API não transmite. |
| 4. Preparação da compra | Contrato possui preço configurado uma vez, moeda, estoque e teto. | Participante precisa da stablecoin na rede correta e de moeda nativa para taxas. Conversão de reais/PIX não está integrada. |
| 5. Autorizações na carteira | Script calcula custo, envia `approve(IBIToken, custo)` e depois `buyPrimary(quantidade, referência)`. | Comprador assina as duas transações. Ainda não há checkout integrado para esses passos. |
| 6. Liquidação | `buyPrimary` transfere a moeda do comprador à tesouraria e entrega IBT ao próprio comprador, exigindo pagamento exato. | A transferência é atômica; não equivale a conciliação comercial de um pedido. Referência de venda atual não impede duplicidade. |
| 7. Reconhecimento no Passaporte | Indexador processa o evento `Transfer` em blocos finalizados e atualiza saldo/cotas. | Há intervalo entre compra confirmada e disponibilidade no sistema externo. Repetir sincronização não deve criar nova cota. |

O exemplo técnico usa **37.055,19 tBRL por IBT**, com seis casas decimais. É moeda de teste; não comprova compra de moeda real ou prestador de conversão. O memorando exibe R$ 37.055 indicativos; a diferença de apresentação não autoriza recalcular valuation. A configuração real deve conferir casas decimais da moeda escolhida, pois o script atual presume seis.

O backend não assina compras. O protótipo de aquisição não é checkout operacional; a compra funciona no contrato e nos scripts. Ainda faltam integração da interface, preparação e acompanhamento do pedido, informação clara de taxas/moeda, tratamento de repetição e estados de confirmação. O código também permite comprar antes da abertura e ainda precisa refletir Q3.

Fontes locais: [API](../../offchain/src/api.ts), [autenticação](../../offchain/src/auth.ts), [interface](../../offchain/public/app.js), [script de operação](../../smart-contract/scripts/02_operar.js), [contrato](../../smart-contract/contracts/IBIToken.sol), [sincronizador](../../offchain/src/chain.ts), [livro de cotas](../../offchain/src/ledger.ts) e [limites do protótipo](../../GUIA-DE-TESTES.md).

**Percurso pretendido para a interface:** cadastro/aprovação → carteira habilitada → escolha de quantidade com custo total → autorização da moeda → confirmação da compra → estado de processamento → compra confirmada → cotas reconhecidas. Se for desejado receber PIX, será necessário decidir prestador e conversão ou outro mecanismo explícito; não tratar um comprovante enviado como pagamento on-chain atômico.

## Anotação 12 — hospedagem sem revenda

Com a retirada do secundário, a experiência deixa de precisar resolver ofertas entre titulares ou a perda de saldo causada por revenda. O livro da hospedagem segue controlando os direitos para impedir duplicação:

1. A compra primária reconhecida atribui as cotas correspondentes, respeitando uma experiência por IBT em toda a emissão.
2. Uma solicitação separa as cotas necessárias e reduz a quantidade livre.
3. A confirmação mantém esse compromisso, sem novo débito.
4. A conclusão registra consumo definitivo daquela cota.
5. Eventual cancelamento restitui ou mantém o consumo conforme a política que vier a ser fechada; a mesma cota nunca pode ser restituída duas vezes.

Exemplo: cinco cotas iniciais, duas usadas e uma comprometida deixam duas disponíveis para nova solicitação. Esse uso não queima IBT nem reduz sua participação nos royalties. Recuperar uma carteira deve levar o histórico e os compromissos da mesma pessoa sem conceder novas cotas.

O código já separa cotas em `requestStay`, não desconta novamente na confirmação e possui devolução após sincronização. Ainda exige saldo/eligibilidade ao confirmar e concluir, e ainda permite transferências ordinárias. Portanto, a retirada do secundário precisa ser uma regra efetiva do contrato. Não basta apagar a tela de venda. Cancelamento atual também não tem o regulamento final de Q13.

## Conferência do memorando v1

[Fonte original e procedência](../referencias/memorando-v1-sprint3/README.md). Leitura das 17 páginas:

- Páginas 8 e 11: 15% da receita bruta total do Glamping, hospedagem e consumo. Não define caixa/competência, impostos, estornos, descontos ou receitas de terceiros.
- Páginas 11–12: saldo instantâneo na apuração, denominador 150, reserva participante, disponibilização e saque. A anotação 1 muda deliberadamente a forma de rateio.
- Página 13: prazos, reporte, auditoria e correção ainda a definir. Não aprova 30 dias nem um procedimento de retificação.
- Páginas 3–4 e 9: preço indicativo em reais; página 11 descreve pagamento externo e entrega primária administrativa. Não define moeda/conversão/PIX do checkout. A compra primária atômica atual é uma evolução, não capacidade prometida pelo texto histórico.
- Páginas 5, 7 e 14: transferências e eventual mercado secundário; retirada desse mercado exige revisar essas passagens.

Preparação pelo operador, conciliação financeira e revisão independente são coerentes com Q4, mas não certificam automaticamente a veracidade do faturamento. Preservar o original ao definir futura retificação. O memorando v2 consolidado ainda não foi recebido; o enunciado do artefato não o substitui.

## Desenho aceito versus código atual

| Mudança | Estado observado |
| --- | --- |
| Tempo de posse no royalty | Ainda não implementado; contrato usa saldo ao reportar. |
| Sem mercado secundário | Ainda não implementado; transferências ordinárias existem. |
| Abertura como marco e compra somente após abertura | Calendário civil e compra anterior ao início ainda existem. |
| Revisão conjunta e pausas seletivas | Código ainda concentra em `owner` e pausa global. |
| Recuperação em sete dias | Código permanece em 48 horas. |
| Reserva liberável sob governança | Redução existe, mas é unilateral, imediata e pode chegar a zero. |
| Tesouraria 2 de 3 | Contrato aceita endereço institucional, mas não implementa o quórum da carteira externa. |
| Identificação híbrida e checkout | Integrações reais não existem; cadastro/cotas funcionam no serviço acadêmico. |

Esta consolidação e os ADRs foram atualizados; o código não foi alterado nesta rodada de esclarecimento. Próximas definições: condição de Q2, pares/poderes de governança, detalhes de liberação da reserva, moeda/conversão, prazo/retificação de receita e cancelamento mantido aberto. Não pedir novamente as 12 anotações nem o memorando v1: ambos já foram recebidos/localizados.
