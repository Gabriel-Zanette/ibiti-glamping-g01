# 03 · Uso da experiência vinculado à pessoa (decisão de 10/09/2026)

> **Implementação em 10/09/2026:** consulte [10 · Implementação off-chain](10-implementacao-offchain.md). O software de cadastro e cotas já está neste repositório; aprovação, hotel e operação real da IBITI seguem pendentes. A política de cotas foi confirmada pelo responsável do projeto em 11/09/2026: uma experiência por IBT em toda a emissão, sem renovação; só direitos livres acompanham transferências. A v1 publicada mantém contadores legados sem uso. Em 11/09, a v2 publicada removeu esses contadores; veja [05](05-contrato-inteligente.md).

## A decisão

**O direito de hospedagem é da pessoa física verificada, não da unidade do token.** O token continua
único e sem queima; on-chain ele prova membership e royalty. O uso da hospedagem é registrado no
**cadastro da IBITI, fora da blockchain**, possivelmente de forma manual, o que é viável na escala do
piloto (no máximo cem compradores, dado o teto de 20 por carteira e 100 unidades à venda).

Substitui o **resgate híbrido com voucher** decidido em 26/08/2026 (portador entra no sistema de resgate,
escolhe unidades, recebe voucher por e-mail, IBITI marca o resgate no contrato). Mantém tudo o mais.

## Como funciona

1. A pessoa pede uma hospedagem, pelo concierge ou pelo portal, como membro.
2. A IBITI confere, no contrato, se a carteira vinculada àquela pessoa tem saldo e está dentro da
   validade (é membro).
3. A IBITI confere, no cadastro, o que aquela pessoa ainda pode reservar: hospedagens disponíveis, janelas
   exclusivas, eventuais faixas por quantidade.
4. A operação confirma a reserva e registra o uso no cadastro. Cancelar antes do uso agenda a devolução da cota após sincronização; remarcar preserva a cota. Uso concluído não pode ser cancelado.

Não existe voucher, "resgate", unidade nem estado na tela do usuário. Nenhuma transação é pedida ao
portador no momento do uso.

## O que muda e o que não muda

| Tema | Antes (resgate híbrido) | Agora (uso vinculado à pessoa) |
|---|---|---|
| Fonte da verdade do uso | contador on-chain de unidades ativas/resgatadas, escrito após o voucher | cadastro da IBITI, por pessoa |
| Passo do usuário | entrar no sistema de resgate, escolher unidades, receber voucher, agendar | pedir a hospedagem |
| Cancelamento | ajuste do contador pela carteira administrativa | anotação no cadastro |
| Vocabulário na interface | "disponíveis para resgate" / "já resgatadas" | "hospedagens disponíveis" |
| Contrato | `markRedeemed` obrigatório a cada uso | v1 publicada permanece legada; v2 publicada remove o resgate e seus contadores |
| Contador on-chain público | total de hospedagens usadas verificável | não existe na v2; o histórico de hospedagens é off-chain |
| Transferência secundária | unidades usadas viajam marcadas; sem gasto duplo por construção | exige regra explícita (abaixo) |

## Por que este formato

- A **jornada assistida é a principal** e a persona Helena não tolera unidade, queima ou resgate.
- **P0 do guia de comunicação**: o essencial em 30 segundos. O formato anterior gerou copy "absurdamente
  complexa", por causa dos dois estados do saldo.
- **P9**: honestidade sobre o que é centralizado. A verificação de identidade, o vínculo pessoa–carteira e
  as reservas já estavam fora da blockchain; o uso da hospedagem passa a ficar com eles.
- **Menor complexidade de sistema.** Sem portal de resgate, sem voucher, sem lógica de mover unidades
  ativas e depois resgatadas.
- **Cancelamento reversível**, o que em hotelaria de luxo é rotina.
- **Compatibilidade operacional com a v1**, sem chamar resgates; a v2 remove o código legado.

Custo assumido: a blockchain deixa de comprovar o uso por si (a face mais fraca para a persona Beatriz), e
o "token que ao ser gasto se transmuta em ativo" do TAPI passa a ser lido como "cota que dá direito", não
como consumo on-chain. Não há espelho de hospedagens no contrato vigente; transparência de uso depende do histórico off-chain.

