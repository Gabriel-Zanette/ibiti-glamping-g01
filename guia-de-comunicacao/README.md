# Guia de Comunicação — IBIToken (IBITI Glamping)

> **Artefato:** Guia de Comunicação da operação tokenizada · **Módulo:** ADMD7 — Blockchain, criptomoedas e
> tokenização de ativos · Inteli · **Projeto parceiro:** IBITI (Ibiti Projeto) · **Grupo G01** · Sprint 3
> **Base:** Whitepaper Técnico do Ativo Digital (Sprint 2), Entendimento da Experiência do Usuário (Sprint 1),
> Riscos Éticos e Impacto (Sprint 2) e a implementação v1 do contrato IBIToken (`smart-contract/`).
> **Formato:** este documento + landing page ([`landing/index.html`](landing/index.html)) + board visual com o
> fluxo compra → recebimento → resgate ([`board/index.html`](board/index.html)) + telas em SVG e PNG
> (`mockups/`) + tasks para o issue board. **Versão 1.3 (02/09/2026):** landing de página única com cinco seções em
> tópicos, animação de rolagem e cena do território, mais três páginas de detalhe (como funciona, perguntas,
> transparência); referências de mercado na seção 13.

Este guia define **como a operação tokenizada do IBITI Glamping fala**: com quem apoia, com quem opera, com os
parceiros do território e com o público. Ele cobre a narrativa institucional, os princípios de comunicação, o
tom de voz, a terminologia, os padrões de texto da interface, as mensagens do sistema (erro, confirmação,
feedback) e a forma de apresentar dados, apurações e resultados — sempre com exemplos ligados aos fluxos reais
da solução e às regras que o contrato inteligente de fato aplica.

**Como usar.** Quem escreve qualquer texto da operação — página pública, e-mail, tela, mensagem de sistema,
relatório, resposta do concierge — consulta, nesta ordem: a seção 5 (terminologia), a seção 4 (tom por
momento), a seção 7 (mensagens prontas) e o checklist da seção 11. O board visual mostra as mesmas decisões
aplicadas às telas.

---

## 1. O que estamos comunicando

### 1.1 O ativo, em uma frase

> O IBIToken é a **cota de quem apoia o território IBITI** enquanto o Glamping ainda é projeto: cada unidade
> reserva **uma experiência de hospedagem no Glamping**, torna o portador **membro do Passaporte IBITI** e lhe dá
> **uma fração do royalty** que o território recebe quando o Glamping opera, por quatro anos (2027–2030).

Toda comunicação parte dessa frase e da **hierarquia de valor** decidida com o parceiro (whitepaper §5.2):

1. **A experiência** — é o que se compra; nada a substitui.
2. **O retorno do valor aportado** ao longo dos quatro anos, pelas apurações semestrais do royalty — apresentado
   sempre como consequência da operação real, nunca como promessa.
3. **O reconhecimento como apoiador do projeto IBITI** — a captação vai para a IBITI e o ecossistema, não para a
   obra do Glamping, que é investimento do empreendedor terceiro.

### 1.2 O que o IBIToken é — e o que não é

| É | Não é |
|---|---|
| uma cota de apoiador com três faces inseparáveis (experiência, Passaporte, fração do royalty) | um investimento com retorno garantido, um título, uma ação ou uma cota de fundo |
| um registro público de pertencimento, verificável por qualquer parceiro do território | uma criptomoeda para negociar; não há mercado aberto — unidades só circulam entre membros verificados |
| um direito com prazo claro: emissão 2027–2030, oito apurações semestrais | uma promessa de continuidade: novas emissões são decisão futura da IBITI |
| um instrumento que antecipa à IBITI o valor do royalty que só existiria com o Glamping em operação | o financiamento da construção do Glamping |
| indivisível: 1 unidade = 1 experiência + fração do royalty + Passaporte | fracionável, "staking", rendimento anual ou qualquer mecânica especulativa |

Essa tabela é a **régua de honestidade** de tudo o que se escreve: se um texto sugere algo da coluna da direita,
ele está errado, por mais atraente que soe.

### 1.3 Os problemas de comunicação que precisamos resolver

O diagnóstico da Sprint 1 identificou o **"vale de confiança"** da jornada: a etapa em que o interessado pesquisa
sobre tokens, contratos e carteiras e fica nervoso. Cada persona chega a esse vale com um medo diferente:

| Persona (Sprint 1) | Medo dominante | O que a comunicação precisa provar |
|---|---|---|
| **Helena** — hóspede AAA, jornada assistida | reputacional ("manchete cripto"), exposição pública, golpes | que é um gesto de pertencimento e legado, conduzido por pessoas que ela conhece, sem jargão e sem exposição |
| **Beatriz** — investidora de impacto, family office | greenwashing, reclassificação regulatória, governança opaca | a trilha do dinheiro até o território, os limites ditos com clareza e dados auditáveis |
| **Gabriel** — cripto‑nativo, jornada expert | abstração excessiva que esconde o contrato, chaves de administrador, liquidez | o endereço do contrato verificado, as regras imutáveis e a honestidade sobre o que é centralizado |

A resposta comunicacional não é escolher uma persona: é **dizer a mesma verdade em duas profundidades** (seção 3,
princípio 8). O mesmo fato — "suas 3 unidades foram registradas" — aparece para Helena como "estão no seu
Passaporte" e, para Gabriel, com a transação e o endereço do contrato a um toque de distância.

### 1.4 Stakeholders e mensagens‑chave

