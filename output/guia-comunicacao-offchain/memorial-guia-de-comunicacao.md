# Guia de Comunicação do IBIToken — memorial do artefato

**Projeto IBITI Glamping · Grupo G01 · Inteli, módulo ADMD7 · versão 1.4 (03/09/2026)**

---

## Introdução

O Guia de Comunicação é o artefato que define **como o IBIToken é dito** — em toda peça, para todo público, em toda tela. Ele não descreve o produto (isso é o whitepaper) nem o código (isso é o contrato `IBIToken.sol`): ele fica na camada entre os dois, traduzindo uma estrutura financeira e técnica em uma linguagem que alguém sem conhecimento de blockchain consiga entender, usar e confiar.

O problema que ele resolve é concreto. O IBIToken combina quatro coisas ao mesmo tempo — uma experiência de hospedagem, o pertencimento ao Passaporte IBITI, uma fração do royalty do território e um registro em blockchain. Cada uma dessas faces tem um vocabulário próprio e um risco próprio de ser mal entendida. Sem uma régua única, cada pessoa do time escreveria de um jeito, e a soma das peças diria coisas diferentes — algumas delas juridicamente perigosas.

### Decisões estruturantes do artefato

Quatro escolhas definem o formato antes de qualquer conteúdo:

1. **Board, não manual.** O guia é uma única superfície contínua (A3 paisagem, 20 páginas no PDF; HTML navegável na origem), não um documento de texto corrido. A razão é de uso: quem escreve uma tela precisa ver a regra e a tela lado a lado, não procurar em capítulos.
2. **Toda regra vem com um "aplicado".** Nenhum princípio aparece sozinho: cada um traz o exemplo real de onde foi usado na interface. Um princípio sem exemplo vira interpretação livre.
3. **Rastreabilidade por código.** Os princípios recebem códigos `P0`–`P9` que reaparecem marcados nas telas anotadas. Dá para apontar uma tela e dizer qual regra a produziu — e o contrário: dada uma regra, achar onde ela foi aplicada.
4. **Fidelidade ao contrato, não ao desejo.** Toda mensagem de erro nasce de uma trava que existe de fato no `IBIToken.sol`. Quando o whitepaper e o código divergiram, o guia registrou a divergência em vez de escondê-la.

O guia se apoia em quatro fontes: o whitepaper do ativo (Sprint 2), as personas e a curva de emoção (Sprint 1), o mapa de riscos éticos (Sprint 2) e o contrato IBIToken v1.

---

## 1 · Em uma página — o que estamos comunicando

**O que é.** A frase-âncora do produto e a tabela "é / não é".

**O que contém.** Uma definição única do IBIToken; a hierarquia de valor em três blocos (a experiência, o retorno do valor aportado, o reconhecimento como apoiador); e a régua de honestidade em duas colunas.

**Decisões.**

- **Uma só frase canônica.** Toda peça parte do mesmo texto-base. Isso elimina a variação natural entre quem escreve a landing, quem escreve o e-mail e quem atende.
- **A ordem é parte da mensagem.** Experiência → pertencimento → retorno econômico. A ordem não é estética: é a decisão de não vender o componente financeiro primeiro.
- **A tabela "não é" tem função jurídica.** As quatro negações — não é investimento com retorno garantido, não é criptomoeda para negociar, não financia a obra, não promete continuidade — são o teste de aprovação de qualquer texto. Se uma frase sugere algo da coluna direita, ela está errada, por mais atraente que soe.
- **O royalty é dito como consequência, nunca como promessa.** Essa formulação atravessa o guia inteiro e é o que separa comunicação de oferta pública.

---

## 2 · Princípios de comunicação — dez regras que valem para tudo

**O que é.** O núcleo doutrinário do guia: dez princípios numerados, cada um com seu "aplicado".

**Decisões.**

- **P0 é regra de ouro e vem primeiro:** o essencial em trinta segundos. Uma frase de contexto, no máximo três itens por bloco, um botão por tela.
- **P3 — blockchain invisível por padrão, verificável sob demanda.** Nenhuma tela da jornada assistida obriga a ver endereços ou hashes, mas toda tela que registra algo tem "Ver no registro público". É a decisão que resolve o vale de confiança da seção 5.
- **P5 — todo número tem origem e data.** Valor de royalty só aparece com período, base, alíquota, fração e hash do relatório. Nunca um "saldo de rendimentos" solto.
- **P9 — honestidade sobre o que é centralizado.** A IBITI administra o contrato e reporta o faturamento, e isso é dito com todas as letras: "a IBITI apura e publica; o contrato calcula; qualquer pessoa confere."
- Os demais cobrem hierarquia de valor (P1), a régua "é / não é" em toda peça de entrada (P2), termo único por conceito (P4), erro que orienta em vez de alarmar (P6), discrição por padrão (P7) e a mesma verdade em duas profundidades (P8).

---