## Matriz de tradeoffs que fundamentou a decisão

Três formatos foram avaliados após o debate em sala de 04/09/2026. Legenda: ● forte · ◐ médio · ○ fraco.

| Critério | 1 · Token único, uso marcado por carteira (v1) | 2 · Dois tokens: royalty+membership e diária queimável | 3 · Token único, uso vinculado à pessoa (adotado) |
|---|---|---|---|
| Modelo mental do comprador | ◐ uma coisa na carteira, com dois estados | ○ duas coisas na carteira, regras diferentes | ● "sou apoiador, tenho uma cota, ela me dá N hospedagens" |
| Fluxo de reserva | ◐ cinco passos, com voucher | ◐ três a quatro passos, um deles uma transação | ● dois passos, como num clube |
| Cancelar ou remarcar | ● reversível | ○ queima é irreversível; exige cunhar de novo, o que contradiz a emissão única | ● reversível |
| Transferir para outro membro | ◐ funciona, mas unidades usadas viajam e confundem | ● claro: diária usada não existe mais | ○ exige regra explícita |
| O que aparece na carteira | ◐ um saldo; estados só no portal | ○ dois saldos, dois contratos | ● um saldo, nada a interpretar |
| Ação on-chain do usuário no uso | ● nenhuma | ○ assinatura ou aprovação de queima | ● nenhuma |
| Complexidade do sistema | ○ a maior: portal, voucher, contador, lógica de transferência | ◐ dois contratos simples; emissão casada e queima | ● a menor: contrato de membership e royalty, mais um cadastro |
| Verificabilidade pública | ● uso na blockchain | ● supply de diárias cai a cada uso | ○ depende do histórico off-chain |
| Fidelidade ao TAPI ("token gasto vira ativo") | ◐ por interpretação | ● literal | ○ cota que dá direito |
| Fidelidade às decisões do grupo | ● é o decidido | ○ reverte D1 | ◐ mantém D1 e D2; muda D5 |
| Retrabalho nos artefatos | ● nenhum | ○ quase tudo | ◐ v2 remove resgates; guia, whitepaper e BPMN simplificam |
| Risco dominante | usuário não entender os dois estados | cancelamento e emissão casada | uso duplo numa transferência secundária sem regra |

Por persona: Helena prefere 3; Beatriz prefere 2, depois 1; Gabriel prefere 2. A jornada assistida ser a
principal decidiu.

A variante do formato 1 "por ID de token num banco" foi **descartada por incompatibilidade com ERC-20**:
unidades fungíveis não têm identidade rastreável numa transferência (se uma carteira com três unidades,
uma usada, envia duas, nada diz quais foram). Seria um ERC-721 disfarçado, já rejeitado pelo grupo.

## Decisões consolidadas em 11/09/2026

1. O contador on-chain foi removido na v2 publicada. A v1 permanece histórica, sem uso do contador.
2. A política confirmada move somente cotas livres nas transferências, até a quantidade de IBT transferidos. Cotas utilizadas não reaparecem; reservas permanecem com o solicitante. O contrato verifica posse por carteira, não identidade civil.
3. Cada IBT origina uma experiência por toda a emissão, sem renovação. O projeto definiu 3 noites para até 5 pessoas, com os serviços comuns da hospedagem.
4. Cancelamento elegível restitui a mesma cota após conciliação. Prazo e cancelamento tardio/no-show estão em definição; faixas adicionais de benefícios não são prometidas.
5. A comparação de custódia está em análise; foi recomendada autocustódia assistida. O valuation será revisado por outro integrante.

## Referências históricas a harmonizar nos artefatos externos

- **Whitepaper**: a revisão em `whitepaper/whitepaper_ibiti_revisado.md` já incorpora o modelo atual; cópias externas precisam ser substituídas.
- **Guia de comunicação**: telas A6 e A7 (resgate e voucher), vocabulário "disponíveis para resgate / já
  resgatadas", catálogo de mensagens ligado a `markRedeemed`.
- **Diagrama BPMN**: fase 4 (voucher → `markRedeemed`).
- **`smart-contract/docs/premissas-e-pendencias.md`**: P13, e a rastreabilidade de D5 e D10.