| Stakeholder | O que precisa entender | Mensagem‑chave | Prova que sustenta | Canal e profundidade |
|---|---|---|---|---|
| Apoiadores da jornada assistida | o que recebem, quando, e que estão protegidos | "Você apoia o território; o território te recebe." | concierge, extrato semestral, Passaporte na plataforma | plataforma com blockchain invisível, e‑mail, atendimento humano |
| Apoiadores de impacto | de onde vem o valor e onde estão os limites | "Cada real tem origem, data e documento." | apuração com hash do relatório, painel de transparência, whitepaper | data room, relatório semestral, painel público |
| Apoiadores expert | que as regras estão no código e são verificáveis | "O contrato é público; as regras não mudam depois da venda." | contrato verificado, eventos, documentação técnica | camada técnica da plataforma, GitLab, exploradores |
| Equipe IBITI (concierge, financeiro, direção) | o que dizer, com que palavras, em cada situação | "Uma palavra para cada coisa." | este guia, catálogo de mensagens, roteiros | playbook interno, treinamento |
| Empreendedor do Glamping | como a experiência resgatada chega à operação | "O voucher é a reserva; o registro é a confirmação." | fluxo de resgate, `accessInfo` | procedimento operacional |
| Parceiros do território (eventos, outros empreendimentos) | como conferir um membro sem depender da IBITI | "Membro é quem tem unidade — e você mesmo confere." | consulta pública do contrato | guia de verificação de uma página |
| Comunidade local e imprensa | o que é e o que não é | "Não é investimento; é apoio ao território, com uma experiência e uma fração do royalty." | posicionamento, perguntas frequentes | texto institucional, porta‑voz |
| Reguladores e assessoria jurídica | que se trata de modelagem, sem oferta pública real | linguagem prudente, sem classificação jurídica definitiva | whitepaper §11, este guia | documentação formal |

---

## 2. Posicionamento e narrativa institucional

### 2.1 Declaração de posicionamento

> Para quem já vive o território IBITI ou quer apoiá‑lo enquanto o Glamping nasce, o **IBIToken** é a cota de
> apoiador que reúne uma experiência de hospedagem reservada, a condição de membro do Passaporte IBITI e uma
> fração do royalty que o território recebe do Glamping. Diferente de uma diária pré‑vendida, de uma cota de
> sociedade ou de um clube de vantagens, ele registra o pertencimento em um livro público, com regras que não
> mudam depois da compra — e diz, com a mesma clareza, o que não é.

### 2.2 A narrativa em três movimentos

1. **O território** — seis mil hectares na Serra da Mantiqueira, quase todos em regeneração; a receita dos
   empreendimentos é o que financia a regeneração. (Não começamos pelo token.)
2. **O Glamping e a cota** — o empreendimento nasce com capital de um empreendedor; o território recebe 15% do
   faturamento. Quem apoia agora antecipa esse valor à IBITI e recebe experiência, pertencimento e fração do
   royalty por quatro anos.
3. **As regras, ditas inteiras** — verificação para entrar, no máximo 20 unidades por membro, unidades só
   circulam entre membros, oito apurações semestrais com relatório assinado, encerramento em 2030. E o que
   fica fora: promessa de retorno, mercado aberto, continuidade garantida.

Ordem obrigatória em qualquer peça de mais de um parágrafo: território → cota → regras. Nunca abrir com
tecnologia.

### 2.3 Frases que usamos e frases que não usamos

| Usamos | Não usamos |
|---|---|
| "apoiar o território", "cota de apoiador", "membro do Passaporte IBITI" | "invista no IBIToken", "oportunidade", "rentabilidade", "valorização" |
| "sua fração do royalty do território" | "dividendo", "rendimento", "yield", "APY", "lucro" |
| "as regras não mudam depois da compra" | "garantido", "seguro", "sem risco" |
| "registrado no registro público (blockchain)" | "on‑chain", "descentralizado", "trustless", "Web3" como argumento |
| "a IBITI verifica quem entra" | "KYC", "compliance", "whitelist" (fora da camada técnica) |
| "encerra em 31/12/2030" | "expira", "queima", "leva", "temporada" |
| "uma experiência de hospedagem no Glamping" | "diária grátis", "brinde", "benefício exclusivo" |
| "hipótese de modelagem" (para projeções) | "projeção de retorno", "estimativa de ganhos" |

---

## 3. Princípios de comunicação

Cada princípio tem um posicionamento e um exemplo aplicado a um fluxo real. Eles valem para textos
institucionais, interface, e‑mails e atendimento.

**P0 · Regra de ouro: o essencial em trinta segundos.**
Quem chega precisa entender, sem ler muito, o que é, o que recebe, como usa e como compra. Uma frase de
contexto, no máximo três itens por bloco, um botão por tela. O detalhe (whitepaper, regras completas, camada
técnica) fica a um toque, nunca na frente. Vale para a landing page, para cada tela e para cada e‑mail.
*Aplicado:* a landing page é uma página única com cinco seções — Início, Em números, Como comprar, Como usar,
O que não é — cada uma com um título, até cinco tópicos de uma linha e um botão, uma seção por rolagem. Nenhuma
seção explica o que é um token ou como a blockchain funciona: isso fica nas páginas de detalhe (Como funciona,
Perguntas frequentes, Transparência), a um clique.

**P1 · A experiência vem primeiro; o dinheiro é dito com sobriedade.**
A ordem das informações em qualquer tela ou peça segue a hierarquia de valor: experiência → Passaporte →
royalty. Dinheiro aparece com números completos, base e data, sem adjetivos.
*Aplicado:* na tela de aquisição, o bloco "O que você recebe" lista primeiro "1 experiência de hospedagem no
Glamping por unidade", depois "Passaporte IBITI" e por último "fração do royalty do território (apurações
semestrais 2027–2030)". O preço aparece como "R$ 53.008,93 por unidade — valor de referência do modelo,
hipótese a confirmar", nunca como "a partir de".

**P2 · Dizer o que é e o que não é.**
Toda peça de entrada (página pública, tela de aquisição, e‑mail de boas‑vindas) traz a tabela "é / não é"
resumida. Projeções são rotuladas como hipótese; limites são ditos antes da compra, não depois.
*Aplicado:* abaixo do botão "Confirmar aquisição": "Não é um investimento com retorno garantido. Os valores do
royalty dependem do faturamento real do Glamping e podem ser menores do que qualquer cenário. Unidades só
circulam entre membros verificados."