## 3 · Tom de voz — um anfitrião do território

**O que é.** A definição de voz e sua calibragem.

**Decisões.**

- **Quatro adjetivos e um contraponto:** sereno, claro, franco, discreto — e nunca vendedor. O contraponto é tão operativo quanto os adjetivos.
- **Escalas em vez de adjetivos soltos.** Quatro eixos (sério↔bem-humorado, formal↔informal, respeitoso↔irreverente, entusiasmado↔objetivo) mostram a posição exata, o que evita a interpretação elástica de palavras como "acolhedor".
- **Entusiasmo com orçamento.** Só em dois momentos: a chegada ao Passaporte e o dia da experiência. Calor vem da hospitalidade, não das exclamações.
- **Pares "assim / não assim" com o motivo.** Cada par vem com a razão da rejeição — jargão, entusiasmo artificial, nome de erro do contrato, sugestão de investimento, sistema falando em vez do membro. É o "porquê" que faz a regra sobreviver a quem a escreveu.
- **Tom por momento da jornada.** Nove momentos, do descobrimento ao encerramento, cada um com tom e exemplo pronto.

---

## 4 · Terminologia — uma palavra para cada coisa

**O que é.** O dicionário controlado do projeto.

**Decisões.**

- **Dois registros declarados.** Interface (hospedagem, usada, sua parte do royalty) e documentos/contrato (experiência, resgate, fração do royalty) — com a regra de nunca misturar os dois na mesma tela.
- **Cada verbete traz o termo do código junto.** `isMember`, `markRedeemed`, `activeUnitsOf`, `royaltyDue`, `maxPerWallet`, `reissue`. O guia funciona como ponte entre a conversa do time de produto e a do time de engenharia.
- **Listas de evitar com o risco embutido.** "Dividendo", "rendimento", "yield", "APY" estão proibidos porque sugerem investimento; "queimar" e "burn" porque a unidade não é destruída no resgate; "anônimo" porque é factualmente falso.
- **Formatos fixados** (unidades inteiras, `R$ 3.398,74`, `15/07/2027`, `1º semestre de 2027`, endereços truncados) para que o mesmo dado não apareça de duas formas.
- **Nota de LGPD.** Um bloco inteiro sobre o que a palavra "anonimato" pode e não pode prometer: o registro público guarda endereço, quantidades, valores e hashes — nunca nome, documento, e-mail ou reserva; o vínculo pessoa-carteira vive só na base da IBITI e é dado pessoal; por isso o endereço é **pseudônimo, não anônimo**; o hash prova que o relatório não mudou, sem revelar conteúdo; e o direito de eliminação tem limite físico, porque o que está na blockchain não se apaga. A pendência com o jurídico está registrada em vez de omitida.

---

## 5 · O fluxo — a jornada e o vale de confiança

**O que é.** Duas leituras do mesmo percurso: o que a pessoa sente e o que o sistema faz.

**Decisões.**

- **A curva de emoção da Sprint 1 vira decisão de comunicação.** Seis etapas — descoberta, avaliação, fricção tecnológica, aquisição, pertencimento, imersão — cada uma com tom e com a **prova** que a sustenta.
- **O vale de confiança é nomeado.** A fricção tecnológica, momento em que o interessado pesquisa sobre tokens e carteiras e recua, é marcada explicitamente. É o ponto que justifica o P3 e que orienta o desenho das telas seguintes.
- **O user flow é a contraparte técnica.** Três fluxos decisórios — aquisição, resgate, recuperação de acesso — em que cada losango é uma condição que o contrato ou um processo fora da blockchain de fato verifica, e cada saída negativa aponta para uma mensagem do catálogo da seção 7. Nenhum caminho termina sem resposta.
- **A divergência com o whitepaper está registrada.** O whitepaper previa uma lista de carteiras aprovadas (`approvedWallets`) como trava de transferência; a v1 do contrato resolve de outro jeito — quem já tem saldo é membro, e só a carteira administrativa semeia uma carteira nova pela compra primária. O guia registra isso como nota de fidelidade ao código, para a próxima revisão do whitepaper.

---

## 6 · Telas — compra, recebimento e resgate, tela a tela

**O que é.** O conjunto de mockups anotados: landing em cinco seções (L1–L5), jornada assistida (A2–A11), variações expert (E1–E2), parceiro do território (P1) e painel público (T1).

**Decisões.**

- **Uma regra de densidade.** Cada tela cabe em uma olhada: um título, até cinco tópicos de uma linha, um botão. O detalhe fica a um toque, nunca na frente.
- **Anotação com rastreabilidade.** Cada tela traz os códigos `P` dos princípios que a governaram e a decisão de comunicação por trás de cada texto.
- **Telas de exceção têm o mesmo peso das felizes.** Envio para outro membro, recuperação de acesso, extrato e painel público estão desenhados, não descritos.
- **O painel público (T1) materializa o P9:** agregados, hashes e situação do sistema, sem nada individual — "12 membros", nunca a lista.

