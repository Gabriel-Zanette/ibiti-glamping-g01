# 01 · Visão geral do projeto

## A IBITI em três parágrafos

O **Ibiti Projeto** é um ecossistema de turismo regenerativo em Conceição do Ibitipoca, Minas Gerais, na
Serra da Mantiqueira, na divisa com o Parque Estadual do Ibitipoca. São cerca de 6 mil hectares em área de
transição entre Mata Atlântica, cerrado e campos rupestres. A esmagadora maioria do território (material
público fala em ~98%) é reflorestada ou em regeneração ativa. A empresa abre mão da valorização fundiária
para regenerar a mata.

O pequeno restante abriga **empreendimentos separados**, em geral operados por terceiros com CNPJ próprio,
em parceria com a IBITI. A IBITI se sustenta por **royalties sobre o faturamento** dessas operações: 30%
quando o investimento foi da própria IBITI, 15% quando foi do empreendedor terceiro. O retorno financeiro
não é o foco; o foco é o propósito regenerativo.

Quem vive no território são os **trabalhadores dos empreendimentos**, que não são de alta renda. Quem se
hospeda são os **hóspedes**, cujo perfil médio é de alta renda e, com frequência, figuras públicas. Essa
distinção importa: qualquer solução voltada ao hóspede exige privacidade e discrição.

## O IBITI Glamping

É o mais novo empreendimento de hospitalidade de luxo do território: baixíssima densidade, rituais de
bem-viver, desconexão, arte e imersão na natureza. O investimento é do **empreendedor entrante** (Joaquim
Monteiro), portanto a IBITI recebe **15% do faturamento bruto** do Glamping. É esse contrato de 15% que o
projeto tokeniza. Formatos de hospedagem citados nos dados: Engenho, Village e Remote.

## O problema que o módulo resolve

O Glamping exige capital antes de gerar receita, e a IBITI não tem um mecanismo unificado que conecte
economicamente os agentes do ecossistema. O TAPI pede um **utility token** que tokenize a experiência do
empreendimento ainda em desenvolvimento, capte recursos junto a apoiadores e atraia uma comunidade
alinhada ao propósito. O Glamping é o primeiro caso e referência para iniciativas futuras.

Escopo pedido pelo TAPI:

1. Modelar a mecânica do token: escassez, validade e fracionamento.
2. Estruturar a lógica do smart contract.
3. Desenhar a arquitetura da tokenização do contrato de royalties de 15%.
4. Desenhar a arquitetura de benefícios: como o token se transmuta em vantagens para marcas e famílias.

O projeto **não** contempla: criar moeda própria, integrar carteiras em produção real fora de ambiente
simulado, ou auditoria legal formal na CVM (só modelagem teórica).

## O que é o IBIToken, em uma frase

> O IBIToken é a **cota de quem apoia o território IBITI** enquanto o Glamping ainda é projeto: cada unidade
> dá à pessoa verificada que a detém **uma experiência de hospedagem no Glamping**, torna-a **membro do
> Passaporte IBITI** e lhe dá **uma fração do royalty** que o território recebe quando o Glamping opera, por
> quatro anos (2027–2030).

Três faces em um único ativo, sem queima. O que está na blockchain é a posse (membership e royalty). O
direito de hospedagem é da **pessoa verificada**, registrado pela IBITI fora da blockchain (decisão de
10/09/2026, ver [03](03-uso-vinculado-a-pessoa.md)).

## Hierarquia de valor para quem compra

1. **A experiência** no Glamping. É o que se compra; nada a substitui.
2. **O retorno do valor aportado** ao longo dos quatro anos, pelas apurações semestrais do royalty. Teto
   especulativo de até 15% ao ano usado como hipótese de valuation, nunca apresentado como promessa.
3. **O reconhecimento como apoiador do projeto IBITI.** A captação vai para a IBITI e o ecossistema, **não
   para a construção do Glamping**, que é investimento do empreendedor terceiro. Não se escreve "apoiador
   fundador" nem "financia a obra".

## Quem participa

| Papel | Quem | Recorrer para |
|---|---|---|
| Líder do projeto | Heliane Machado, Diretora do Ecossistema Educacional Ibiti | direcionamento geral |
| Ponto focal do Glamping | Joaquim Monteiro, empreendedor responsável | detalhes do empreendimento, benefícios |
| Líder técnico | Mariana Reis, Diretora Financeira IBITI | números, valuation, royalties |
| Líder de negócio | Hugo Cambraia, Diretor Executivo | estratégia |
| Líder executivo | Matheus Granato, Gestor de Projetos | operação, agenda, dados |
| Professor orientador | Rafael Donaire | orientação acadêmica |
| Grupo G01 | Leon (SM na Sprint 2), Adriana, Thomas, Gabriel Zanette (arquitetura e operação), Erik, Lavinia | |

## Personas dos compradores (hipóteses a validar)

- **Helena, hóspede AAA tradicional.** Compra pertencimento, acesso e legado; royalty irrelevante.
  Fricção tecnológica altíssima: quer atendimento white-glove, custódia invisível, pagamento em reais.
  Risco dominante: reputacional. **É a jornada principal.**
- **Beatriz, investidora de impacto ESG.** Compra a tese ReFi com evidência; confiança via governança,
  métricas e auditoria. Fricção moderada. Risco dominante: greenwashing, regulatório.
- **Gabriel, cripto-nativo.** Compra pioneirismo e proveniência on-chain; confiança via código;
  self-custody. Fricção mínima; abstração demais o afasta. Risco dominante: técnico e liquidez.

Os extremos exigem **duas jornadas sobre o mesmo contrato**: assistida (fiat e custódia) e expert
(carteira própria). Marcas parceiras existem, mas não são base de persona.

## Alinhamento com a Agenda 2030

ODS 8 (trabalho e crescimento local), 9 e 17 (inovação e parceria IBITI + Inteli em ReFi e Web3), 12
(consumo e produção responsáveis, baixa densidade), 15 (vida terrestre, rewilding), 16 (instituições
transparentes).

## Dados disponíveis

O TAPI promete tabelas anonimizadas de Hóspedes Histórico e Marcas Parceiras (amostra de 25%, jun/2024 a
jun/2026). **Não foram entregues ao grupo** até esta data. Todos os números do projeto são hipóteses
fundamentadas, declaradas como tal.