**P3 · Blockchain invisível por padrão, verificável sob demanda.**
Na jornada assistida, nenhuma tela obriga a ver endereços, hashes ou transações; mas toda tela que registra algo
tem um link discreto "Ver no registro público" que abre a camada técnica. Na jornada expert, a camada técnica
está sempre visível.
*Aplicado:* a confirmação "Suas 3 unidades estão no seu Passaporte IBITI" mostra, recolhido, "Detalhes técnicos:
transação 0x8f2a…c41d · contrato IBIToken (verificado)".

**P4 · Uma palavra para cada coisa.**
Cada conceito tem um único termo (seção 5). Nunca alternar sinônimos ("resgatar" / "usar" / "consumir");
nunca usar o nome do erro do contrato para o membro.
*Aplicado:* o contrato chama de `markRedeemed`; a interface sempre diz "resgatar"; o atendimento também.

**P5 · Todo número tem origem e data.**
Nenhum valor aparece sozinho. Um número de royalty vem com o período, a base (faturamento bruto reportado), a
alíquota (15%), a fração (suas unidades de 150), o status e o documento que o sustenta (hash do relatório).
*Aplicado:* o extrato semestral (seção 8.2) é a única forma de apresentar royalty; nunca um "saldo de
rendimentos" solto.

**P6 · Orientar, não alarmar.**
Uma mensagem de erro diz o que aconteceu, por que a regra existe e qual é o próximo passo. Não culpa, não
pede desculpas vazias, não expõe jargão sem tradução. Erros de regra de negócio são explicados como regra
("cada membro pode ter no máximo 20 unidades"), não como falha.
*Aplicado:* `RecipientNotHolder` vira "Essa carteira ainda não faz parte da comunidade IBITI — unidades só
podem ser enviadas a membros verificados. Se a pessoa quiser participar, ela pode solicitar a verificação com a
IBITI."

**P7 · Discrição por padrão.**
Nunca mostrar dados de outros membros, rankings, nomes ou hábitos; endereços sempre truncados; e‑mails com
valores só quando o membro pediu. O perfil médio do hóspede exige a discrição de um hotel de luxo, e a LGPD
exige que nada pessoal vá ao registro público.
*Aplicado:* o painel de transparência mostra "12 membros", nunca a lista; o e‑mail do voucher não menciona
valores nem outros hóspedes.

**P8 · A mesma verdade em duas profundidades.**
Assistida e expert compartilham fatos, números e termos; diferem só na camada técnica e no vocabulário de
carteira. Nunca há uma "versão simplificada" com informação a menos — há uma versão com a técnica recolhida.
*Aplicado:* a apuração do semestre mostra os mesmos valores nas duas jornadas; a expert acrescenta o hash, o
evento `RevenueReported` e o botão "Sacar para minha carteira" no lugar de "Será depositado na conta cadastrada".

**P9 · Honestidade sobre o que é centralizado.**
A IBITI administra o contrato e reporta o faturamento. Isso é dito, não escondido: "A IBITI apura e publica; o
contrato calcula e registra; qualquer pessoa confere." Prometer descentralização que não existe destruiria a
confiança de Gabriel e de Beatriz ao mesmo tempo.

---

## 4. Tom de voz

### 4.1 Definição

A voz da operação é a de um **anfitrião do território**: calma, precisa, calorosa e sem pressa. Fala como quem
recebe alguém em casa e explica as regras da casa com naturalidade. Quatro adjetivos guiam a escrita —
**sereno, claro, franco, discreto** — e um contraponto: **nunca vendedor**.

| Dimensão | Onde a voz fica | Como se manifesta |
|---|---|---|
| sério ↔ bem‑humorado | sério, com calor humano | sem piadas, sem exclamações em série; calor vem da hospitalidade, não do entusiasmo |
| formal ↔ informal | formal‑leve; "você" | frases curtas, sem "prezado", sem gírias; nomes próprios quando o contexto é humano (concierge) |
| respeitoso ↔ irreverente | respeitoso | trata o membro como adulto capaz de decidir; explica, não tutela |
| entusiasmado ↔ objetivo | objetivo | entusiasmo só em dois momentos: a chegada ao Passaporte e o dia da experiência |

### 4.2 Tom por momento da jornada

| Momento | Tom | Exemplo de frase |
|---|---|---|
| Descoberta | convidativo e concreto | "Seis mil hectares em regeneração. O Glamping nasce em 2027. Você pode apoiar o território agora." |
| Verificação | respeitoso e explicativo | "Quem apoia o IBITI, a IBITI conhece. A verificação leva até 5 dias úteis e é feita pela nossa equipe." |
| Aquisição | claro, sem pressão | "Escolha quantas unidades quer adquirir — de 1 a 20. Nada é cobrado até você confirmar." |
| Recebimento | acolhedor, com celebração contida | "Suas 3 unidades estão no seu Passaporte IBITI. Bem‑vindo(a) à comunidade." |
| Posse / Passaporte | pertencimento | "Como membro, você tem prioridade nas janelas de reserva e acesso aos rituais do território." |
| Resgate | serviço de hospitalidade | "A equipe do Glamping vai combinar as datas com você em até 3 dias úteis." |
| Apuração e royalty | sóbrio, contábil | "Apuração do 1º semestre de 2027 publicada. Sua fração: R$ 10.196,22." |
| Erro | calmo e orientador | "Essa carteira ainda não faz parte da comunidade IBITI. Escolha outro membro ou indique a verificação." |
| Incidente / pausa | transparente e factual | "Pausamos envios, resgates e saques por segurança. Suas unidades e valores estão preservados." |
| Encerramento (2030) | grato e claro | "A emissão 2027–2030 se encerrou. Obrigado por ter apoiado o território. Seu histórico permanece registrado." |

### 4.3 A mesma mensagem para cada perfil