---

## 7 · Mensagens do sistema — erro, confirmação e andamento

**O que é.** O catálogo canônico de 39 fichas: erros (E1–E18), confirmações (C1–C10) e estados de andamento (F1–F8).

**Decisões.**

- **Estrutura fixa de três partes:** título com o fato, texto com o porquê, ação com o próximo passo. Sem essa estrutura, cada erro vira uma redação nova.
- **Todo erro nasce de uma trava real.** `RecipientNotHolder` vira "Essa carteira ainda não é membro"; `WalletCapExceeded` vira "Limite de 20 unidades por membro" com o número exato do excesso. O nome do erro do contrato nunca chega ao membro.
- **Toda confirmação nasce de um evento** emitido pelo contrato (`PrimaryPurchase`, `RedemptionMarked`, `Reissued`, `Unpaused`) ou de uma etapa fora da blockchain.
- **Acessibilidade como especificação, não como recomendação.** Cada ficha declara a região viva que a implementação deve usar: erro é `role="alert"` / `aria-live="assertive"` e interrompe o leitor de tela; confirmação e andamento são `polite` e esperam a pausa. O guia explica inclusive por que as regiões não estão declaradas na própria página do board — declará-las faria o leitor anunciar as 39 fichas de uma vez.

---

## 8 · Dados, métricas e resultados

**O que é.** A especificação de como apresentar apurações, posse e transparência.

**Decisões.**

- **A anatomia do extrato em nove pontos** funciona como especificação de componente: período com data de publicação; a fração do membro antes do total, em destaque, porque é o número da decisão; fração inteira ("3 de 150"), nunca percentual; base do royalty dita em palavras; alíquota explícita para que qualquer pessoa refaça a conta; status com forma e texto; meio de pagamento conforme a jornada; documento com hash e ação de conferir; e a nota fixa sobre quem apura, quem calcula e quem confere.
- **O estado vazio é tratado como tela de primeira classe.** Quem compra em 2026 vê essa tela por meses. Um extrato zerado com "R$ 0,00" seria lido como perda — então o vazio diz que ainda não há o que apurar e **quando** haverá, e mantém visíveis os dois estados que já existem desde a compra.
- **Uma lista do que nunca se mostra:** dados de hóspedes, faturamento diário, nomes ou rankings, "valorização", percentuais anualizados, gráficos de preço, projeções sem o rótulo de hipótese e métricas de impacto que o modelo não mede.

---

## 9 · Tokens visuais e handoff — guia visual e diretrizes

**O que é.** A camada de implementação: paleta, tipografia, matriz de estados, acessibilidade e instruções de passagem para o Figma.

**Decisões.**

- **Paleta derivada do território.** Névoa como fundo, verde-copa como cor principal, âmbar das águas escuras como único acento, quartzito nas linhas — mais ocre para atenção e tijolo para erro.
- **Tipografia escolhida por legibilidade:** Fraunces nos títulos, Atkinson Hyperlegible no texto e na interface, IBM Plex Mono em valores, hashes e endereços.
- **Matriz de estados como especificação.** Sete estados (padrão, hover, foco, ativo, desabilitado, carregando, erro) por componente, cada um com a regra que o acompanha — foco com anel âmbar idêntico nos três componentes (WCAG 2.4.7 e 2.4.11), carregando com palavra e não só spinner, desabilitado sempre com o motivo em texto.
- **Contraste verificado par a par**, com as duas correções desta revisão registradas: ocre `#A6792B → #8B621F` (3,25:1 → 4,54:1) e tinta-3 `#77837C → #68746D` (3,95:1 → 4,88:1).
- **Três regras de acessibilidade explícitas:** alvo mínimo de 44 × 44 px (WCAG 2.5.8), cor nunca sozinha como portadora de sentido, e respeito a `prefers-reduced-motion` com `lang="pt-BR"` para leitura correta de valores e datas.
- **Handoff com dois caminhos:** importar o board inteiro pelo plugin html.to.design ou arrastar os SVGs individuais, que chegam como vetores e textos editáveis.

---

## Decisões que atravessam o artefato inteiro

- **Nenhuma regra sem exemplo.** Princípio, tom, termo, erro e estado — cada um vem com a aplicação real.
- **Nenhuma mensagem sem lastro.** Cada texto de erro corresponde a uma trava do contrato; cada confirmação, a um evento.
- **Acessibilidade e LGPD entram como requisito, não como acabamento.** Regiões vivas, contraste, alvo de toque e o limite do que se pode prometer sobre anonimato estão dentro das fichas e das seções, não em um anexo.
- **As divergências ficam registradas.** Onde whitepaper e código discordam, e onde o jurídico ainda precisa decidir, o guia diz — em vez de apresentar uma versão limpa e falsa.

---

*Documento e imagens gerados com auxílio de IA generativa.*
