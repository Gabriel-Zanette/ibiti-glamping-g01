# 09 · Glossário

> **Revisão em 22/09/2026:** o [glossário de domínio](../CONTEXT.md) prevalece sobre termos históricos abaixo em conflito, incluindo datas fixas, sucessão como recuperação e entrada apenas por compra primária. A [entrevista atual](../docs/decisoes/2026-09-22-governanca-e-operacao.md) registra propostas e questões abertas.

> **Implementação em 10/09/2026:** consulte [10 · Implementação off-chain](10-implementacao-offchain.md). O software de cadastro e cotas já está neste repositório; aprovação, hotel e operação real da IBITI seguem pendentes. A política de cotas foi confirmada pelo responsável do projeto em 11/09/2026: uma experiência por IBT em toda a emissão, sem renovação; só direitos livres acompanham transferências. O contrato v1 mantém contadores legados, sem uso no fluxo atual.

Dois registros, definidos no Guia de Comunicação: o da **interface** (o que a pessoa lê na tela e ouve do
concierge) e o dos **documentos e do contrato** (whitepaper, código, docs técnicas). Atualizado para o
formato vigente ([03](03-uso-vinculado-a-pessoa.md)).

| Termo na interface | Termo em documentos / contrato | Significado |
|---|---|---|
| cota de apoiador, unidade | IBIToken, unidade, `units` | uma unidade do ativo: membership + fração do royalty + direito a uma hospedagem |
| apoiador, membro | portador, `holder` | pessoa verificada que detém ao menos uma unidade |
| Passaporte IBITI | membership, `isMember` | condição de membro, derivada da posse, dentro da validade |
| hospedagem | experiência | a estadia no Glamping a que cada unidade dá direito |
| hospedagens disponíveis / usadas | direito de uso registrado no cadastro da IBITI | quantas a pessoa ainda pode pedir; antes: "disponíveis para resgate / já resgatadas" |
| pedir hospedagem | (sem equivalente on-chain no formato vigente; antes: resgate, `markRedeemed`, voucher) | a pessoa pede, a IBITI confere e confirma |
| sua parte do royalty | fração do royalty, `royaltyDue` | 15% do faturamento bruto ÷ 150 por unidade |
| apuração do semestre | período, `reportRevenue` | publicação semestral do faturamento e cálculo do devido |
| faturamento bruto reportado | `grossRevenue` | receita integral do Glamping no semestre, informada pela IBITI |
| relatório assinado + impressão digital | `reportHash` | o relatório fica fora da chain; o hash fica no contrato |
| extrato do semestre | — | peça canônica: faturamento, sua parte, como foi paga |
| registro público | blockchain, Ethereum, Sepolia | onde ficam saldos, travas e apurações |
| carteira guardada pela IBITI | custódia, jornada assistida | a IBITI (ou custodiante) opera pela pessoa |
| carteira própria | jornada expert, self-custody | a pessoa opera sozinha |
| enviar unidades para outro membro | transferência, `transfer`, `_update` | só para quem já tem saldo, até 20 |
| recuperação de acesso | reemissão, `reissue` | perda de chave ou sucessão |
| pausa de segurança | `pause` | congela tudo temporariamente |
| emissão 2027–2030 | validade, `validFrom` / `validUntil` | os quatro anos do piloto |
| reserva da IBITI | `reservedUnits` | 50 unidades fora de venda |
| máximo por pessoa | agregado no cadastro; `maxPerWallet` limita cada carteira | 20 unidades; o contrato isolado não limita CPF |
| conversa inicial | — | onde o preço é apresentado; nunca na landing |
| verificação | KYC, filtro ético | feita pela IBITI antes da compra |

## Termos do domínio

- **IBITI / Ibiti Projeto:** a empresa e o ecossistema de turismo regenerativo. Parceiro do Inteli.
- **Território:** ~6 mil hectares em Conceição do Ibitipoca (MG), majoritariamente em regeneração.
- **Glamping:** IBITI Glamping, empreendimento de hospitalidade de luxo, investimento de terceiro.
- **Royalties do território:** 30% (investimento da IBITI) ou 15% (investimento de terceiro) sobre o
  faturamento das operações no território.
- **Residentes:** trabalhadores dos empreendimentos. **Hóspedes:** quem paga diárias; perfil médio de alta
  renda.
- **Utility token:** token de uso, não de investimento; aqui, dá acesso a experiência e membership.
- **ReFi:** finanças regenerativas; aqui, financiar a regeneração da mata pela circulação de valor.
- **Stablecoin:** token com valor atrelado a uma moeda; meio de pagamento do royalty (em aberto qual).
- **Pull × push:** o portador saca (pull) em vez de receber envio automático (push).
- **TAPI:** documento formal do projeto parceiro no Inteli. **PBL:** aprendizagem baseada em projetos.
- **Sepolia:** rede de testes do Ethereum, usada no piloto.