Fato: a apuração do semestre foi publicada e há R$ 10.196,22 para o membro.

- **Helena (assistida, por e‑mail do concierge):** "Helena, a apuração do primeiro semestre de 2027 foi
  publicada. Sua fração do royalty do território é de R$ 10.196,22 e será depositada na conta cadastrada até
  15/07. O extrato completo está no seu Passaporte."
- **Beatriz (impacto, na plataforma):** "Apuração do 1º semestre de 2027. Faturamento bruto reportado
  R$ 3.398.738,38 · royalty do território (15%) R$ 509.810,76 · sua fração (3 de 150 unidades) R$ 10.196,22 ·
  relatório assinado pela IBITI: a91f…c2e0 (conferir)."
- **Gabriel (expert, na plataforma):** o mesmo bloco de Beatriz, mais "Evento `RevenueReported` · período 1 ·
  transação 0x5be1…7a90" e o botão "Sacar R$ 10.196,22 para minha carteira".

### 4.4 Assim, não assim

| Assim | Não assim | Por quê |
|---|---|---|
| "Suas 3 unidades estão no seu Passaporte IBITI." | "Parabéns! Seus tokens foram mintados com sucesso 🎉" | jargão, entusiasmo artificial, emoji |
| "Cada membro pode ter no máximo 20 unidades." | "Erro: WalletCapExceeded" | nome do erro do contrato não orienta |
| "Sua fração do royalty: R$ 10.196,22 (3 de 150 unidades)." | "Rendimento do período: R$ 10.196,22 (+6,4%)" | "rendimento" e percentuais anualizados sugerem investimento |
| "Valor de referência do modelo, hipótese a confirmar." | "Preço promocional de pré‑venda." | promoção contradiz a sobriedade e o preço fixo |
| "A IBITI apura e publica; o contrato calcula; você confere." | "Distribuição 100% automática e descentralizada." | promete o que o desenho não tem |
| "Pausamos por segurança. Suas unidades estão preservadas." | "Contrato pausado temporariamente." | fala do sistema, não do membro |

---

## 5. Terminologia

A regra é **uma palavra para cada coisa** — em dois registros que nunca se misturam na mesma tela: o da
**interface** (cotidiano: hospedagem, usada, sua parte do royalty) e o dos **documentos e do contrato**
(experiência, resgate, fração do royalty). A coluna "Termo do contrato" liga o vocabulário à implementação.

| Conceito | Termo adotado (interface, e‑mail, atendimento) | Evitar | Termo do contrato |
|---|---|---|---|
| O ativo | **IBIToken**; "unidade", "unidades" | moeda, coin, cripto, criptomoeda, ficha, token (sozinho) | `IBIToken` (IBT) |
| A natureza do ativo | **cota de apoiador** | investimento, ação, título, cota de fundo | — |
| Quem detém | **apoiador(a)**, **membro** | investidor, holder, cliente | `holders` |
| Condição de membro | **Passaporte IBITI**, "membro do Passaporte" | NFT, membership, VIP, tier | `isMember` |
| Direito de uso | **hospedagem** (interface) · **experiência** (documentos e whitepaper) | diária grátis, brinde, benefício, voucher | unidades ativas |
| Usar a experiência | **pedir hospedagem / usar** (interface) · **resgatar** (documentos e contrato) | queimar, burn, gastar, consumir, usar o token | `markRedeemed` |
| Estado das unidades | **hospedagens disponíveis / usadas** (interface) · **disponíveis para resgate / já resgatadas** (documentos) | ativas/resgatadas (interno), queimadas | `activeUnitsOf` / `redeemedUnitsOf` |
| Direito econômico | **sua parte do royalty** (interface) · **fração do royalty do território**, **apuração semestral** (documentos) | dividendo, rendimento, yield, juros, lucro, APY | `royaltyDue`, `reportRevenue` |
| Base do royalty | **faturamento bruto reportado** (diárias e consumo) | receita líquida, lucro, resultado | `grossRevenue` |
| Documento da apuração | **relatório assinado pela IBITI** e sua **impressão digital (hash)** | prova criptográfica, hash (sem explicar) | `reportHash` |
| Receber o royalty | **receber** (assistida) / **sacar para minha carteira** (expert) | claim, withdraw, resgatar (reservado à experiência) | `claimRoyalty` / `settleOffChain` |
| Onde o registro vive | **registro público (blockchain)** | on‑chain, ledger, "a blockchain", Web3 | Ethereum / Sepolia |
| O contrato | **contrato IBIToken (verificado)** — só na camada técnica | smart contract (assistida), protocolo | `IBIToken.sol` |
| Onde ficam as unidades | **carteira**; **carteira verificada**; **carteira guardada pela IBITI** (assistida) | wallet, custódia, seed phrase (assistida) | `balanceOf` |
| Circulação | **enviar unidades para outro membro** | transferir tokens, vender, mercado secundário, trade | `transfer` |
| Limite de posse | **no máximo 20 unidades por membro** (2 dos 15 pontos) | holding cap, teto (sozinho), 2% | `maxPerWallet` |
| Entrada | **verificação** (feita pela IBITI); **aquisição direta com a IBITI** | KYC, compliance, whitelist, compra primária (interno) | `primaryPurchase` |
| Perda de chave / herança | **recuperação de acesso** | reemissão, revogação (interno), reissue | `reissue`, `revoked` |
| Emergência | **pausa de segurança** | contrato pausado, freeze, halt | `pause` |
| Prazo | **emissão 2027–2030**; "encerra em 31/12/2030" | leva, temporada, lote, expira, validade (sozinha) | `validFrom` / `validUntil` |
| Custo de transação (expert) | **taxa da rede** | gas, gwei | — |

