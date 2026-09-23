# 06 · Operação da IBITI (fora da blockchain)

> **Revisão final em 22/09/2026:** a Parte 2 agora usa IBIToken técnico v3, local. Teto pessoal on-chain, tesouraria separada, calendário civil, compra atômica e recuperação com 48h estão implementados. As descrições de 10–11/09 abaixo são histórico da Parte 1; consulte [05](05-contrato-inteligente.md) e a [matriz de evolução](../smart-contract/docs/evolucao-v1-v2.md) para o estado vigente.


> **Implementação em 10/09/2026:** consulte [10 · Implementação off-chain](10-implementacao-offchain.md). O software de cadastro e cotas já está neste repositório; aprovação, hotel e operação real da IBITI seguem pendentes. A política de cotas foi confirmada pelo responsável do projeto em 11/09/2026: uma experiência por IBT em toda a emissão, sem renovação; só direitos livres acompanham transferências. O contrato v1 mantém contadores legados, sem uso no fluxo atual.

O contrato é pequeno de propósito. A maior parte do que faz o projeto funcionar é operação da IBITI. Este
documento lista essas responsabilidades, no formato vigente ([03](03-uso-vinculado-a-pessoa.md)). Princípio
P9 do guia de comunicação: dizer com clareza o que é centralizado.

## 1. Verificação de pessoas

- Obrigatória para todos, antes da compra primária. Critérios de aprovação: documento de processo da
  IBITI, em aberto.
- Resultado: vínculo pessoa ↔ carteira, guardado no cadastro da IBITI. Nunca vai para a blockchain.
- Aplica-se também a quem recebe unidades por transferência (que, por construção, já é membro) e a quem
  recebe por reemissão (herdeiro).

## 2. Conversa inicial e venda primária

- Apresentar o que a cota dá, o preço (só aqui, nunca na landing), a guarda e o calendário 2027–2030.
- Receber o pagamento em reais (jornada assistida) e registrar a compra no contrato com um hash da venda.
- Respeitar o teto de 20 unidades por pessoa e a reserva de 50 unidades.

## 3. Guarda de carteiras (jornada assistida)

- A IBITI, ou um custodiante a definir, guarda a carteira e opera transferências e saques em nome da
  pessoa. A pessoa nunca vê chave, gas ou transação.
- Em aberto: quem é o custodiante e como se formaliza.

## 4. Cadastro de hospedagens (formato vigente)

- Por pessoa verificada: hospedagens disponíveis, usadas, reservas futuras, janelas exclusivas.
- Hipótese de trabalho: uma hospedagem por unidade detida; agregação de várias unidades em uma experiência
  maior a detalhar.
- Ao confirmar uma reserva, anotar o uso. Ao cancelar, desfazer. Processo pode ser manual no piloto.
- Ao registrar uma transferência entre membros, anotar o destino das hospedagens não usadas conforme a
  regra que o grupo definir (em aberto).
- Não espelhar o uso no contrato: o livro de cotas off-chain é a fonte do consumo. A v2 remove `markRedeemed`.

## 5. Apuração semestral

1. Receber do Glamping os 15% do faturamento bruto do semestre (diárias, alimentação e demais serviços; a
   composição exata das rubricas será confirmada com Mariana Reis).
2. Gerar o relatório do semestre e calcular seu hash.
3. Se houver stablecoin: converter o total, aprovar o contrato e publicar o faturamento com a carteira
   administrativa. O depósito acontece na mesma transação.
4. Se não houver: publicar o faturamento, pagar em reais e registrar cada pagamento no contrato.
5. Enviar a cada membro o extrato do semestre. Publicar os agregados no painel de transparência.

Oito apurações; a ordem é garantida pelo contrato, as datas são responsabilidade do financeiro.

## 6. Verificação de membros por parceiros do território

Qualquer parceiro consulta o contrato (`accessInfo`) e vê se uma carteira é membro, sem dado pessoal. O
vínculo carteira → pessoa, quando necessário, é confirmado pela IBITI.

## 7. Emergências e administração

- **Recuperação de acesso:** reemissão para nova carteira após processo de identificação fora da
  blockchain; a antiga é revogada.
- **Pausa de segurança:** quando acionar e quem decide, a documentar.
- **Chave administrativa:** guarda em carteira de hardware; rotação em dois passos; multiassinatura na v2
  (em aberto com a IBITI).
- **Redução da reserva:** só por decisão expressa.

## 8. Comunicação

Tudo o que a operação escreve segue o [Guia de Comunicação](../guia-de-comunicacao/README.md): tom de
anfitrião do território (sereno, claro, franco, discreto, nunca vendedor), terminologia oficial
([09](09-glossario.md)), mensagens do catálogo, extrato do semestre como peça canônica do royalty, painel
público só com agregados. Regra de ouro P0: o essencial em 30 segundos.
