# 04 · Jornadas e fluxo ponta a ponta

> **Implementação em 10/09/2026:** consulte [10 · Implementação off-chain](10-implementacao-offchain.md). O software de cadastro e cotas já está neste repositório; aprovação, hotel e operação real da IBITI seguem pendentes. A política de cotas foi confirmada pelo responsável do projeto em 11/09/2026: uma experiência por IBT em toda a emissão, sem renovação; só direitos livres acompanham transferências. O contrato v1 mantém contadores legados, sem uso no fluxo atual.

O fluxo técnico completo, com todas as funções, travas e eventos do contrato, está em
`diagrama-de-fluxo/` no diretório de origem `ibiti-token` (BPMN 2.0, nove fases). Este documento conta o
mesmo fluxo do ponto de vista de quem participa, já no formato vigente de uso vinculado à pessoa
([03](03-uso-vinculado-a-pessoa.md)). Onde o BPMN e o guia ainda mostram voucher e resgate, vale este texto.

## Quem participa

| Ator | O que faz | Onde age |
|---|---|---|
| Apoiador (membro) | descobre, é verificado, compra, hospeda-se, recebe o royalty, pode enviar unidades a outro membro | jornada assistida (padrão) ou expert |
| IBITI (operação) | verifica pessoas, vende, guarda carteiras na jornada assistida, registra usos, apura o semestre, resolve emergências | sistemas próprios + carteira administrativa |
| Glamping (operador) | opera a hospedagem e repassa 15% do faturamento bruto à IBITI | fora da blockchain |
| Contrato IBIToken | guarda saldos, travas, períodos e royalties; responde a consultas | Ethereum (Sepolia no piloto) |
| Parceiro do território | verifica se alguém é membro | consulta pública ao contrato |
| Público | acompanha agregados no painel de transparência | consulta pública |

## Fase 0 · Emissão (uma vez)

A IBITI implanta o contrato com os parâmetros do piloto: 150 unidades, reserva de 50, teto de 20, validade
de 01/01/2027 a 31/12/2030. Todo o supply nasce na carteira administrativa. Não há segunda emissão.

## Fase 1 · Descoberta, conversa inicial e verificação

1. A pessoa conhece o projeto pela landing ou por indicação. Conforme decisão do usuário em 16/09/2026,
   a landing parte da experiência e do pertencimento, apresenta benefícios, apoio ao território e números
   essenciais, e **mostra o valor integral de referência de R$ 37.055,19 por IBT**, com dois CTAs: aquisição
   e detalhes. A escassez corresponde à emissão de 150 e à colocação inicial de 100; não é estoque em tempo real.
2. A entrada da aquisição permite escolher a quantidade e conferir o total. A demonstração da interface
   usa dados fictícios, sem enviá-los ou salvá-los e sem cobrança. A operação real precisa confirmar
   disponibilidade, condições comerciais e guarda antes de concluir a compra.
3. **Verificação de identidade** pela IBITI, obrigatória para todos. É o filtro ético do projeto. Aqui
   nasce o vínculo pessoa–carteira, guardado fora da blockchain.

## Fase 2 · Aquisição

- **Assistida:** a pessoa paga em reais; a IBITI cria ou guarda a carteira e registra a compra primária
  no contrato (até 20 unidades por pessoa). A pessoa recebe a confirmação e o acesso ao Passaporte.
- **Expert:** a pessoa informa a própria carteira; a IBITI registra a compra primária para ela.

A compra primária é a única porta de entrada: uma carteira sem saldo só recebe da carteira administrativa.

## Fase 3 · Posse e Passaporte IBITI

Desde a compra a pessoa é membro. Qualquer parceiro do território confere isso consultando o contrato
(saldo, validade), sem ver dado pessoal. O Passaporte dá janelas exclusivas, prioridade de reserva, acesso
a eventos e rituais e experiências em outros empreendimentos do território.

## Fase 4 · Hospedagem (formato vigente)

1. A pessoa pede a hospedagem ao concierge ou pelo portal.
2. A IBITI confere no contrato que a carteira vinculada tem saldo e está na validade.
3. A IBITI confere no cadastro quantas hospedagens a pessoa ainda tem e o que pode reservar.
4. A IBITI confirma e anota o uso. Cancelar ou remarcar desfaz a anotação.
5. O uso permanece no histórico off-chain; não há transação nem espelhamento no contrato.

Sem voucher, sem transação do usuário, sem estados na tela.

## Fase 5 · Envio de unidades a outro membro

A pessoa (ou o custodiante por ela) transfere unidades para outra carteira que **já tem saldo**, até o
teto de 20 no destino. O membership e o royalty acompanham a unidade. O que acontece com hospedagens
ainda não usadas está em aberto (03). O contrato rejeita: destino sem saldo, teto excedido, fora da
validade, carteira revogada, contrato em pausa.

## Fase 6 · Apuração semestral do royalty

1. O Glamping repassa à IBITI 15% do faturamento bruto do semestre.
2. O financeiro da IBITI apura, gera o relatório e publica o valor no contrato com o hash do relatório.
3. O contrato calcula os 15%, fotografa os saldos e registra o valor devido por carteira.
4. Com stablecoin: o total é depositado na mesma transação e cada portador saca (o custodiante saca na
   jornada assistida). Sem stablecoin: a IBITI paga em reais e registra o pagamento.
5. A pessoa recebe o **extrato do semestre**: faturamento reportado, sua parte, como foi paga.

Oito apurações em quatro anos. A nona é rejeitada pelo contrato.

## Fase 7 · Administração e emergências

- **Recuperação de acesso:** perda de chave ou sucessão. A IBITI reemite o saldo numa nova carteira, leva
  os royalties pendentes, revoga a antiga.
- **Pausa de segurança:** congela transferências, compras, registros, reportes e saques.
- **Troca da carteira administrativa** em dois passos; renúncia desabilitada.
- **Redução da reserva:** só por decisão expressa da IBITI, e só para baixo.

## Fase 8 · Encerramento (31/12/2030)

As três faces se extinguem. Não há mais transferências nem hospedagens. O contrato v1 limita o número de reportes, não suas datas; os saques pendentes seguem possíveis. Continuidade é decisão futura da IBITI.

## As telas da jornada (guia de comunicação)

| Tela | Momento | Situação após 10/09/2026 |
|---|---|---|
| A1 | descoberta (landing) | revisada em 16/09/2026; preço e dois CTAs |
| A2 | verificação | válida |
| A3 | aquisição (quantidade e valor total) | entrada demonstrativa revisada em 16/09/2026; preço também na landing |
| A4 | recebimento | válida |
| A5 | Passaporte | válida |
| A6, A7 | resgate e voucher | **substituir por "pedir hospedagem"** |
| A8 | extrato do semestre | válida |
| A9 | envio a outro membro e erros | válida; revisar o texto sobre hospedagens não usadas |
| A10 | recuperação de acesso | válida |
| A11 | pausa | válida |
| E1, E2 | jornada expert | válidas |
| P1 | parceiro do território | válida |
| T1 | painel público | válida; hospedagens usadas vêm do histórico off-chain |