**Formatos.** Unidades sempre inteiras ("3 unidades", nunca "3,0" ou "3 IBT" fora da camada técnica). Moeda:
"R$ 3.398,74". Datas: "15/07/2027"; períodos: "1º semestre de 2027". Endereços e hashes truncados com quatro
caracteres de cada lado e ação de copiar: "0x8f2a…c41d". Percentuais do royalty em **pontos** quando se fala da
divisão ("2 dos 15 pontos"), em **%** quando se fala da alíquota ("15% do faturamento bruto"). Horários com "h".

---

## 6. Padrões de microcopy e comunicação da interface

| Elemento | Padrão | Exemplo |
|---|---|---|
| Botão principal | verbo + objeto; diz o que acontece | "Confirmar", "Pedir hospedagem", "Enviar a outro membro", "Ver extrato" |
| Botão secundário | caminho de saída sem julgamento | "Voltar", "Escolher outro membro", "Falar com a IBITI" |
| Título de tela | substantivo do que a pessoa vai fazer ou ver | "Adquirir unidades", "Seu Passaporte", "Apuração do 1º semestre de 2027" |
| Subtítulo | consequência ou contexto em uma frase | "Nada é cobrado até você confirmar." |
| Rótulo de campo | acima do campo, sem dois‑pontos; ajuda abaixo com o porquê | "Quantidade de unidades" / "De 1 a 20 por membro" |
| Placeholder | exemplo de formato, nunca o rótulo | "Ex.: 0x8f2a…c41d" |
| Estado vazio | diz o que aparecerá e quando | "Nenhuma apuração publicada ainda. A primeira será em julho de 2027." |
| Carregando / pendente | o que está acontecendo e quanto tempo leva | "Registrando no registro público… cerca de 30 segundos." |
| Confirmação de ação irreversível | resumo + consequência + botão nomeado | "Enviar 2 unidades para Ana P. (0x3c1e…88ab)? Elas passam a pertencer a esse membro, com o mesmo estado (1 disponível, 1 já resgatada)." → "Confirmar envio" |
| Mensagem de sucesso | fato + próximo passo | "2 unidades enviadas. Elas já aparecem no Passaporte de Ana P." |
| Camada técnica | sempre recolhida na assistida, sempre visível na expert | "Detalhes técnicos ▸ transação · contrato · evento" |
| Notificação por e‑mail | assunto = fato; primeira linha = o que fazer | Assunto: "Voucher IBT‑2027‑0148 emitido" · "Guarde este código; a equipe do Glamping entra em contato em até 3 dias úteis." |
| Números | tabulares, com base e data (P5) | "R$ 10.196,22 · 3 de 150 unidades · 1º sem. 2027" |
| Linguagem | frases de até 15 palavras; uma ideia por frase; "você"; sem caixa alta; sem exclamação dupla; no máximo três itens por bloco e um botão por tela (P0) | — |
| Acessibilidade | contraste mínimo 4,5:1; foco visível; textos alternativos nos ícones; nunca cor como único sinal | ícone + texto em estados de erro |

Regras de layout de texto: hierarquia de três níveis por tela (título, informação principal, detalhe); o dado
mais importante para a decisão vem primeiro; termos técnicos aparecem só depois de um termo do glossário
("registro público (blockchain)").

---

## 7. Mensagens do sistema

Catálogo canônico. O board mostra as mesmas mensagens nas telas. Cada erro nasce de uma trava do contrato
(`smart-contract/contracts/IBIToken.sol`) ou de uma etapa fora da blockchain; cada confirmação nasce de um evento.

### 7.1 Erros — o que aconteceu, por que, próximo passo

| # | Gatilho | Título | Texto | Ação |
|---|---|---|---|---|
| E1 | `RecipientNotHolder` | Essa carteira ainda não é membro | Só membros verificados recebem unidades. Ela pode pedir verificação à IBITI. | Escolher outro membro |
| E2 | `WalletCapExceeded` | Limite de 20 unidades por membro | Com esse envio, Ana P. ficaria com 23. | Ajustar a quantidade |
| E3 | `InsufficientActiveUnits` | Você tem 1 hospedagem disponível | As outras 2 já foram usadas e continuam valendo Passaporte e royalty. | Pedir 1 hospedagem |
| E4 | `TokenNotYetValid` | Hospedagens a partir de 1º de janeiro de 2027 | Suas unidades já valem como Passaporte. | Ver meu Passaporte |
| E5 | `TokenExpired` | Esta emissão encerrou em 31/12/2030 | Não dá mais para enviar unidades nem pedir hospedagens. Valores ainda não recebidos continuam disponíveis. | Ver extrato |
| E6 | `WalletRevoked` | Esta carteira foi substituída | O acesso foi recuperado em outra carteira. Se você é o titular e não reconhece isso, fale com a IBITI agora. | Falar com a IBITI |
| E7 | `EnforcedPause` | Pausa de segurança | Pausamos envios, hospedagens e saques. Suas unidades e valores estão preservados. Avisamos por e‑mail quando voltar. | Entendi |
| E8 | `ERC20InsufficientBalance` | Você tem 3 unidades | Escolha até 3. | Ajustar |
| E9 | `NothingToClaim` | Nada a receber neste semestre | Sua carteira não tinha unidades na data da apuração. | Ver extrato |
| E10 | `PeriodNotOnChain` | Este semestre é pago na conta cadastrada | O extrato mostra a data prevista. | Ver extrato |
| E11 · operação IBITI | `ReserveProtected` | Reserva da IBITI protegida | Restam 65 unidades para venda; as 50 da reserva exigem decisão da direção. | Ver reserva |
| E12 · operação IBITI | `AllPeriodsReported` | As 8 apurações já foram publicadas | Esta emissão encerrou seu ciclo. | Ver histórico |
| E13 · expert | carteira não conectada | Conecte sua carteira | Use a carteira verificada pela IBITI. | Conectar |
| E14 · expert | rede errada | Troque para a rede Ethereum | Sua carteira está em outra rede. | Trocar de rede |
| E15 · expert | sem ETH para a taxa | Falta ETH para a taxa da rede | A taxa vai para a rede Ethereum, não para a IBITI. | Como obter ETH |
| E16 · expert | transação cancelada | Você cancelou na carteira | Nada foi alterado. | Tentar de novo |
| E17 · fora da chain | verificação não concluída | Não foi possível concluir sua verificação | Nossa equipe entra em contato para explicar os próximos passos. | Entendi |
| E18 | indisponibilidade | Não conseguimos consultar o registro público agora | Tente de novo em instantes. Suas unidades não são afetadas. | Tentar de novo |

