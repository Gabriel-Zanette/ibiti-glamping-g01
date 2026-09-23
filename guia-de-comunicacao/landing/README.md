# Landing IBIToken — revisão de 16/09/2026

Abra `index.html` para a landing com a direção escolhida pelo usuário: **05 — Luz do bosque**. O fundo é padrão também em detalhes, FAQ, transparência e aquisição. `variacoes.html` mantém os cinco tratamentos disponíveis para comparação e abre na opção 05. O projeto continua em HTML, CSS e JavaScript, sem dependências de build.

## Decisões confirmadas

- Experiência e pertencimento são a motivação inicial; a causa vem antes dos números.
- Texto compreensível para quem conhece pouco o IBITI e não entende de tokens.
- Landing → detalhes → entrada da aquisição. FAQ e transparência acompanham a mesma comunicação.
- Preço integral de referência na landing: R$ 37.055,19 por token, seguido de “Adquirir meu token” e “Entender todos os detalhes”.
- Escassez real: emissão de 150, com 100 destinados à colocação inicial. Sem contador de vendas ou urgência por prazo. A reserva inicial pode ser reduzida pela administração.
- HTML fornecido usado como referência de fundo; a copy dele não foi adotada. A fotografia foi extraída sem edição; as fontes Fraunces e Atkinson Hyperlegible da landing anterior foram preservadas.

## Estrutura e copy

1. Convite: “Viva o IBITI. Faça parte do que você quer preservar.”
2. Benefícios: experiência de 3 noites, Passaporte e participação no royalty.
3. Contribuição: compra apoia a IBITI e seu ecossistema.
4. Números: emissão, colocação inicial, vigência e base do royalty.
5. Decisão: valor por unidade e dois CTAs.

A landing tem aproximadamente 319 palavras incluindo navegação e rodapé. Procedimentos, restrições completas, custódia e explicações técnicas ficam nas páginas de apoio. Nenhum benefício não confirmado foi incluído: prioridades, eventos, upgrades e experiências de outras operações não são prometidos.

## Fundos para comparação

| Parâmetro `fundo` | Direção | Tratamento |
| --- | --- | --- |
| `claro` | Clareza editorial | Creme no convite, branco nos benefícios, verde na causa e papel na decisão |
| `papel` | Papel e terra | Variações de papel e areia ao longo da página |
| `floresta` | Dentro da floresta | Verdes profundos; texto e controles claros para contraste |
| `nevoa` | Névoa da manhã | Verdes claros e neutros, com transição suave no convite |
| `luz` | Luz do bosque — escolhida | Gradientes de luz em creme e oliva, com causa em verde |

Todos usam a mesma página, fotografia, copy, tipografia, espaçamento e ordem. Somente os tokens de fundo e as cores necessárias ao contraste variam. O parâmetro acompanha detalhes, FAQ, transparência e aquisição. A troca no comparador mantém a posição na landing, facilitando conferir a mesma seção em cada fundo. As escolhas também têm URLs próprias, como `index.html?fundo=floresta`.

## Movimento da landing original

A pedido do usuário, as cinco variações recuperam o formato de animação da landing anterior: seções com altura mínima de uma tela, encaixe vertical ao rolar, entrada com deslocamento de 26 px em 750 ms e intervalos de 80 ms, parallax da fotografia e luz de fundo, e contagem de 150/100 em 1,3 s. A animação de entrada se repete ao revisitar as seções. A barra discreta sob o cabeçalho acompanha o progresso.

O encaixe é suave (`proximity`) em celular e janelas baixas; seções longas crescem sem cortar conteúdo. A preferência de redução de movimento desativa encaixe, transições, parallax e contagem, preservando o conteúdo. Preço e datas não são animados; leitores de tela recebem os valores finais dos números. Sem JavaScript, o conteúdo continua visível.

## Aquisição e limites

`adquirir.html` implementa três etapas navegáveis: quantidade → dados fictícios e preferência de jornada → revisão. O total usa aritmética inteira de centavos sobre o valor unitário exibido. Isso não altera a precisão integral da planilha financeira nem o valuation da colocação. Quantidades inválidas não geram um total.

Nenhum dado pessoal é transmitido ou persistido pela aplicação. Encerrar a demonstração limpa os campos e o resumo. Não há cadastro real, verificação de identidade, reserva de tokens, cobrança, integração de custódia ou aprovação comercial. A API offchain existente continua separada; sua rota de criação de pessoas é administrativa e não foi exposta a esta página pública.

O limite de 20 desta simulação é o teto técnico por carteira; o saldo existente e o controle agregado por pessoa precisam ser considerados na verificação real.

## Fontes e manutenção

- Regras e dados: `whitepaper/whitepaper_ibiti_revisado.md` e skill `ibiti-context`, com prioridade às decisões atuais do usuário.
- O arquivo `assets/whitepaper-ibiti.md` é uma cópia idêntica do whitepaper vigente para permitir o download dentro do site estático. Atualize essa cópia quando a fonte mudar.
- `site.css`: layout, responsividade, contraste e cinco fundos.
- `site.js`: seleção validada de fundo, navegação e menu móvel.
- `landing-motion.js`: movimento compartilhado, apenas na landing, respeitando redução de movimento e navegação por teclado.
- `purchase.js`: etapas da aquisição demonstrativa.
- `variacoes.js`: comparação, formato de visualização e preservação da posição.
- `assets/territorio-referencia.jpg`: fotografia fornecida no HTML, sem alteração. O texto alternativo descreve a imagem sem comprovar sua localização.

Esta revisão substitui as instruções antigas de esconder o preço, o roteiro operacional longo da landing e as promessas de benefícios/custódia presentes no guia e no board históricos. Os mockups PNG/SVG e o board antigo não foram regenerados; a comparação atual é o HTML navegável.

## Verificação

Conferidos links locais, âncoras, IDs, assets, sintaxe JavaScript e consistência do whitepaper anexado. Exercitados totais para 1, 2, 3 e 20 tokens, entradas inválidas, limite máximo, passagem entre as etapas, revisão das duas jornadas e limpeza dos dados. A interface permanece navegável por teclado, com foco visível, menu móvel e redução de movimento.

Na recuperação das animações, conferidos no navegador o encaixe abaixo do cabeçalho, os intervalos de 80 ms, a conclusão dos contadores em 150 e 100, o modo de redução de movimento com todo o conteúdo visível e a largura de 390 px sem rolagem horizontal. O comportamento é compartilhado pelos cinco fundos.

Para servir apenas esta pasta: `python3 -m http.server 4178 --bind 127.0.0.1 --directory guia-de-comunicacao/landing` a partir da raiz do repositório.