### 7.2 Confirmações — fato + próximo passo

| # | Gatilho | Título | Texto |
|---|---|---|---|
| C1 | verificação concluída | Verificação concluída | Boas‑vindas à comunidade IBITI. Agora você pode adquirir unidades. |
| C2 | `PrimaryPurchase` | Pronto. Suas 3 unidades estão no seu Passaporte. | Hospedagens a partir de 01/01/2027; primeiro royalty no 1º semestre de 2027. |
| C3 | voucher emitido | Seu voucher IBT‑2027‑0148 foi enviado | Guarde o código. Entramos em contato em até 3 dias úteis para combinar as datas. |
| C4 | `RedemptionMarked` | Hospedagem registrada | 1 unidade usada em 18/03/2027. Ela continua valendo Passaporte e royalty. |
| C5 | Transfer · UnitsMoved | 2 unidades enviadas para Ana P. | 1 disponível e 1 usada. |
| C6 | `RevenueReported` | Royalty do 1º semestre de 2027 publicado | Sua parte: R$ 10.196,22 (3 de 150 unidades). |
| C7 | `RoyaltyClaimed` | R$ 10.196,22 na sua carteira | Pagos em stablecoin em 15/07/2027. Comprovante disponível. |
| C8 | `RoyaltySettledOffChain` | Pagamento registrado | R$ 10.196,22 na conta cadastrada em 15/07/2027. |
| C9 | `Reissued` | Acesso recuperado | 3 unidades (1 usada) e R$ 10.196,22 pendentes na nova carteira. A anterior foi desativada. |
| C10 | `Unpaused` | Operação retomada | Envios, hospedagens e saques voltaram. |

### 7.3 Andamento e estados

| # | Situação | Texto |
|---|---|---|
| F1 | verificação | Em análise — até 5 dias úteis. Avisamos por e‑mail. |
| F2 | pagamento (assistida) | Aguardando pagamento — os dados chegaram por e‑mail. Unidades registradas até 1 dia útil após a confirmação. |
| F3 | transação | Registrando… cerca de 30 segundos. |
| F4 | antes da validade | Hospedagens a partir de 01/01/2027. |
| F5 | próximo royalty | Próximo royalty: julho de 2027. |
| F6 | estado vazio | Você ainda não usou nenhuma hospedagem. |
| F7 | estado vazio | Nenhum royalty publicado ainda. O primeiro sai em julho de 2027. |
| F8 | carregando | Consultando o registro público… |
| F9 | voucher | Voucher IBT‑2027‑0148 · aguardando as datas do Glamping. |
| F10 | encerramento próximo | A emissão encerra em 31/12/2030. Você tem 2 hospedagens disponíveis até lá. |

---

## 8. Comunicação de dados, métricas e resultados

### 8.1 Princípios

1. **Base, fórmula, fonte e data** acompanham todo número (P5). Um valor de royalty nunca aparece sem o
   período, o faturamento bruto reportado, a alíquota, a fração do membro e o hash do relatório.
2. **"Sua parte" antes do total.** O membro vê primeiro o que lhe cabe; o total do território vem em seguida, como
   contexto — nunca como comparação com outros membros.
3. **Unidades inteiras, dinheiro com centavos, sem percentuais anualizados.** Não existe "rendimento de X% ao
   ano" na interface; existe "sua fração do royalty do 1º semestre de 2027". Projeções só aparecem no data room,
   rotuladas "hipótese de modelagem — não é promessa de retorno".
4. **Agregado é público; individual é privado.** O painel público mostra contagens e totais (membros, unidades
   emitidas, apurações publicadas, hashes); nunca endereços, nomes, reservas ou faturamento diário. É a resposta ao
   risco de transparência × sigilo do artefato de Riscos Éticos (§2.5).
5. **Impacto com mecanismo, não com adjetivo.** Quando se fala de regeneração, diz‑se o mecanismo (o royalty é a
   receita que financia a regeneração dos hectares) e usa‑se a métrica que a IBITI já publica para o território —
   não uma "métrica do token". Sem selos, sem "carbono neutro", sem números que o modelo não mede.
6. **Estados com forma, não só com número.** Disponível / pago / pendente / encerrado têm cor e ícone próprios,
   sempre acompanhados de texto.

### 8.2 O extrato do semestre (componente canônico do royalty)

| Ordem | Linha | Exemplo | Regra |
|---|---|---|---|
| 1 | Período | Apuração do 1º semestre de 2027 · publicada em 10/07/2027 | sempre com data de publicação |
| 2 | Sua fração | **R$ 10.196,22** | destaque tipográfico; é o número da decisão |
| 3 | Suas unidades na data da apuração | 3 de 150 | fração inteira; explica o cálculo |
| 4 | Faturamento bruto reportado | R$ 3.398.738,38 (diárias e consumo) | base, com o que inclui |
| 5 | Royalty do território (15%) | R$ 509.810,76 | alíquota explícita |
| 6 | Status | Disponível para receber · Pago em 15/07/2027 · Pendente | forma + texto |
| 7 | Meio de pagamento | Depósito na conta cadastrada (assistida) · Saque para sua carteira, em stablecoin (expert) | conforme a jornada |
| 8 | Relatório | Relatório assinado pela IBITI · impressão digital a91f…c2e0 · **Conferir o documento** | link para o documento e explicação do hash em um toque |
| 9 | Nota fixa | "A IBITI apura e publica o faturamento; o contrato calcula a divisão automaticamente; qualquer pessoa pode conferir." | P9 |

### 8.3 O Passaporte (dados de posse)

Mostra, nesta ordem: unidades (3) · disponíveis para resgate (2) · já resgatadas (1) · emissão 2027–2030 (encerra em
31/12/2030) · próxima apuração · benefícios do Passaporte em vigor (janelas de reserva, rituais e eventos,
experiências em outros empreendimentos, reconhecimento como apoiador). Nunca mostra "valor de mercado" das
unidades: não há mercado.

### 8.4 O painel de transparência (público)

Para Beatriz e para qualquer pessoa: unidades emitidas (150) · reserva da IBITI (50) · membros (12) · apurações
publicadas (2 de 8) com data, royalty apurado e hash de cada relatório · contrato verificado (endereço) ·
situação (em operação / pausa de segurança) · últimos registros (sem endereços). Cada linha tem "o que é isto?"
em linguagem simples.

### 8.5 O que nunca mostramos

Dados de hóspedes ou reservas individuais; faturamento diário ou por categoria de estadia; nomes ou endereços
completos de membros; rankings; "valorização"; percentuais anualizados; projeções sem o rótulo de hipótese;
gráficos de preço.

---

## 9. O fluxo, tela a tela (landing page e board visual)

A **landing page** ([`landing/index.html`](landing/index.html)) é uma página única com cinco seções em tópicos,
uma por rolagem: Início, Em números, Como comprar, Como usar e O que não é. Cada seção ocupa a tela inteira e
"encaixa" ao rolar (*scroll snap*); ao entrar, o conteúdo se revela em cascata, a cena do território ao fundo
(serra, névoa e sol) desliza em parallax e muda de tom do amanhecer ao entardecer, os números contam até o
valor final e o trilho dos passos se desenha. Barra de progresso e pontos no cabeçalho mostram onde a pessoa
está; com `prefers-reduced-motion` tudo aparece estático. O detalhamento fica em três páginas próprias, ligadas
da última seção: [`como-funciona.html`](landing/como-funciona.html), [`perguntas.html`](landing/perguntas.html)
e [`transparencia.html`](landing/transparencia.html).

O board ([`board/index.html`](board/index.html)) mostra as cinco seções da landing em celular (L1–L5), a
jornada assistida (A2–A11) e as variações; cada tela traz anotações com a decisão de comunicação. Tudo está
exportado em SVG (editável no Figma) e PNG em `mockups/` — seções da landing em desktop (1280×800) e celular
(390×844), páginas de detalhe inteiras e os quadros do board.

| Tela | Etapa | Intenção comunicacional | Princípios |
|---|---|---|---|
| L1 Início | landing · seção 1 | o nome da cota e quatro tópicos com os números; um botão; cena do território | P0, P1 |
| L2 Em números | landing · seção 2 | cinco números em cartões, contados ao entrar; preço como referência | P0, P5 |
| L3 Como comprar | landing · seção 3 | quatro passos num trilho que se desenha; link para o detalhe | P0, P6 |
| L4 Como usar | landing · seção 4 | quatro cartões com ícone: hospedagem, royalty, envio, acesso | P0, P4 |
| L5 O que não é | landing · seção 5 | quatro "não" em tipografia grande; cartão de contato com links para as páginas de detalhe | P0, P2 |
| Como funciona · Perguntas · Transparência | páginas de detalhe | o conteúdo explicativo, fora da landing: cota por dentro, passo a passo, custódia, extrato, FAQ, painel público | P2, P5, P9 |
| A2 Verificação | verificação | "vamos nos conhecer": prazo, três passos, quem guarda as unidades | P6, P7 |
| A3 Aquisição | aquisição | quantidade, preço de referência, o que recebe, pagamento, uma linha de honestidade | P0, P2, P5 |
| A4 Recebimento | recebimento | um fato e um botão; técnica recolhida | P3, P8 |
| A5 Passaporte | posse | unidades, hospedagens disponíveis e usadas, sua parte do royalty, benefícios em vigor | P1, P4 |
| A6 Hospedagem — pedir | resgate | hospedagem como serviço; "você tem 2 disponíveis"; agregação sob consulta | P4, P6 |
| A7 Hospedagem — voucher e registro | resgate | e‑mail do voucher; "hospedagem registrada", unidade "usada" | P4, P7 |
| A8 Extrato | apuração | sua parte, a base, o documento — sem percentual anualizado | P5, P9 |
| A9 Enviar a outro membro | circulação | confirmação com o estado das unidades; erros E1 e E2 como regras | P6 |
| A10 Recuperação de acesso | suporte | perda de chave e sucessão, sem pânico | P6, P7 |
| A11 Pausa de segurança | incidente | o que parou, o que não muda, data da atualização | P6, P9 |
| E1 Carteira própria | expert | contrato verificado, regras fixas, taxa da rede | P3, P8, P9 |
| E2 Saque do royalty | expert | o mesmo extrato, outra ação | P5, P8 |
| P1 Conferir membro | parceiro do território | sim ou não, sem dado pessoal | P7, P9 |
| T1 Painel público | público | agregados, hashes, situação | P5, P7, P9 |

---

## 10. Comunicação além da interface — modelos

**Comunicado de apuração (e‑mail semestral).** Assunto: "Apuração do 1º semestre de 2027 publicada". Corpo:
período · sua fração · suas unidades na data · como e quando recebe · link do extrato · uma linha sobre o
relatório e o hash · assinatura da direção financeira da IBITI. Sem adjetivos, sem comparação com semestres
anteriores além do número.

**Aviso de pausa de segurança.** Assunto: "Pausa de segurança na operação do IBIToken". Corpo: o que foi
pausado (envios, resgates, saques) · o que não muda (unidades, valores, Passaporte) · motivo em uma frase · o que
a IBITI está fazendo · quando volta a falar · canal de contato.

**Encerramento da emissão (2030).** Assunto: "A emissão 2027–2030 se encerra em 31/12/2030". Corpo: o que
termina (envios, resgates, Passaporte) · o que permanece (histórico, valores ainda não recebidos) · unidades
disponíveis para resgate até a data · agradecimento pelo apoio ao território · sem promessa de nova emissão.

**Guia do parceiro do território (uma página).** "Como conferir um membro": peça o endereço da carteira (ou o QR
do Passaporte) → consulte no painel → confira "membro: sim", unidades disponíveis → libere o benefício. Nunca
peça documentos; nunca registre o endereço.

**Roteiro do concierge (verificação recusada ou dúvida sobre cripto).** Reconhecer a preocupação · reafirmar
que é apoio ao território com uma experiência e uma fração do royalty · explicar que a IBITI guarda a carteira
por quem preferir · oferecer o extrato e o Passaporte como prova · nunca prometer retorno.

---

## 11. Governança do guia e checklist de revisão

**Dono:** a área de comunicação da IBITI com o grupo G01 nesta fase; versão registrada no GitLab. Qualquer
termo novo entra primeiro na seção 5; qualquer mensagem nova entra na seção 7 com o gatilho técnico.

**Checklist antes de publicar qualquer texto**

- [ ] Usa os termos da seção 5, sem sinônimos.
- [ ] Fala de experiência antes de dinheiro; dinheiro com base, período e documento.
- [ ] Diz o que é e o que não é quando é uma peça de entrada.
- [ ] Nenhuma promessa de retorno, valorização ou continuidade.
- [ ] Erro: o que aconteceu, por que a regra existe, próximo passo.
- [ ] Nada pessoal, nenhum dado de terceiro, endereços truncados.
- [ ] Técnica recolhida na jornada assistida; disponível na expert.
- [ ] Frases curtas, "você", sem caixa alta, sem exclamação dupla, sem emoji.
- [ ] Português do Brasil; datas, moeda e unidades nos formatos da seção 5.

---

## 12. Handoff para o Figma

1. **SVG (padrão do Figma):** arraste os arquivos de [`mockups/svg/`](mockups/svg/) para o Figma — cada
   tela chega como vetores e textos editáveis. As fontes usadas (Fraunces, Atkinson Hyperlegible, IBM Plex
   Mono) existem na biblioteca do Figma; se aparecer aviso de fonte, escolha "substituir" por elas.
2. **HTML:** o board ([`board/index.html`](board/index.html)) e a landing page ([`landing/index.html`](landing/index.html))
   são os modelos de referência e podem ser importados com o plugin **html.to.design** (por URL do artefato
   publicado ou por arquivo).
3. **PNG:** referência visual em [`mockups/png/`](mockups/png/) (2×).
4. **Estilos:** cores **névoa** `#EEF1EB` (fundo), **cartão** `#F8F9F6`, **tinta** `#15211B`, **copa**
   `#1E4A38` (principal), **âmbar** `#7B4B1F` (acento), **quartzito** `#C8CEC4` (linhas), **ocre** `#A6792B`
   (atenção), **tijolo** `#8C3B31` (erro); tipografia **Fraunces** (títulos), **Atkinson Hyperlegible**
   (texto e interface), **IBM Plex Mono** (hashes, endereços, valores).
5. Mantenha os textos exatamente como no catálogo da seção 7 — eles são a especificação, não um exemplo.
6. **Animação (para o protótipo no Figma):** rolagem com encaixe por seção; ao entrar numa seção, título,
   tópicos e botões aparecem em cascata (deslocamento de 26 px para cima e opacidade, 0,75 s, atraso de 80 ms
   entre itens); cena de fundo em parallax (três camadas, 5%, 12%, 22% e 36% da rolagem) com mudança de tom por
   seção (1,2 s); números da seção 2 contam até o valor final em 1,3 s; trilho da seção 3 se desenha em 1,3 s;
   barra de progresso e pontos no cabeçalho; tudo estático com `prefers-reduced-motion`.

---

## 13. Referências de mercado

O que foi observado em produtos comparáveis e o que a landing tomou emprestado — ou evitou de propósito.

| Referência | O que faz bem | O que trouxemos | O que evitamos |
|---|---|---|---|
| **Soho House** (página de membership) | copy mínima e curada, tom editorial, um único CTA repetido que "pede acesso" em vez de "escolher plano" | um só botão, "Quero apoiar", repetido; a verificação apresentada como pedir acesso a uma comunidade | fotografia fazendo 90% da narrativa — sem imagens do Glamping, a cena do território assume esse papel |
| **Inspirato Pass** | escassez dita como fato (2.500 memberships, no máximo) e valor "sem taxas escondidas" | "150 unidades, emissão única" e "no máximo 20 por pessoa" como fatos, sem contagem regressiva | qualquer urgência artificial |
| **Pacaso** | "como funciona" em três passos; verificação dos coproprietários; estrutura explicada em página própria | quatro passos numerados na landing; o detalhe (custódia, extrato, regras) em páginas separadas | tom de venda de imóvel |
| **Lofty / RealT** (imóveis tokenizados) | "como funciona", mínimos claros, painel de transparência | painel público com números agregados e hashes | linguagem de rendimento: yield, distribuições diárias, "invista a partir de" |
| **Práticas de animação por rolagem** | seções em encaixe para "tours" de produto, indicador de progresso, `prefers-reduced-motion` (WCAG 2.1), animação a serviço do conteúdo | tudo isso, implementado sem biblioteca | efeitos que só existem para impressionar |

Fontes consultadas em 02/09/2026: HubSpot, "36 landing page examples" (Soho House); Luxury Travel Advisor e
ShortTermRentalz sobre o Inspirato Pass; Equity Residences, "guia do modelo Pacaso"; eco.com, "Tokenized real
estate 2026: RealT, Lofty, Propy"; Lovable, "Scrolling designs: 8 patterns"; LandingPageFlow, "animation on
landing pages"; documentação `gsap.matchMedia()` sobre reduced motion.
