# IBIToken: conceitos, decisões e funcionamento dos artefatos

Estudo aprofundado das Sprints 1 a 4 | 05/10/2026

Esta é uma nova leitura dos **12 artefatos que não são de Gestão de Projeto**, com foco em entender o raciocínio por trás do trabalho. A organização segue os documentos e suas relações, sem notas, rubricas, probabilidades de perguntas ou hierarquia de avaliação. Governança do negócio e do contrato continua incluída, porque faz parte dos artefatos jurídicos, financeiros e técnicos.

Base documental: arquivos do GitLab G01 obtidos em 01/10/2026, revisão `00fde23c8ab118ba5e644fd348a35ee93ba8cb8a`. O material explica essa entrega identificada; não presume que o repositório remoto permaneça sem alterações posteriores. Fontes jurídicas e de acessibilidade foram conferidas em 05/10/2026. O guia anterior e os documentos originais foram preservados.

## 1. O modelo inteiro antes de olhar as partes

### 1.1 O que estamos tentando construir

O IBIToken organiza três direitos relacionados: uma experiência de hospedagem, pertencimento ao ecossistema IBITI e participação em um fluxo de royalties. A operação hoteleira produz receita; uma obrigação contratual destina 15% da receita elegível à estrutura; 150 IBT representam as frações econômicas desse fluxo. A compra dos tokens gera recursos presentes para o ecossistema IBITI. O memorando esclarece que essa captação não financia a obra do Glamping, que cabe ao empreendedor terceiro.

O projeto transforma um fluxo futuro e incerto em uma proposta de participação presente. Isso tem um custo econômico: a IBITI antecipa recursos ao compartilhar parte das receitas futuras. A blockchain organiza registros e executa regras, mas a receita continua dependendo da operação do hotel. Se não houver faturamento ou repasse, a tecnologia não cria o dinheiro que falta.

### 1.2 Os documentos respondem a perguntas diferentes

| Artefato | Questão que ele organiza |
|---|---|
| Diagnóstico de negócios | Qual problema existe e por que essa solução poderia fazer sentido? |
| Entendimento do usuário | Quem participa, o que valoriza e o que dificulta sua experiência? |
| Riscos éticos e impacto | Quem recebe os benefícios e quem suporta os efeitos adversos das escolhas? |
| Whitepaper | Como direitos, atores, regras e arquitetura se conectam? |
| Estrutura jurídica | Quais obrigações e relações sustentam o direito representado pelo token? |
| Guia de comunicação | Como explicar os mesmos fatos de forma compreensível em cada etapa? |
| Memorando e planilha | Quais são os termos, a tese econômica, as premissas e a incerteza do preço? |
| Implementação | Quais regras são efetivamente executadas pelo contrato e pelo portal? |
| Deploy e evidências | Qual código foi publicado, onde, e quais comportamentos foram demonstrados? |

O memorando pode propor uma regra que o código ainda não executa. Um vídeo pode demonstrar uma função local sem demonstrá-la em rede pública. Um contrato de teste pode funcionar sem existir contrato jurídico assinado. Essas diferenças ajudam a entender o estágio de cada parte.

### 1.3 Quatro camadas que não podem ser confundidas

**Negócio:** define o benefício, a receita elegível, o prazo, o preço e a responsabilidade de cada ator. **Jurídico:** transforma essas relações em obrigações e examina seu enquadramento. **Tecnologia:** registra e executa parte das condições. **Evidência:** mostra o que de fato aconteceu em um ambiente identificado.

Exemplo: “15% da receita bruta” é uma regra de negócio. O dever do operador de apurar e repassar depende da relação contratual. A função `reportRevenue` calcula a distribuição a partir do número informado. Um recibo demonstra que a transação ocorreu, mas não que o faturamento informado correspondeu ao caixa real do hotel.

### 1.4 Referência da entrega analisada

| Elemento | Referência atual da implementação analisada |
|---|---|
| Emissão | 150 IBT inteiros; 50 em reserva inicial e 100 inicialmente vendáveis. |
| Titularidade | Limite de 20 IBT por pessoa, agregado entre carteiras vinculadas. |
| Circulação | Transferências ordinárias bloqueadas; não há mercado secundário. |
| Royalties | 15% da receita reportada, rateados por quantidade e tempo de posse. |
| Prazo | Oito períodos de seis meses de calendário desde a abertura oficial registrada. |
| Abertura | Sem data real confirmada nos materiais examinados. Datas de demonstração são fictícias. |
| Experiência | Uma cota por IBT durante toda a emissão; três noites; uso controlado fora da blockchain. |
| Preço | Referência econômica de R$ 34.874,14; pagamento da demonstração em tBRL fictício. |
| Administração | Um owner; troca em duas etapas; pausa global das operações protegidas. |
| Custódia | IBITI, autocustódia assistida e autocustódia direta; operação sem extensão demonstrada somente em Anvil local. |
| Evidência pública | Deploy e verificação na Sepolia; ciclo operacional documentado em Anvil. |

“Implementação - versão 2” é o nome do artefato da Sprint 4. A revisão interna de seu código é 4.0.0. O artefato da Sprint 3 também contém referências técnicas a uma v2 histórica. Por isso, o nome da pasta, a revisão e o endereço do contrato devem acompanhar qualquer comparação.

## 2. Sprint 1 - Business Diagnosis and Discovery

Fonte principal: PDF de 19 páginas, especialmente seções 2 a 7.

### 2.1 Diagnosticar antes de escolher a tecnologia

O diagnóstico parte de dois problemas: o intervalo entre necessidade de capital e geração futura de receita, e a dificuldade de conectar economicamente hóspedes, apoiadores, parceiros e outros agentes do território. A tokenização foi a direção do projeto, mas o diagnóstico procura explicar a necessidade que a antecede.

Isso evita um raciocínio circular: “Precisamos de blockchain porque queremos tokenizar”. O raciocínio de negócio é: existe um fluxo econômico futuro; há interessados com motivações diferentes; precisamos estruturar direitos, participação e prestação de contas. Só depois se examina se um registro compartilhado e programável ajuda a realizar isso.

O diagnóstico não prova que a tokenização seja a alternativa mais barata. Ele fornece uma justificativa conceitual. Demonstrar superioridade econômica exigiria comparar alternativas sob premissas equivalentes, incluindo custo jurídico, tecnologia, atendimento, risco e disposição de compra.

### 2.2 Criar valor, capturar valor e ter caixa são coisas diferentes

O IBITI cria valor ao combinar hospitalidade, território, natureza, experiências e iniciativas regenerativas. Captura parte desse valor cobrando por hospedagens e serviços. Caixa disponível é o recurso efetivamente recebido e utilizável em determinado momento.

Uma marca forte pode atrair hóspedes, mas não paga despesas sozinha. Um território com valor ambiental e reputacional não se converte automaticamente em dinheiro disponível. O diagnóstico identifica justamente essa diferença entre ativos estratégicos e liquidez financeira.

O royalty é relevante porque transforma a operação em uma relação econômica mais delimitada: uma parcela do faturamento. Ainda assim, uma receita futura esperada é diferente de um crédito já vencido contra um devedor. O seu valor depende da existência e do cumprimento da obrigação, da operação e do tempo até o recebimento.

### 2.3 Por que representar royalties, e não vender parte do imóvel

O direito escolhido permite vincular o participante ao desempenho do Glamping sem entregar participação societária, voto sobre a operação ou propriedade imobiliária. O titular tem os direitos delimitados pelo instrumento, não uma fração de todos os ativos da IBITI.

Essa escolha preserva o controle da operação e permite limitar o compromisso econômico no tempo. Em contrapartida, o comprador não recebe os poderes típicos de um sócio nem pode presumir que o imóvel seja uma garantia executável de seu investimento.

**Exemplo:** possuir 15 de 150 tokens equivale, para posse durante todo o período, a 10% do royalty distribuível. Como o royalty é 15% da receita, a participação corresponde a 1,5% dessa receita. Não significa possuir 10% do hotel.

### 2.4 Como comparar com empréstimo, participação societária e pré-venda

| Estrutura | O que o financiador ou comprador recebe | Compromisso central do empreendimento |
|---|---|---|
| Empréstimo | Direito de crédito segundo juros, vencimentos e garantias pactuados. | Serviço da dívida, mesmo quando a operação fica aquém do esperado, conforme o contrato. |
| Participação societária | Direitos econômicos e políticos definidos pelo tipo de sociedade e instrumento. | Compartilhamento do resultado e, conforme o caso, da governança. |
| Pré-venda de hospedagem | Direito de utilização de um serviço futuro. | Entrega da experiência nas condições prometidas. |
| IBIToken proposto | Experiência, pertencimento e parcela variável do royalty. | Entregar serviços e cumprir obrigações econômicas, informacionais e operacionais próprias. |

O IBT combina componentes. Isso pode aproximar pessoas que valorizam experiência e propósito, mas também aumenta a quantidade de obrigações a administrar. A ausência de juros fixos não significa capital gratuito: há cessão de receita futura, custos de implantação e riscos de execução.

### 2.5 Receita bruta torna o cálculo simples, mas não elimina risco operacional

A receita bruta costuma ser uma base mais direta de observar que o lucro, porque o lucro depende também de despesas, depreciação, provisões e critérios contábeis. A escolha do faturamento busca reduzir a dependência dessas decisões na apuração do royalty.

Porém, o hotel pode faturar e ainda operar com prejuízo. Nesse cenário, o dever de repassar uma parcela da receita pode pressionar o caixa. O investidor continua exposto à capacidade de pagamento do operador. A simplicidade da fórmula não substitui uma análise de sustentabilidade da operação.

Também é necessário definir o que entra na base: hospedagem, consumo, cancelamentos, descontos, estornos e outras receitas. “Bruta” não resolve sozinha todos esses casos.

### 2.6 Atores e incentivos: onde os interesses se encontram e se separam

O operador busca sustentar a atividade hoteleira; a IBITI busca recursos, preservação do território e continuidade do ecossistema; o participante pode valorizar hospedagem, retorno ou pertencimento; parceiros podem buscar relacionamento e oportunidades comerciais; a comunidade recebe efeitos da operação sem necessariamente adquirir tokens.

Esses interesses podem coincidir em uma experiência bem executada. Podem divergir quando uma restrição ambiental reduz ocupação, quando uma expansão comercial pressiona o território ou quando uma captação bem-sucedida não gera benefícios locais observáveis.

Não basta listar stakeholders. É preciso entender qual decisão os afeta e qual influência exercem. Um participante sem voto pode pressionar por retorno; um morador com pouco poder financeiro pode suportar parte importante do impacto ambiental.

### 2.7 O que os dados iniciais sustentam

O diagnóstico cita uma amostra de 25% do histórico disponibilizado entre junho de 2024 e junho de 2026. Isso é uma descrição do material de partida, não uma garantia de representatividade. É necessário saber como a amostra foi selecionada e se os clientes históricos se comportariam de forma parecida diante de um produto financeiro com prazo e iliquidez.

Crescimento do turismo de luxo também não demonstra demanda específica pelo IBT. Existem pelo menos duas decisões diferentes: desejar se hospedar no Glamping e aceitar pagar antecipadamente por um conjunto de direitos de quatro anos. A segunda exige entender capacidade financeira, confiança, interesse e tolerância a risco.

### 2.8 O que mudou depois do diagnóstico

O documento inicial inclui hipóteses de financiamento da construção, emissão de 10.000 unidades, horizonte perpétuo e abertura parcial da oferta. Os artefatos posteriores passaram a trabalhar com captação para o ecossistema, 150 unidades, prazo determinado e regras mais restritas.

Esses números iniciais são úteis para entender a exploração do problema. Eles não devem ser combinados com as premissas do memorando v2. Uma conta feita com fluxo de quatro anos e denominador de 10.000 unidades produziria o preço de outro desenho econômico.

Há ainda uma tensão atual: a tese fala em antecipar recursos antes da operação, enquanto a implementação entregue bloqueia compra antes do registro da abertura. É uma diferença substantiva entre intenção de negócio e regra executável, e não apenas uma diferença de texto.

## 3. Sprint 1 - Entendimento da Experiência do Usuário

Fontes: documento Markdown e nove imagens de stakeholders, CSD, personas, mapas de empatia e jornada.

### 3.1 Por que estudar maturidade tecnológica junto com motivação

Dois compradores com a mesma capacidade de aporte podem exigir experiências muito diferentes. Uma pessoa confia na marca e quer atendimento discreto; outra precisa de documentos e evidências; outra quer conferir o contrato e operar sua carteira.

O artefato adapta as personas para investigar risco percebido e a transição entre serviços tradicionais e blockchain. Isso é útil porque o principal obstáculo não é necessariamente o preço. Pode ser medo de perder a chave, de expor patrimônio, de cair em um golpe ou de não compreender o direito adquirido.

As personas são modelos de comportamento usados no design. Não são, por si, resultados de entrevistas ou uma segmentação estatística validada. A preferência atribuída a uma personagem orienta uma hipótese de interface; a observação de usuários é que pode confirmá-la.

### 3.2 Helena: confiança e discrição

Helena representa a hóspede tradicional que valoriza experiência, vínculo com a causa e atendimento. Exigir instalação de extensão, compra de moeda e gestão de chaves logo na entrada pode destruir a confiança que a marca já construiu.

A resposta de produto é reduzir etapas técnicas desnecessárias: conta convencional, linguagem clara, assistência e explicação gradual sobre custódia. O portal atual permite login sem conectar carteira e separa manifestação de interesse da compra efetiva.

Isso não autoriza esconder quem controla os ativos. Uma operação assistida precisa deixar claro quem mantém a chave e como o titular recupera o acesso. O acolhimento não substitui consentimento informado.

### 3.3 Beatriz: confiança construída por evidências

Beatriz representa quem examina governança e impacto antes de aceitar a proposta. Para ela, a afirmação de que o dinheiro ajuda a regeneração é insuficiente. É necessário ligar objetivo, destinação, execução e resultado observado.

Um extrato de transação pode demonstrar pagamento entre endereços. Não mostra, sozinho, hectares restaurados, biodiversidade ou benefício aos produtores locais. A experiência adequada oferece documentação financeira, explicação da apuração, responsabilidades e evidências externas de impacto.

A diferença entre transparência e publicidade é importante: um painel cheio de números não garante compreensão nem relevância. Deve ser possível identificar período, origem, método e limite de cada indicador.

### 3.4 Gabriel: autonomia e verificação técnica

A persona cripto-nativa quer endereço do contrato, rede, código verificado e explicação dos poderes administrativos. Para esse perfil, ocultar totalmente a camada técnica reduz confiança.

A resposta é permitir uma trilha de autocustódia direta e detalhes técnicos acessíveis. O mesmo direito econômico precisa ser apresentado nas jornadas assistida e direta. Só a maneira de operar muda.

A persona histórica deseja fracionamento e mercado secundário. Esses desejos não viraram regras da entrega: os IBT são indivisíveis e as transferências ordinárias estão bloqueadas. Personas revelam preferências; não obrigam a implementar todas elas.

### 3.5 O mapa de empatia complementa a persona

A persona resume um perfil. O mapa de empatia explora o que essa pessoa pensa, sente, ouve, diz e faz, além de suas dores e ganhos. A utilidade está em transformar uma descrição abstrata em decisões observáveis.

Se a dor é exposição pública, o design evita rankings e divulgação de reservas. Se o medo é perda de acesso, explica recuperação e atendimento. Se o ganho esperado é auditabilidade, oferece fonte, recibo e metodologia.

Não se deve converter uma frase imaginada da persona em evidência de demanda. Ela é uma hipótese sobre o usuário, útil para criar e depois validar a solução.

### 3.6 Matriz CSD: organizar o grau de conhecimento

CSD significa certezas, suposições e dúvidas. A ferramenta ajuda a decidir o que já pode orientar uma escolha e o que precisa de investigação. Uma certeza deve possuir fundamento; uma suposição é uma aposta explícita; uma dúvida deve produzir uma pergunta verificável.

No artefato inicial, algumas certezas envelheceram mal: a captação não ficou destinada à construção, e o smart contract não garante aplicação ambiental dos recursos. Essa revisão é parte do uso correto da ferramenta. O rótulo não torna uma afirmação permanentemente verdadeira.

**Exemplo aplicado:** “O público prefere compra assistida” é uma suposição. Uma validação possível compara compreensão e conclusão da jornada com e sem assistência. A existência da persona Helena não é suficiente para encerrar a dúvida.

### 3.7 Stakeholders: poder, interesse e impacto

A matriz orienta a intensidade e a forma de relacionamento. A IBITI e os participantes estratégicos precisam de proximidade; reguladores e autoridades ambientais podem condicionar a operação; comunidade, trabalhadores e produtores precisam receber informação e ter espaço para tratar efeitos que os atingem.

O desenho aproxima interesse e impacto em um eixo, mas são conceitos diferentes. Alguém pode não querer comprar tokens e ainda assim sofrer impacto relevante da operação. Por isso, baixo interesse comercial não justifica pouca atenção social.

### 3.8 A jornada emocional explica a ordem das telas

A sequência é descoberta, avaliação, fricção tecnológica, aquisição, pertencimento e experiência física. O ponto de queda é a fricção: o interessado percebe que talvez precise entender carteiras, segurança e transações para participar.

A interface progressiva responde a isso mostrando a próxima ação necessária. Primeiro cadastro e interesse; depois aprovação e conferências; depois pedido de compra; então pagamento e confirmação. No uso da hospedagem, a tarefa principal é consultar cotas e solicitar datas.

Detalhes sob demanda reduzem carga mental, mas limites relevantes precisam estar visíveis antes da decisão correspondente. Iliquidez deve ser conhecida antes de comprar. Uma taxa de rede deve ser informada antes de assinar. Cancelamento precisa ser explicado antes de confirmar uma reserva.

### 3.9 As três modalidades de custódia

| Modalidade | Quem controla a chave | Papel da assistência |
|---|---|---|
| Custódia IBITI | A instituição, conforme uma infraestrutura a ser definida para operação real. | Operar em nome do titular com autorização, guarda e recuperação institucionais. |
| Autocustódia assistida | O próprio titular. | Orientar o uso sem assumir a propriedade da chave. |
| Autocustódia direta | O próprio titular. | Disponibilizar informação e suporte quando necessário, com maior autonomia cotidiana. |

“Assistida” não é sinônimo de “custodiada”. A distinção muda responsabilidade por assinatura, perda de chave e movimentação. A demonstração local consegue operar sem extensão usando contas do Anvil; isso não é uma infraestrutura comercial de custódia concluída.

## 4. Sprint 2 - Riscos éticos e impacto

Fontes: PDF de 13 páginas e documento Markdown. Este capítulo trata dos impactos da solução; não reproduz o artefato de Gestão de Projeto.

### 4.1 O que torna um problema também ético

Um risco técnico descreve, por exemplo, a possibilidade de falha em um saque. A análise ética pergunta quem sofre o dano, quem tinha capacidade de compreendê-lo, quem decidiu assumir esse risco e quais meios de reparação existem.

No IBITI, o participante pode ser financeiramente experiente e tecnicamente iniciante. A confiança na organização não transfere automaticamente para ele a capacidade de avaliar um smart contract. Por isso, clareza, suporte e responsabilidade continuam relevantes mesmo quando o código está aberto.

O artefato organiza cinco dilemas: adesão, financeirização do propósito, concentração, dependência tecnológica e privacidade. A estrutura comum é decisão de origem, impacto, pessoas afetadas, escolha envolvida e resposta possível.

### 4.2 Comunidade engajada não é demanda confirmada

A base de hóspedes e parceiros reduz a distância inicial de relacionamento, mas não demonstra disposição para comprar o IBT. Uma pessoa pode apoiar a conservação e preferir pagar por hospedagens quando as utiliza. Outra pode gostar da proposta e rejeitar a falta de liquidez.

Uma baixa adesão pode criar pressão para suavizar riscos na comunicação, acelerar uma oferta ou prometer benefícios ainda não definidos. A resposta responsável é verificar interesse com informação suficiente e distinguir cadastro, intenção e compra.

O cadastro do portal é uma manifestação de interesse sem compromisso. Essa separação evita tratar um número de inscritos como captação realizada. Também permite aprender sobre demanda sem criar prematuramente uma obrigação de compra.

### 4.3 Retorno financeiro pode pressionar o propósito regenerativo

Quando o pagamento depende de faturamento, aumentar ocupação e diária melhora o fluxo projetado. Mas o território pode precisar de baixa densidade, limites de circulação ou fechamento temporário para conservação.

Imagine que uma restrição ambiental reduza a ocupação em um período de alta procura. O efeito financeiro é negativo no curto prazo, enquanto o efeito ecológico pode ser necessário para preservar o próprio ativo que sustenta a experiência. Uma projeção que ignora essa possibilidade apresenta uma visão incompleta do negócio.

O artefato propõe primazia regenerativa e projeções compatíveis com capacidade ecológica. A finalidade é comunicar antecipadamente que nem toda oportunidade de receita deve ser perseguida. Uma cláusula proposta, entretanto, só produz a proteção pretendida se for adequadamente formalizada e aplicada.

### 4.4 Concentração econômica pode gerar influência sem voto

Não dar voto formal aos titulares não impede pressão comercial ou reputacional. Um participante com grande exposição pode exigir tratamento preferencial ou ameaçar conflito quando o desempenho fica abaixo de sua expectativa.

O teto de 20 IBT reduz a concentração individual. Com 150 unidades, 20 representam 13,33% do royalty, equivalentes a 2 pontos percentuais da receita bruta se mantidos durante todo o período. Não são 2% do total do royalty. A expressão abreviada presente no artefato ético precisa desse denominador explícito.

O controle por pessoa é mais adequado ao objetivo do que apenas por carteira, porque uma pessoa pode abrir vários endereços. Mesmo assim, a qualidade do controle depende da verificação civil e de como se tratam pessoas ou entidades relacionadas. O limite de tokens também não distribui os poderes do owner.

### 4.5 Automatizar cria uma obrigação de manutenção

Automação reduz repetição e pode tornar a execução verificável. Ao mesmo tempo, cria dependência de código, chaves, infraestrutura e profissionais capazes de investigar incidentes.

O problema ético aparece quando o participante é afetado por uma regra que não entende, não controla e não consegue contestar. Pausa, recuperação, documentação e atendimento são respostas parciais. O fato de haver uma função de emergência não garante uma equipe preparada para usá-la.

O contrato atual não usa proxy de atualização. Assim, corrigir uma falha pode exigir uma nova implantação e um plano de tratamento das posições existentes. A pausa contém operações; não reescreve o bytecode nem desfaz pagamentos anteriores.

### 4.6 Transparência financeira e privacidade precisam de granularidade adequada

É possível demonstrar apuração e distribuição sem publicar nomes, CPFs ou reservas. O desenho usa informações financeiras consolidadas, eventos e referências a relatórios. O cadastro pessoal e a utilização das hospedagens ficam fora da blockchain.

Mesmo assim, um endereço público pode ser relacionado a uma pessoa por informação externa. Por isso, pseudonimização é uma descrição mais precisa que anonimato. Além da privacidade individual, a granularidade do faturamento pode revelar informações comerciais ao concorrente.

A resposta não é publicar tudo nem esconder tudo. É justificar quais informações cada público precisa para verificar os direitos e quais devem permanecer sob acesso controlado.

### 4.7 Impacto precisa de uma cadeia de evidências

Uma análise útil separa **recurso**, **atividade**, **entrega** e **resultado**. Dinheiro recebido é recurso. Contratar uma ação de restauração é atividade. Executar o trabalho em determinada área é entrega. Mudanças observadas no ecossistema são resultados que exigem método e acompanhamento.

Um hash do relatório ajuda a conferir se o arquivo apresentado é o mesmo que foi referenciado. Ele não atesta que os fatos narrados aconteceram. Da mesma forma, a emissão de tokens não demonstra adicionalidade ambiental: seria preciso examinar o que ocorreu por causa da iniciativa e o que ocorreria de qualquer modo.

Essa cadeia é uma leitura aplicada ao projeto, não um sistema de medição de impacto já entregue. Sua utilidade é impedir que a transparência tecnológica seja usada como substituta de evidência socioambiental.

## 5. Sprint 2 - Whitepaper Técnico do Ativo Digital

Fontes: PDF de 31 páginas e versão Markdown completa, incluindo arquitetura, tabelas e apêndices.

### 5.1 Por que um whitepaper liga negócio e tecnologia

O whitepaper transforma a proposta em um modelo comum: qual ativo existe, quais direitos carrega, quem pode atuar e como os fatos externos chegam ao sistema. Sua função é permitir que uma pessoa de negócio e uma pessoa técnica discutam a mesma estrutura.

No documento da Sprint 2, várias descrições ainda são propostas de arquitetura. O texto antecede mudanças importantes da implementação. Ele deve ser lido como a construção do modelo, não como um manual literal de todas as funções atuais.

### 5.2 Um único token com três dimensões

A escolha de um ativo único evita exigir que o participante mantenha um token de hospedagem, outro de membership e outro de royalty. Também evita regras de conversão e sincronização entre três instrumentos.

O ganho de simplicidade exige separar o ciclo de cada direito. A hospedagem é consumível; o royalty depende do período e da posse; o pertencimento depende das condições do programa. Usar uma experiência não pode apagar automaticamente o recebimento econômico remanescente.

**Exemplo:** uma pessoa compra dois IBT, usa uma hospedagem e continua com dois tokens. Na entrega atual, o banco registra a cota utilizada; o saldo on-chain permanece dois. Seus royalties continuam sujeitos ao tempo de posse desses dois IBT.

### 5.3 Por que a experiência não queima o token

Se o token fosse destruído no uso da hospedagem, o mesmo ato também eliminaria o saldo utilizado para representar os outros direitos. Seria necessário criar um registro substituto para conservar membership e royalties.

O projeto escolhe manter o IBT. No whitepaper inicial, isso aparecia como contadores de unidades ativas e resgatadas no contrato. A implementação posterior levou o consumo da hospedagem para o cadastro por pessoa. O objetivo foi preservado, mas a localização da informação mudou.

### 5.4 Fungibilidade explica a dificuldade de marcar unidades usadas

Um ERC-20 armazena quantidade por endereço. Ele não identifica “o token número 17”. Se uma carteira tem três IBT, as três unidades são intercambiáveis no saldo.

Ao dizer que uma unidade foi usada para hospedagem, surge uma segunda dimensão: saldo econômico e direito de uso disponível deixam de ser o mesmo número. A tentativa inicial de manter contadores no contrato aumentava as regras de movimentação. A solução por pessoa organiza esse histórico na camada que já conhece o atendimento.

Um NFT individualizaria cada unidade, mas traria outro modelo de identidade e transferência. A escolha do ERC-20 faz sentido para direitos econômicos homogêneos; a individualização necessária à reserva pode ficar no pedido de hospedagem, sem transformar cada IBT em um objeto único.

### 5.5 Passaporte: status derivado, não outro ativo

O Passaporte foi concebido como uma condição de pertencimento associada ao IBT. Evitar um segundo token reduz a possibilidade de alguém transferir um ativo e manter indevidamente outro benefício que deveria acompanhá-lo.

O whitepaper explora prioridade de reservas, eventos do território, reconhecimento e benefícios de parceiros. Nem todos esses benefícios têm faixas, disponibilidade ou integração operacional concluídas. A posse pode permitir verificar elegibilidade, mas o serviço correspondente depende de regras e execução fora da blockchain.

O histórico público de uma aquisição pode permanecer registrado depois do encerramento. Isso não torna o benefício perpétuo. Permanência do registro e duração do direito são conceitos diferentes.

### 5.6 Por que quantidade e prazo são decisões econômicas

Dividir um mesmo fluxo em mais tokens reduz o valor por unidade, mantendo o valor total teórico se todos os demais fatores permanecerem iguais. A quantidade também influencia o público, o atendimento e a relação com as experiências.

O supply de 150 é uma premissa de desenho, não uma capacidade física demonstrada de atendimento simultâneo. Um hotel com seis unidades pode atender vários hóspedes ao longo do tempo; ainda assim, datas, sazonalidade e capacidade precisam ser conciliadas com os direitos vendidos.

O prazo de quatro anos limita o compromisso econômico e operacional. Um direito perpétuo exigiria modelar receitas e obrigações para além do horizonte atual, incluindo valor terminal. A implementação atual usa oito semestres desde a abertura, não simplesmente os anos civis 2027 a 2030.

### 5.7 O problema do dado externo

A blockchain conhece os dados enviados a ela, não o faturamento do hotel por observação direta. O operador apura receitas; a IBITI reporta; o contrato calcula o que decorre desse número.

Esse ponto é conhecido como problema do oráculo: conectar um fato do mundo externo a uma regra executada na rede. No projeto, a fonte é administrativa, sem um serviço independente que prove automaticamente a receita. O hash do relatório permite vincular a apuração a um documento, mas não remove essa dependência.

Por isso, o mecanismo completo precisa combinar regra computacional, obrigação de reporte e conferência da informação. A confiabilidade do cálculo e a confiabilidade da entrada são problemas diferentes.

### 5.8 O que a blockchain acrescenta e o que continua centralizado

Saldos, eventos e pagamentos podem ser conferidos por quem conhece o contrato e a rede. As regras executáveis não dependem apenas da tela do portal. Isso reduz a dependência de uma interface específica para consultar a posição registrada.

A administração, a identificação civil, a apuração, o atendimento e a disponibilidade do hotel continuam dependendo de pessoas e sistemas externos. Usar Ethereum não transforma automaticamente a operação em uma organização descentralizada.

### 5.9 Como ler as divergências do whitepaper inicial

O texto contém transferência entre membros, contadores de resgate, recuperação por sucessão e parâmetros financeiros anteriores. Há até uma linha de função mencionando reserva de 5%, enquanto a modelagem principal trabalha com 50 de 150 unidades, um terço. A linha isolada não deve prevalecer sobre o conjunto das decisões e a implementação posterior.

A frase de que o administrador poderia alterar qualquer parâmetro também não descreve o contrato entregue: diversas regras são fixas e não existe um proxy para substituir o código. Um whitepaper é uma especificação discutível e revisável; a evidência do comportamento está na fonte correspondente à instância implantada.

## 6. Sprint 3 - Whitepaper Técnico revisado

Fonte: PDF de 28 páginas, incluindo glossário, memória de cálculo e identificação técnica.

### 6.1 A principal evolução foi separar posse e atendimento

O whitepaper revisado descreve um ERC-20 para propriedade e royalties e um serviço externo para pessoas, cotas e hospedagens. A mudança resolve um problema de modelagem: o titular é uma pessoa que pode ter várias carteiras, enquanto o ERC-20 conhece endereços e quantidades.

Um saldo de cinco IBT não informa se a pessoa já usou duas hospedagens. Também não informa se existe um pedido aguardando confirmação. Esses fatos precisam de um histórico próprio, organizado em torno da pessoa e das operações de atendimento.

Essa divisão mantém as informações pessoais fora do registro público e permite tratar cancelamento, remarcação e conclusão com estados compreensíveis para a equipe do hotel.

### 6.2 Por que balanceOf não é suficiente para liberar hospedagens

Imagine uma pessoa com cinco IBT e duas experiências já utilizadas. Consultar apenas `balanceOf` retornaria cinco, mas existem no máximo três cotas ainda livres, antes de considerar pedidos em andamento.

Na versão histórica que permitia transferências, o problema ficava maior: um token poderia circular entre carteiras e parecer novo se o sistema recriasse uma cota toda vez que detectasse saldo. O livro de cotas evita essa recriação acompanhando direitos livres, reservados, utilizados e em devolução.

A política histórica chamada `unused-first-v1` movia apenas direitos livres, até a quantidade de tokens transferida. O código atual conserva compatibilidade de leitura desse histórico, embora bloqueie novas transferências ordinárias. A presença da política no código não autoriza afirmar que há mercado secundário na entrega atual.

### 6.3 Pessoa e carteira têm identidades distintas

Uma carteira é um mecanismo de controle criptográfico. Uma pessoa é o sujeito do atendimento, dos limites e das obrigações. Assinar um desafio prova controle de uma chave, não nome, CPF ou capacidade civil.

O serviço vincula carteiras ao cadastro e agrega o histórico. Isso impede tratar cada novo endereço como um novo cliente com novos direitos de hospedagem. Na revisão da Sprint 3, o limite pessoal era principalmente verificado no backend; a Sprint 4 acrescenta o identificador opaco e o saldo agregado no próprio contrato.

### 6.4 O que significa uma propriedade do sistema

Uma propriedade é uma regra que deve continuar verdadeira ao longo das operações. Não é apenas uma tela funcionando em um exemplo.

| Propriedade | Consequência prática |
|---|---|
| A emissão total é conservada. | Comprar transfere estoque; recuperação substitui acesso sem criar riqueza nova. |
| Utilizar uma cota não reduz IBT. | A hospedagem não apaga a participação econômica remanescente. |
| Pagamento quitado não pode ser repetido. | Um segundo saque da mesma obrigação deve ser rejeitado. |
| Uma carteira não vira cadastro de outra pessoa por simples reapresentação. | O histórico de uso e os limites não são reiniciados. |
| Um pedido reserva a cota uma vez. | Confirmar e concluir mudam estados, sem novo desconto. |

Essas propriedades orientam o desenho e os testes. A expressão “garantida pelo sistema” precisa sempre indicar qual camada a impõe. O contrato não consegue garantir sozinho um histórico que existe apenas no banco.

### 6.5 Snapshot e tempo de posse representam concepções diferentes

Na revisão da Sprint 3, o royalty usava o saldo no momento da apuração. É uma fotografia: quem detém a unidade naquela transação participa segundo esse saldo, independentemente de quando a comprou.

Isso é simples, mas pode atribuir o mesmo valor a quem entrou no início e a quem entrou imediatamente antes da apuração. A revisão posterior passou a acumular quantidade multiplicada pelo tempo em cada semestre.

O nome de um campo como `snapshotSupply` pode permanecer no código por compatibilidade ou histórico. O método efetivo deve ser identificado pela fórmula que calcula a obrigação, e não apenas pelo nome da variável.

### 6.6 Limitar oito apurações não é impor semestres

Um contador que permite no máximo oito chamadas não estabelece quando cada chamada pode ocorrer. Na implementação histórica, o espaçamento dependia da operação externa. Na atual, os limites dos períodos são calculados a partir da abertura, e o contrato rejeita apuração prematura.

Essa diferença mostra por que uma política precisa ser traduzida em condição executável quando se deseja proteção automática. “Semestral” no documento e `lastReportedPeriod < 8` no código não significam, isoladamente, a mesma coisa.

### 6.7 Arquitetura comercial prevista e integração disponível

O documento descreve Ethereum, IBT, BRZ e uma ponte entre sistema bancário e blockchain. A prova disponível usa Sepolia e tBRL. A referência a uma prestadora de serviços não demonstra contratação, liquidação em reais ou custódia institucional em operação.

O serviço de hospedagens também não possui, por essa descrição, um inventário hoteleiro real integrado. Receber um pedido no banco e confirmar disponibilidade com o hotel são atos diferentes. O whitepaper revisado torna essa separação mais clara que as propostas iniciais.

### 6.8 Memória de cálculo e identificação técnica

A memória de cálculo permite rastrear a receita, os 15% e o valor por token. A identificação técnica permite localizar rede, contrato, versão e fonte correspondente. São duas formas de rastreabilidade: uma explica o número; outra identifica o programa que executa parte das regras.

A referência financeira desse whitepaper é R$ 37.055,19 e taxa de 17,8609% ao ano. A referência escolhida depois é a do memorando v2. Conservar a edição anterior ajuda a explicar a evolução, mas exige informar qual hipótese mudou.

## 7. Sprint 3 - Estrutura jurídica e a aplicação de Howey

Fonte principal: `IBIToken_Estrutura_Juridica.md`, incluindo quatro minutas. As explicações a seguir são de estudo da estrutura proposta, sem converter a interpretação acadêmica do grupo em autorização regulatória.

### 7.1 Por que o projeto utilizou o teste de Howey

O IBT combina uma utilidade concreta com expectativa de recebimento econômico. Essa combinação exige examinar se ele está sendo apresentado apenas como acesso a serviço ou como uma participação cujo retorno depende da atividade de terceiros.

O teste de Howey organiza essa investigação. Sua função no projeto é identificar a substância econômica da relação, em vez de aceitar automaticamente os nomes “cota de apoiador”, “Passaporte” ou “utility token”. O preço calculado a partir de royalties futuros é um sinal de que o componente econômico merece análise própria.

**Localização precisa:** a aplicação explícita de Howey está no artefato de Estrutura Jurídica da Sprint 3. O memorando trata dos direitos, riscos e necessidade de enquadramento; a conexão entre os dois explica por que a discussão jurídica afeta a oferta. Howey não é uma fórmula para calcular o preço.

### 7.2 De onde vem o raciocínio

No caso norte-americano de 1946, a venda de parcelas de um pomar era combinada com serviços de cultivo e comercialização, dos quais os compradores esperavam resultado. A análise considerou o arranjo econômico completo, e não apenas o título dado aos contratos. O teste examina aporte, empreendimento comum e expectativa de lucro decorrente dos esforços de terceiros; didaticamente, esses elementos costumam ser separados em quatro perguntas. [Decisão SEC v. W. J. Howey Co.](https://www.law.cornell.edu/supremecourt/text/328/293).

O paralelo útil para o IBITI é a dependência de uma operação administrada por outra parte. A comparação não significa identidade jurídica entre os casos nem aplicação automática da lei dos Estados Unidos no Brasil.

### 7.3 Aplicação ao IBIToken, elemento por elemento

| Elemento da análise | Fato da proposta IBITI | Por que esse fato importa |
|---|---|---|
| Aporte de valor | O participante paga para adquirir IBT. | Há comprometimento econômico, mesmo que o pagamento seja convertido em uma moeda digital. |
| Empreendimento comum | Os participantes dependem do mesmo Glamping e do mesmo fluxo de royalties. | O desempenho da operação afeta o conjunto dos titulares. |
| Expectativa de resultado econômico | O token prevê royalties e tem preço baseado no valor presente desses fluxos. | A relação vai além do consumo de uma hospedagem isolada. |
| Esforços de terceiros | Operador e IBITI cuidam da atividade, apuração, reporte e obrigações. | O comprador não precisa administrar o hotel para receber o fluxo projetado. |

A tabela é a aplicação didática da análise aos fatos do projeto. Um participante comprar por afinidade com a causa não elimina o direito econômico oferecido. Da mesma forma, usar uma hospedagem não torna inexistente a expectativa de royalties que acompanha o instrumento.

### 7.4 Por que o benefício de hospedagem não encerra a análise

Um produto pode oferecer serviço e remuneração no mesmo arranjo. A hospedagem é uma utilidade real, mas o conjunto precisa ser examinado: preço, direitos, comunicação, destinação e relação com o operador.

Compare dois exemplos conceituais. Em um, a pessoa paga apenas por três noites em data definida. Em outro, paga por hospedagem e por uma parcela de receitas futuras administradas por terceiros. A segunda estrutura acrescenta uma dimensão econômica que não pode ser apagada trocando o nome do comprador para “apoiador”. Esses exemplos ajudam a distinguir a lógica; não são conclusões regulatórias universais.

O artefato sugere que um utility puro retiraria um dos elementos de Howey. A leitura mais precisa é que remover a remuneração altera o conjunto da relação, especialmente a expectativa de benefício econômico. Não basta declarar que os esforços de terceiros deixaram de existir: um prestador de hospedagem continua trabalhando para entregar um serviço.

### 7.5 A análise brasileira exige cuidado adicional

A CVM adota abordagem funcional e ressalva que a inspiração em Howey não implica identidade com a interpretação estrangeira. O Parecer 40 enumera seis características: aporte, formalização, caráter coletivo, expectativa de benefício econômico, esforço preponderante de empreendedor ou terceiro e oferta pública. Portanto, o quadro de quatro elementos é uma introdução útil, mas não substitui o exame brasileiro. [Parecer de Orientação CVM 40, seção 4.1](https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/pareceres-orientacao/anexos/Pare040.pdf).

O art. 2º, IX, da Lei 6.385 relaciona a hipótese residual de contrato de investimento coletivo à oferta pública e a direitos de remuneração decorrentes do esforço de empreendedor ou terceiros. Assim, a afirmação do artefato de que a natureza seria necessariamente idêntica independentemente da distribuição é excessivamente categórica para esse fundamento específico. É necessário examinar tanto o instrumento quanto a forma concreta de oferta. [Lei 6.385, art. 2º](https://www.planalto.gov.br/ccivil_03/leis/l6385.htm).

Isso não significa que chamar a colocação de privada resolva o enquadramento. Significa que a conclusão depende de mais fatos do que a existência de quatro respostas afirmativas.

### 7.6 Oferta privada é uma condição factual, não um rótulo

O artefato propõe convites pessoais, curadoria e público restrito. A intenção é manter uma relação de distribuição delimitada. Porém, uma futura execução precisa ser comparada com essa descrição: canais utilizados, público alcançado, publicidade, conteúdo e acesso às condições.

O art. 3º da Resolução CVM 160 considera comunicações que alcançam diversos destinatários e cujo conteúdo e contexto buscam despertar interesse ou prospectar investidores para determinados valores mobiliários. Uma inscrição pública, isoladamente, não permite concluir tudo sobre a natureza da operação; tampouco um aviso de “uso restrito” neutraliza qualquer forma de divulgação. [Resolução CVM 160, texto consolidado](https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol160consolid.pdf).

Na demonstração, o cadastro simula interesse sem compromisso. Não equivale a uma oferta comercial executada. Para a operação pretendida, não é adequado afirmar que uma rota regulatória está dispensada ou descartada apenas porque parece simples ou cara.

### 7.7 Howey, CAPM e Monte Carlo têm funções diferentes

| Ferramenta | Pergunta que ajuda a responder | O que não demonstra |
|---|---|---|
| Howey e análise brasileira de CIC | Qual é a natureza econômica e jurídica da relação proposta? | Preço justo, autorização de oferta ou garantia de retorno. |
| CAPM e WACC | Qual taxa de desconto foi adotada e como foi formada? | Demanda pelo token ou desempenho futuro certo. |
| Fluxo de caixa descontado | Quanto os fluxos projetados valem hoje sob essas premissas? | Que os fluxos vão ocorrer. |
| Monte Carlo | Como a distribuição de resultados muda quando variam entradas modeladas? | Todos os riscos possíveis ou probabilidade real independente das hipóteses. |

O uso conjunto é coerente porque uma operação pode ter cálculo financeiro reproduzível, incerteza econômica relevante e enquadramento jurídico ainda pendente. Resolver uma dimensão não resolve automaticamente as demais.

### 7.8 Lastro contratual, recebível e garantia não são sinônimos

O projeto chama de lastro o direito a uma parcela da receita. Para esse direito existir e ser exigível na operação pretendida, é necessário definir devedor, beneficiário, base, prazo e obrigações. O token registra uma representação, mas não substitui esses elementos.

Receber royalties também não transforma o titular em coproprietário do hotel. A expressão “ativo real” não significa, por si, hipoteca, garantia de principal ou possibilidade de executar o imóvel.

O artefato escolhe emissão direta e reconhece ausência de patrimônio separado. A consequência a compreender é a exposição ao risco patrimonial do emissor e ao desenho efetivo das obrigações. Um endereço de tesouraria separado no software não cria automaticamente segregação patrimonial reconhecida juridicamente.

### 7.9 Quem faz o quê nos instrumentos propostos

**Instrumento de emissão:** descreve emissor, unidades, direitos, limites e vigência. Sua função é delimitar o objeto que o participante adquire. Deve ser conciliado com o código e com o memorando.

**Termo de adesão e ciência de riscos:** registra as condições aceitas, verificações e informações prestadas ao participante. A assinatura não transforma projeção em certeza nem permite tratar informação contraditória como suficientemente esclarecida.

**Contrato com prestadora de serviços de ativos virtuais:** define os serviços efetivamente contratados, como conversão e integração financeira. Transfero e BRZ aparecem como referências pretendidas. Não há comprovação de contratação comercial no conjunto analisado.

**Aditivo com operador do Glamping:** conecta a operação física à obrigação de royalty. É especialmente relevante porque o contrato inteligente não consegue exigir sozinho que o operador informe a receita correta ou deposite recursos.

As quatro peças são minutas acadêmicas. Alguns campos e termos precisam de definição. Datas fixas de encerramento, transferências a terceiros e queima final aparecem no histórico, mas não descrevem integralmente a entrega atual.

### 7.10 Identificação, assinatura e proteção de dados

Identificação civil responde quem é a pessoa. A assinatura da carteira responde se alguém controla determinada chave. A autorização administrativa responde se o cadastro pode participar. São verificações complementares.

Validar o formato do CPF não comprova que ele pertence ao solicitante. Marcar um cadastro como aprovado na demo não realiza uma diligência real. Da mesma forma, um identificador opaco on-chain reduz exposição direta, mas não elimina a responsabilidade pelo banco que associa pessoa e carteira.

O projeto usa essa separação para manter dados pessoais fora da blockchain e aplicar limites na camada adequada. Processos comerciais de identificação, retenção, atendimento a direitos e continuidade permanecem dependentes de definição e operação reais.

### 7.11 Tributação, sucessão e solução de conflitos

O histórico jurídico apresenta hipóteses tributárias que não podem ser transplantadas automaticamente para todo recebimento. Compra, alienação, remuneração, prestação de serviço e conversão são fatos distintos. Uma faixa de ganho de capital mencionada no documento não define, sozinha, a tributação do royalty.

Recuperar a carteira da mesma pessoa também é diferente de transferir direitos a herdeiros. A implementação atual trata recuperação de acesso; sucessão exige alterar o titular civil e uma análise própria. A proteção de acesso não deve ser apresentada como procedimento sucessório completo.

O foro indicado nas minutas foi uma escolha provisória do redator. Não é uma característica técnica do token. Esses exemplos mostram por que cláusulas institucionais dependem de partes, domicílios e relações efetivas, e não apenas do modelo de software.

## 8. Sprint 3 - Guia de Comunicação

Fonte: PDF de 23 páginas, incluindo telas, catálogo de mensagens, diretrizes visuais e complemento sobre cotas por pessoa.

### 8.1 Comunicação faz parte do funcionamento

O usuário toma decisões a partir da interface e do atendimento, não apenas lendo o contrato. Uma mensagem incorreta pode levá-lo a acreditar que comprou, que recebeu ou que reservou algo quando a operação ainda está pendente.

O guia busca consistência entre linguagem, estados do sistema e direitos. A tecnologia deve estar disponível para conferência, enquanto a jornada principal explica a tarefa em palavras familiares.

### 8.2 Os dez princípios e sua razão prática

| Princípio | Razão aplicada ao IBITI |
|---|---|
| P0 - Essencial rapidamente compreensível | O participante precisa saber o que recebe e qual é a próxima ação. |
| P1 - Experiência primeiro, dinheiro com sobriedade | A narrativa respeita a proposta de hospitalidade sem transformar projeções em promessa. |
| P2 - Explicar direitos e limites | Evita descoberta tardia de iliquidez, prazo ou restrições. |
| P3 - Técnica acessível sob demanda | Reduz fricção sem retirar possibilidade de verificação. |
| P4 - Terminologia consistente | Evita confundir token, cota, pedido, saque e uso da hospedagem. |
| P5 - Números com origem e data | Permite compreender e refazer as contas. |
| P6 - Erro com explicação e próximo passo | Ajuda a recuperar a jornada sem adivinhar o que fazer. |
| P7 - Discrição | Reduz exposição de participantes e informações pessoais. |
| P8 - Mesmos fatos em profundidades diferentes | A jornada assistida não pode receber uma versão econômica diferente da direta. |
| P9 - Transparência sobre centralização | Explica o papel da IBITI na entrada de dados e administração. |

Esses princípios podem ser preservados mesmo quando as telas e as funções mudam. Os exemplos do guia precisam acompanhar o código atual: `markRedeemed`, envio a outro membro e datas fixas pertencem a estágios anteriores.

### 8.3 Simplificar a linguagem sem esconder a natureza do produto

“Sua parte do royalty” pode ser mais compreensível que um nome de função. Porém, banir palavras como investimento não altera o direito econômico oferecido. A análise jurídica deve continuar coerente com a comunicação.

O trecho histórico “não é um título” precisa ser tratado com cuidado diante da própria análise de possível valor mobiliário. A formulação segura para explicar o modelo é: o IBT não concede participação societária nem retorno garantido; seu enquadramento depende da estrutura e da distribuição.

Também não se deve prometer “acesso garantido” quando a hospedagem depende de disponibilidade. A experiência pode ser um direito contratual, mas o agendamento exige condições operacionais claras.

### 8.4 Estado do sistema é uma informação de negócio

| Estado | Significado que a interface deve transmitir |
|---|---|
| Interesse cadastrado | A pessoa manifestou intenção; não existe compra concluída. |
| Cadastro aprovado | A análise da etapa foi concluída; ainda podem faltar conferências para comprar. |
| Transação enviada | A rede recebeu a solicitação; a confirmação ainda deve ser acompanhada. |
| Compra confirmada | A evidência da compra foi reconhecida no ambiente correspondente. |
| Pedido de hospedagem recebido | A cota foi separada; disponibilidade e confirmação do hotel são outra etapa. |
| Royalty disponível | Existe obrigação financiada para saque, conforme a modalidade. |
| Royalty pago | A liquidação correspondente foi registrada; deve haver identificação do evento. |

Misturar esses estados produz expectativas erradas. Um botão clicado não é recibo; um saldo projetado não é dinheiro disponível; um pedido recebido não é estadia confirmada.

### 8.5 Uma mensagem de erro deve explicar o fato conhecido

O padrão útil é fato, motivo e próximo passo. Exemplo: “Esta compra ultrapassa o limite de 20 IBT por pessoa. Você já possui 18. Escolha até duas unidades”. A mensagem transforma uma restrição abstrata em uma ação possível.

É preciso evitar explicações falsas. `NothingToClaim` pode significar que não há valor pendente, inclusive porque já foi sacado; não autoriza afirmar sempre que a carteira não tinha tokens na apuração. O texto deve usar o estado que o sistema conseguiu verificar.

Da mesma forma, uma falha de consulta ao RPC não significa que a pessoa perdeu tokens. A comunicação precisa distinguir indisponibilidade de informação de alteração efetiva do saldo.

### 8.6 Como deve ser explicado um extrato

Um extrato precisa identificar período, receita reportada, percentual do royalty, critério de participação, valor devido, status, moeda e evidência. Na entrega atual, a participação inclui tempo de posse, portanto “três de 150” pode ser insuficiente se a aquisição ocorreu no meio do semestre.

Antes da primeira apuração, a ausência de dados não deve parecer perda financeira. A mensagem deve explicar que o período ainda não foi apurado. Se a abertura não está confirmada, não se deve inventar uma data certa para o primeiro pagamento.

### 8.7 Acessibilidade ajuda a evitar decisões erradas

Estados precisam ser distinguíveis por texto e forma, não apenas por cor. Navegação por teclado, foco visível, rótulos claros e mensagens anunciadas por tecnologias assistivas permitem que mais pessoas concluam as tarefas.

O guia adota 44 × 44 pixels como alvo de toque. É uma boa escolha de projeto, mas sua referência normativa deve ser precisa: o critério WCAG 2.2 2.5.8, nível AA, usa 24 × 24 pixels CSS com exceções; 44 × 44 corresponde ao critério aprimorado 2.5.5, nível AAA. [W3C: tamanho mínimo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) e [tamanho aprimorado](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html).

A paleta, as fontes e as especificações não comprovam sozinhas acessibilidade da interface implementada. O comportamento efetivo de foco, leitura, estados e contraste precisa ser observado no produto.

### 8.8 O complemento de hospedagens registra a evolução do modelo

As telas adicionais deixam de tratar uso de hospedagem como resgate no contrato. Mostram cotas por pessoa, pedido, remarcação, confirmação e devolução conciliada. Essa evolução aproxima a comunicação do serviço externo que realmente executa o atendimento.

A versão atual avançou também para login convencional e três modalidades de custódia. O guia continua útil como fundamento de linguagem, mas seus exemplos de acesso obrigatório por carteira e aprovação administrativa compartilhada são históricos.

## 9. Sprint 3 - Memorando de Oferta, versão 1

Fonte: PDF de 17 páginas, incluindo notas metodológicas complementares.

### 9.1 O papel do memorando

O memorando reúne termos, racional econômico, direitos, preço, uso dos recursos e riscos em uma narrativa de decisão. O whitepaper explica a arquitetura; a planilha calcula; o memorando conecta o cálculo ao que está sendo proposto ao participante.

Um preço sem direitos definidos não é uma oferta compreensível. Um direito sem informação sobre riscos e obrigações também não é suficiente. Por isso, o documento apresenta tanto o cenário financeiro quanto as condições ainda dependentes de validação.

### 9.2 A principal contribuição da primeira versão

A primeira versão consolida os 150 IBT, os 100 inicialmente ofertados, os 50 retidos e a separação entre captação e royalties. Também explicita que a captação se destina ao ecossistema, não à construção do Glamping.

O preço de referência é R$ 37.055,19, obtido com taxa de desconto de 17,8609% ao ano. O total nominal dos royalties projetados para as 150 unidades permanece próximo de R$ 8,923 milhões. A mudança posterior de preço não dependeu de aumentar ou reduzir esse total nominal: a taxa de desconto também altera o valor presente.

### 9.3 O erro que a precificação procura evitar

Somar quatro anos de recebimentos e chamar esse total de preço ignora o tempo de espera e o risco. O valor nominal projetado por token é aproximadamente R$ 59.488,39. O valor presente é menor porque cada parcela é descontada até a data-base.

Na primeira versão, o desconto a 17,8609% produz R$ 37.055,19. Na segunda, a taxa de 20,4601% reduz o valor para R$ 34.874,14. A diferença é aproximadamente R$ 2.181,05 por token, uma queda de 5,89%, mantendo os fluxos-base comparados.

### 9.4 Cenário, sensibilidade e elasticidade

Cenário reúne um conjunto de hipóteses. Sensibilidade varia entradas para observar o efeito no resultado. Elasticidade compara variações relativas; semielasticidade relaciona a variação percentual do resultado a uma mudança em pontos percentuais de uma taxa.

O anexo da v1 chama de elasticidades pontuais medidas extraídas dos extremos das tabelas. É mais preciso entendê-las como aproximações de sensibilidade no intervalo testado. A ocupação apresenta relação unitária no modelo: aumento relativo de 10% implica aproximadamente 10% de aumento do fluxo, mantendo as demais premissas e sem atingir restrições.

Essa linearidade vem da fórmula adotada. Não demonstra que a operação real sempre responda assim. Na prática, ocupação, preço, capacidade e custos podem interagir.

### 9.5 Por que comparar porcentagem com ponto percentual exige cuidado

Uma ocupação de 20% que recebe aumento relativo de 25% passa para 25%: 20% × 1,25. Um aumento de 25 pontos percentuais a levaria a 45%. São choques muito diferentes.

O mesmo vale para taxas: crescimento da diária de 10% para 15% é aumento de cinco pontos percentuais, ou 50% em termos relativos. As tabelas do memorando precisam ser lidas com a unidade de cada choque.

### 9.6 A utilidade histórica da v1

A v1 ajuda a entender o desenvolvimento do preço e da narrativa. A v2 acrescenta Monte Carlo e adota outra referência de desconto. Não é necessário escolher entre as versões como se uma apagasse a história da outra; é necessário manter cada resultado junto de suas premissas.

Algumas descrições técnicas da v1, como fotografia de saldos, controle pessoal apenas no backend e transferências permitidas, correspondem a uma implementação anterior. A revisão financeira e a revisão do contrato não avançaram sempre no mesmo momento, o que explica parte das divergências documentais.

## 10. Sprint 4 - Memorando de Oferta, versão 2, e planilha

Fontes: memorando de 17 páginas e `Modelo_Glamping_v2.xlsx`, com as cinco abas Valor do token, Wacc, Sensibilidade, Monte Carlo e MC Sorteios. Este capítulo cobre os termos e as seções substantivas do memorando, com explicações adicionais dos mecanismos.

### 10.1 Termos da oferta: o que cada número representa

São 150 IBT no total, 100 inicialmente ofertados e 50 retidos em reserva. A distribuição econômica usa o conjunto de 150, porque a reserva também representa participação no royalty.

Se todos mantivessem suas posições durante um semestre inteiro, os 100 tokens de mercado representariam dois terços do royalty de 15%, ou 10% da receita bruta. Os 50 retidos representariam um terço do royalty, ou 5% da receita. Essa divisão não significa que os compradores recebam 15% e a IBITI receba outros 5% por fora da mesma estrutura.

O teto individual de 20 IBT equivale a 2% da receita bruta em uma participação integral no período: 20 ÷ 150 × 15%. É um limite de participação econômica, não uma taxa de remuneração sobre o preço pago.

### 10.2 Reserva, estoque não vendido e captação são conceitos diferentes

A reserva inicial protege 50 unidades contra venda ordinária. O estoque total da tesouraria começa em 150; à medida que vende, o saldo diminui. Assim, antes de todas as vendas, a tesouraria possui tanto a reserva quanto unidades ainda disponíveis.

O valor atribuído às 50 unidades retidas é valor econômico estimado, não dinheiro recebido. A captação potencial se refere à venda das 100 unidades inicialmente ofertadas. Demanda superior a isso não cria autorização automática de emissão adicional.

A função de reduzir reserva pode liberar parte do estoque existente, mediante decisão administrativa, sem aumentar o supply. Isso muda a disponibilidade para venda e precisa ser compatível com os termos comunicados, mas não cria novos IBT.

### 10.3 O encadeamento do cálculo financeiro

O modelo segue esta sequência: capacidade × ocupação → diárias vendidas → receita de hospedagem e consumo → royalty de 15% → desconto no tempo → valor por token.

Essa sequência permite localizar o motivo de uma mudança. Se a ocupação muda, altera receita e royalty. Se muda apenas a taxa de desconto, o fluxo nominal permanece igual, mas seu valor hoje muda. Se muda a quantidade de tokens, a divisão por unidade muda, mantido o fluxo total.

### 10.4 Premissas operacionais do cenário-base

| Premissa | 2027 | 2028 | 2029 | 2030 |
|---|---:|---:|---:|---:|
| Unidades operacionais | 6 | 20 | 20 | 20 |
| Ocupação | 35% | 20% | 25% | 30% |
| Diária em R$ | 7.333,00 | 8.066,30 | 8.872,93 | 9.760,22 |
| Consumo por hospedagem em R$ | 2.000,00 | 2.090,00 | 2.184,05 | 2.282,33 |
| Dias modelados | 365 | 365 | 365 | 365 |
| Noites médias por hospedagem | 3 | 3 | 3 | 3 |

A diária cresce 10% ao ano; o consumo cresce 4,5%. O modelo usa 365 dias até em ano bissexto. Isso é uma simplificação explícita da modelagem, não um calendário detalhado de reservas.

A ocupação percentual cai em 2028, mas a capacidade passa de seis para vinte unidades. Em 2027, a conta prevê 766,5 diárias ocupadas; em 2028, 1.460. É possível vender mais diárias e ter uma taxa de ocupação menor quando aumenta o denominador da capacidade.

### 10.5 Exemplo completo de formação da receita em 2027

**Diárias esperadas:** 6 unidades × 365 dias × 35% = 766,5.

**Hospedagens esperadas:** 766,5 ÷ 3 noites = 255,5.

**Receita de hospedagem:** 766,5 × R$ 7.333 = R$ 5.620.744,50.

**Receita de consumo:** 255,5 × R$ 2.000 = R$ 511.000,00.

**Receita bruta total:** R$ 6.131.744,50.

**Royalty:** 15% × R$ 6.131.744,50 = R$ 919.761,675 antes do arredondamento de apresentação.

As quantidades fracionárias representam médias esperadas agregadas. Não significam vender meia noite. O consumo é multiplicado pelo número de hospedagens, não por todas as diárias: aplicar o mesmo consumo a cada noite triplicaria essa receita no exemplo.

### 10.6 Por que 15% da receita não é 15% de retorno

Os 15% incidem sobre o faturamento do Glamping. A rentabilidade do comprador depende do preço pago, dos valores que recebe e das datas dos recebimentos. São bases diferentes.

Com receita semestral fictícia de R$ 150.000, o royalty total é R$ 22.500. Um IBT mantido durante todo o semestre participa com R$ 150, antes de considerar os detalhes da moeda e do arredondamento. Isso não equivale a 15% de R$ 34.874,14.

Também não é participação no lucro. Custos maiores podem reduzir o resultado do hotel sem alterar a fórmula percentual sobre a receita, embora possam afetar a capacidade de cumprir o repasse.

### 10.7 Valor presente: por que receber depois vale diferente

O valor presente responde quanto um fluxo futuro equivale hoje sob uma taxa de desconto escolhida. A taxa representa a remuneração requerida na análise pelo tempo e pelo risco considerado.

Para cada ano: **VP do royalty do ano t = royalty do ano t ÷ (1 + k)^t**. O preço por IBT é a soma desses valores dividida por 150.

| Ano | Receita bruta projetada | Royalty de 15% | Valor presente do royalty |
|---|---:|---:|---:|
| 2027 | R$ 6.131.744,50 | R$ 919.761,68 | R$ 763.540,52 |
| 2028 | R$ 12.793.931,33 | R$ 1.919.089,70 | R$ 1.322.540,06 |
| 2029 | R$ 17.521.727,67 | R$ 2.628.259,15 | R$ 1.503.621,50 |
| 2030 | R$ 23.040.990,91 | R$ 3.456.148,64 | R$ 1.641.419,29 |

A soma nominal dos royalties é aproximadamente R$ 8.923.259,16. Seu valor presente é R$ 5.231.121,38. Dividido por 150, resulta em R$ 34.874,1425 por IBT. A soma de parcelas apresentadas com duas casas pode diferir por centavos da conta que preserva toda a precisão.

### 10.8 O que significa CAPM

O modelo utiliza o CAPM para formar o custo do capital próprio, identificado como Ke. A fórmula selecionada é **Ke = Rf + beta × prêmio de risco**.

Rf é a referência de taxa livre de risco adotada no arquivo. Beta é uma medida de exposição ao risco sistemático, aqui aproximada pelo setor Hotel/Gaming. O prêmio de risco é a remuneração adicional usada em relação à referência escolhida.

Na planilha: **14,26% + 0,83 × 7,47% = 20,4601% ao ano**. O produto 0,83 × 7,47% adiciona 6,2001 pontos percentuais aos 14,26%.

Beta 0,83 não significa 83% de chance de sucesso ou perda máxima de 17%. Também não mede sozinho riscos particulares como falha de custódia, indisponibilidade, falta de repasse ou iliquidez do IBT.

### 10.9 Por que usar beta setorial e qual a limitação

Um empreendimento novo não possui histórico de negociação que permita estimar diretamente um beta próprio. A planilha usa uma referência setorial como aproximação. Isso organiza o cálculo, mas não torna idênticos os riscos de uma empresa hoteleira negociada e os de um direito restrito sobre royalties de um único Glamping.

O arquivo apresenta beta desalavancado e sua realavancagem pela fórmula de Hamada. A ideia é separar o risco da atividade do efeito da dívida na exposição do capital próprio. Como a hipótese de dívida é zero, o beta realavancado permanece 0,83.

O prêmio opcional de iliquidez/tamanho está zerado. Isso não comprova ausência desses riscos; apenas indica que não receberam um adicional específico nessa fórmula. A adequação da taxa continua sendo uma hipótese de avaliação a justificar.

### 10.10 O que é WACC e por que coincide com Ke

WACC é o custo médio ponderado das fontes de capital. Sua forma usual no arquivo combina capital próprio e dívida: **WACC = E/(D+E) × Ke + D/(D+E) × Kd × (1-T)**.

E representa capital próprio; D, dívida; Kd, custo da dívida; T, parâmetro tributário do cálculo. No cenário adotado, D é zero, então a parte de dívida desaparece e WACC = Ke.

Isso descreve uma premissa do cenário, não demonstra que todo o grupo IBITI não tenha dívidas. A alíquota de 34% usada na estruturação do custo de capital também não é a tributação universal do titular do token.

O royalty é um direito específico sobre receitas, não uma ação da operadora. Usar essa taxa é uma escolha metodológica para descontar o fluxo; convém reconhecer que risco do recebível, obrigações, concentração e liquidez podem exigir análise própria na estrutura comercial.

### 10.11 Dois métodos na planilha não significam duas taxas simultâneas

A aba Wacc permite escolher entre um cálculo global em dólares, ajustado por paridade de inflação, e um cálculo local em reais. O primeiro retorna aproximadamente 13,3662%; o segundo, 20,4601%. A célula C40 seleciona o método 2, e C44 transmite a taxa escolhida ao valuation.

A diferença mostra que a taxa é sensível à composição metodológica. É necessário manter coerentes moeda, prazo, data dos insumos e tratamento do risco-país. Somar componentes que já incorporam o mesmo risco pode duplicá-lo; retirar um componente pode omiti-lo.

Os números são referências históricas do arquivo analisado, não taxas de mercado verificadas para hoje. Tampouco se deve misturar receita nominal crescente com uma taxa real sem fazer a conversão correspondente.

### 10.12 A conta não avalia separadamente todos os benefícios

O preço financeiro deriva do valor presente dos royalties. A hospedagem e o pertencimento são componentes da proposta de valor, mas não receberam um valuation independente somado ao preço nessa fórmula.

Por isso, dizer que a conta prova o valor de todas as três dimensões seria exagerado. Uma pessoa pode atribuir valor adicional subjetivo à experiência; outra pode descontá-lo por restrições de agenda. A planilha não mede essa disposição individual.

Não há valor terminal ou devolução automática do principal ao fim do quarto ano. O investidor busca recuperar economicamente o preço por meio dos recebimentos e benefícios; o contrato não promete recomprar o IBT pelo valor inicial.

### 10.13 Captação e precisão decimal

Com preço unitário de R$ 34.874,14, vender 100 unidades gera R$ 3.487.414,00. A planilha apresenta aproximadamente R$ 3.487.414,25 porque multiplica um preço com mais casas decimais e arredonda depois.

A diferença de R$ 0,25 tem origem numérica, não representa dinheiro desaparecido. Para uma oferta operacional, preço cobrado, arredondamento e total divulgado precisam seguir a mesma regra.

No contrato de teste, a stablecoin tem seis casas. O preço configurado de 34.874,14 tBRL corresponde a 34.874.140.000 unidades mínimas da moeda. Os seis decimais da moeda de pagamento não tornam o IBT fracionável: o IBT continua com zero casas.

### 10.14 Cenários bear e bull

O memorando varia a curva de ocupação em -25% e +25%, mantendo diária e desconto. O valor por token passa para R$ 26.155,61 e R$ 43.592,68.

O choque é relativo. Para ocupação-base de 35%, o bear usa 26,25%, e o bull usa 43,75%. As tabelas de sensibilidade também usam outra faixa, de -20% a +20%. As duas análises coexistem; não devem ser descritas como a mesma grade.

Esses cenários mostram consequência, não probabilidade. Chamar uma coluna de pessimista não demonstra que aquele seja o pior resultado possível.

### 10.15 O que a sensibilidade permite concluir

Na faixa testada, a ocupação move fortemente o preço porque multiplica tanto hospedagem quanto consumo. Se variar 20% e todo o resto permanecer fixo, o fluxo e seu valor presente variam proporcionalmente.

Com ocupação-base, crescimento da diária de 5% ou 15% gera aproximadamente R$ 32.359,86 ou R$ 37.552,55 por token. Desconto próximo de 18,46% ou 22,46% gera R$ 36.534,59 ou R$ 33.324,66.

A interpretação é que a validação de demanda merece atenção. A afirmação “ocupação importa mais que WACC” vale para os intervalos comparados. Não é uma lei universal sobre qualquer hotel nem autoriza ignorar uma taxa de desconto inadequada.

### 10.16 Por que acrescentar Monte Carlo

Uma tabela de cenários examina combinações escolhidas. Monte Carlo repete o cálculo muitas vezes com entradas sorteadas segundo hipóteses explícitas. Isso produz uma distribuição de resultados e permite estimar frequências dentro desse modelo.

O objetivo é sair de “o preço-base é X” para “com estas incertezas, os resultados se espalham desta maneira”. Não é prever exatamente o futuro. O método torna visíveis os efeitos das hipóteses, mas depende da qualidade delas.

### 10.17 Como uma linha da simulação é produzida

Cada cenário contém sete sorteios: um nível de ocupação comum aos quatro anos, quatro ruídos anuais, um fator para diária inicial e uma taxa de crescimento da diária. Capacidade, WACC e outras premissas permanecem fixos.

| Entrada | Centro e dispersão adotados | Limites implementados |
|---|---|---|
| Nível comum da ocupação | Média 1; desvio 0,20. | 0,50 a 1,50. |
| Ruído anual da ocupação | Média 0; desvio 0,10. | -0,30 a +0,30. |
| Fator da diária inicial | Média 1; desvio 0,10. | 0,70 a 1,30. |
| Crescimento anual da diária | Média 10%; desvio 3 pontos percentuais. | 0% a 20%. |

Ocupação do ano = ocupação-base × nível comum × (1 + ruído do ano), limitada entre zero e 95%. A diária parte de R$ 7.333 multiplicados pelo fator sorteado e cresce pela taxa daquele cenário. Em seguida, as mesmas fórmulas produzem receita, royalty, valor presente e TIR.

**Exemplo didático:** nível comum de 0,90 e ruído anual de +0,05 levam a ocupação de 35% para 33,075%: 35% × 0,90 × 1,05. O fator comum reduz todos os anos, enquanto o ruído altera cada ano separadamente.

### 10.18 Por que combinar fator comum e ruído anual

O fator comum representa a possibilidade de a tese de demanda estar superestimada ou subestimada durante vários anos. Os ruídos anuais representam oscilações adicionais. Isso evita tratar os quatro anos como resultados totalmente desconectados.

Embora os sorteios de entrada sejam independentes, as ocupações finais dos anos compartilham o mesmo nível comum. Logo, elas ficam relacionadas. A distinção entre independência dos sorteios e dependência das variáveis construídas é importante para entender o modelo.

### 10.19 Normal truncada e valores limitados nas bordas

O texto usa a expressão “normal truncada”. As fórmulas, porém, transformam sorteios com `NORMINV` e depois aplicam `MIN` e `MAX` para limitar resultados.

Se um fator sorteado fosse 1,62 e o teto fosse 1,50, a fórmula o converteria em 1,50. Isso pode acumular resultados exatamente na borda. Uma normal truncada no sentido estatístico amostra a distribuição condicionada ao intervalo e tem outro tratamento das caudas.

A diferença não torna a planilha irreproduzível. Ela esclarece qual procedimento foi realmente implementado e por que o nome usado no texto precisa de precisão.

### 10.20 Semente fixa e reprodução

Os 5.000 cenários usam sorteios gravados com semente 20260924. Isso permite refazer o cálculo a partir das mesmas entradas e comparar resultados. Alterar uma premissa recalcula a planilha sem necessariamente trocar os números aleatórios de origem.

Na conferência realizada em 01/10/2026, os sorteios e os valores presentes foram reproduzidos; a maior diferença de VP ficou em aproximadamente R$ 0,000000000073. A verificação confirma a correspondência numérica com o arquivo, não a validade comercial das premissas.

Reproduzir é conseguir obter o mesmo resultado. Validar economicamente é examinar se o modelo representa de maneira adequada o problema. São atividades complementares.

### 10.21 Como ler média, mediana e percentis

| Métrica | Resultado da simulação | Leitura |
|---|---:|---|
| Média do VP por token | R$ 35.062,09 | Média aritmética dos resultados. |
| Mediana | R$ 34.683,61 | Divide a amostra em duas metades. |
| P5 | R$ 22.221,82 | Aproximadamente 5% dos resultados estão abaixo. |
| P25 | R$ 29.348,70 | Aproximadamente 25% estão abaixo. |
| P75 | R$ 40.435,28 | Aproximadamente 75% estão abaixo. |
| P95 | R$ 48.836,28 | Aproximadamente 95% estão abaixo. |
| Desvio-padrão | R$ 8.104,53 | Mede dispersão entre resultados. |

A faixa P5-P95 contém o centro de 90% dos cenários simulados. Não é garantia de que o resultado real ficará nela. Mínimo e máximo observados também não são limites físicos ou contratuais do retorno.

O preço-base fica próximo, mas não coincide exatamente com a média nem com a mediana. A expressão do memorando de que “coincide com a mediana” deve ser entendida como aproximação, não igualdade numérica.

### 10.22 Por que 51,04% e 2,9% não se contradizem

Em 51,04% dos cenários, o valor presente dos royalties é menor que o preço-base. Em 2,9%, a soma nominal dos royalties é menor que o preço pago. O primeiro cálculo considera a exigência de retorno no tempo; o segundo apenas compara quantidades nominais de dinheiro.

Uma pessoa pode pagar R$ 100 e receber R$ 110 depois de vários anos. Recuperou mais reais nominais do que pagou, mas pode ter recebido menos que sua alternativa de aplicação ou que a compensação exigida pelo risco. Esse exemplo é conceitual, não uma projeção adicional do IBTI.

A frequência de TIR abaixo de 14,26% é 28,14% na planilha. Todos esses números são condicionais às distribuições, às fórmulas e aos riscos incluídos. Os 2,9% não medem a probabilidade total real de perda do projeto.

### 10.23 Precisão da simulação não é precisão das premissas

O erro-padrão da média informado é aproximadamente R$ 114,62. Ele mede o ruído estatístico da média simulada sob o modelo. Não mede o erro de supor determinada ocupação, expansão, preço ou ausência de inadimplência.

Aumentar de 5.000 para 50.000 cenários pode estabilizar estatísticas numéricas, mas não conserta uma hipótese econômica errada. A principal tarefa continua sendo melhorar a base das entradas e examinar riscos omitidos.

### 10.24 O que significa ocupação explicar aproximadamente 75%

A planilha calcula correlações entre entradas e VP, eleva essas correlações ao quadrado e normaliza as contribuições. O fator comum da ocupação responde por aproximadamente 75%; diária inicial, 15,6%; ruídos anuais somados e crescimento, cerca de 4,7% cada.

É uma medida aproximada baseada em associação. Não é demonstração de causalidade nem uma decomposição completa como um índice de Sobol. Os resultados dependem das dispersões atribuídas às entradas e da estrutura da fórmula.

A conclusão aplicada é dar atenção à fundamentação da demanda e à aceitação do preço. Não significa que ocupação seja o único risco importante fora do modelo.

### 10.25 O que ficou fora e por que isso importa

A simulação não incorpora integralmente atraso de abertura, inadimplência do operador, mudanças tributárias, falha tecnológica, perda de custódia, restrições regulatórias ou variação do WACC. Esses eventos podem mudar a forma da distribuição, especialmente sua parte desfavorável.

O documento também sugere que uma correlação negativa entre diária e ocupação poderia estreitar os resultados. Essa é uma hipótese, não uma conclusão garantida. A relação pode variar por segmento, período, posicionamento e restrições de capacidade; seria necessário modelá-la e verificar seu efeito.

Os cenários bear e bull tampouco são extremos: cerca de 13,7% das simulações ficam abaixo do bear e 15,6% acima do bull. A banda cobre apenas parte da distribuição escolhida.

### 10.26 A alternativa de preço no P25

O memorando discute R$ 29.348,70, próximo do P25, como uma possível margem ao comprador. Dentro da simulação, cerca de 75% dos VPs superariam esse valor. O custo seria reduzir a captação de 100 tokens em aproximadamente R$ 552,5 mil.

Essa comparação torna explícito um conflito econômico entre receita de emissão e margem oferecida ao comprador. Não elimina riscos omitidos, não garante retorno e não é uma decisão aprovada de novo preço. A referência adotada continua R$ 34.874,14.

### 10.27 Destinação dos recursos e os dois fluxos de tesouraria

**Fluxo de emissão:** participante paga pela compra → tesouraria recebe → recursos seguem a destinação aprovada ao ecossistema. As categorias propostas incluem fortalecimento operacional, Passaporte e custos de estruturação. Percentuais e cronograma não estão integralmente definidos.

**Fluxo operacional:** Glamping gera receita → receita é apurada → obrigação de royalty é calculada e financiada → titulares recebem os valores devidos. A fonte econômica esperada é a operação do hotel, não a entrada de novos compradores.

Separar os fluxos evita confundir captação com receita operacional. Porém, o código não prova a origem econômica do dinheiro enviado ao contrato nem estabelece sozinho segregação contábil. A conciliação externa precisa sustentar essa distinção.

### 10.28 Economia do titular e TIR

Para um IBT com participação integral nos fluxos anuais projetados, os recebimentos nominais são aproximadamente R$ 6.131,74, R$ 12.793,93, R$ 17.521,73 e R$ 23.040,99. A soma é R$ 59.488,39, cerca de 1,71 vez o preço-base.

A diferença nominal de R$ 24.614,25 representa aproximadamente 70,6% ao longo dos quatro anos. Não é retorno anual de 70,6%, e dividi-lo por quatro não produz a taxa interna de retorno.

TIR é a taxa que zera o valor presente líquido do fluxo: preço pago na saída e recebimentos nas datas seguintes. Como o preço foi definido descontando os mesmos fluxos a 20,4601%, essa é também a TIR-base por construção. A igualdade não é uma segunda prova independente de atratividade.

### 10.29 O calendário financeiro precisa conversar com o contrato

A planilha desconta fluxos anuais no fim de cada ano. O contrato atual trabalha com semestres de calendário desde a abertura e pondera o tempo de posse. Transformar o modelo anual em uma proposta operacional exige definir datas e distribuição do faturamento entre semestres.

Se os recebimentos ocorrerem antes, o valor presente pode mudar. Se a abertura atrasar, muda o tempo de espera desde o investimento. Se a compra ocorrer no meio do semestre, o titular não recebe automaticamente o fluxo integral usado na tabela anual.

Não foi produzido um novo preço para resolver essa diferença nesta revisão. O objetivo é compreender o que o valor de referência calcula e o que ainda precisa ser conciliado.

### 10.30 Governança, riscos e coerência documental

O memorando atribui responsabilidades à IBITI, ao operador e aos titulares e lista riscos regulatórios, de demanda, desempenho, liquidez, concentração, reporte, tecnologia, propósito e privacidade. A finalidade é mostrar dependências do resultado, não apenas colocar um aviso genérico no final.

Várias descrições técnicas ainda refletem a Sprint 3: transferências entre aprovados, snapshot de saldos, limite pessoal apenas externo, calendário sem trava semestral e resgate registrado no token. A implementação da Sprint 4 mudou esses mecanismos. A explicação correta preserva a intenção financeira e identifica a diferença de execução.

Um caso concreto é o arredondamento: na implementação atual, o reporte transfere para o contrato a soma das parcelas devidas. A diferença entre o royalty calculado e essa soma permanece com quem financia o reporte, em vez de ser automaticamente depositada como sobra no contrato.

### 10.31 Como navegar pelas cinco abas

| Aba | Função no raciocínio |
|---|---|
| Valor do token | Reúne premissas operacionais, receitas, royalty, desconto e preço. A célula B24 contém a referência do preço. |
| Wacc | Explica componentes, dois métodos e seleção da taxa de desconto. |
| Sensibilidade | Recalcula valor quando mudam ocupação, crescimento da diária e WACC. |
| Monte Carlo | Apresenta hipóteses, estatísticas, distribuição e interpretação. |
| MC Sorteios | Guarda 5.000 cenários; B:H contêm sorteios, U contém VP por token e AB contém TIR. |

Um rótulo de célula não substitui a fórmula. Foram identificadas pequenas imprecisões textuais, como uma indicação de valor presente associada a consumo quando a conta se refere ao royalty. Para explicar o arquivo, siga as dependências da fórmula até a premissa original.

## 11. Sprint 3 - Implementação do Contrato ERC-20, versão 1

Fontes: contrato, scripts, testes, serviço off-chain e documentos de regras, execução, premissas e deploy da pasta histórica. O nome do artefato é versão 1, embora parte dos arquivos internos já identifique a revisão técnica como v2.

### 11.1 O que essa entrega tornou executável

A implementação histórica já não era apenas um ERC-20 genérico. Acrescentava emissão limitada, reserva, teto por carteira, circulação restrita, administração, pausa, recuperação e royalties. O serviço externo organizava pessoas e utilização das cotas.

Seu valor é mostrar a primeira tradução concreta das escolhas de negócio em regras que rejeitam ações inválidas. A documentação técnica também passou a distinguir o que era realizado na blockchain do que dependia da operação externa.

### 11.2 Compra administrativa e comprovação externa de pagamento

Na compra primária histórica, a administração entregava tokens depois de uma conferência externa. O contrato registrava a entrega, mas não necessariamente cobrava o pagamento na mesma operação.

Essa arquitetura depende de conciliação: alguém precisa confirmar que o dinheiro foi recebido antes de entregar. O evento de compra prova o ato registrado, não a entrada bancária. A revisão posterior acrescentou a compra atômica em stablecoin, mantendo uma via distinta para instâncias sem moeda configurada.

### 11.3 A regra de destinatário com saldo e sua limitação

O desenho histórico usava saldo prévio como parte da restrição de circulação: só a administração iniciava um participante, e transferências de titulares exigiam destinatário já integrante do sistema.

Esse mecanismo restringia entrada, mas não equivalia a identificação civil on-chain. Um endereço com saldo não informa qual pessoa o controla nem se a mesma pessoa possui outras carteiras. A solução posterior passou a registrar uma referência opaca de pessoa e a controlar o agregado no contrato.

### 11.4 Royalties por fotografia e até oito períodos

O reporte calculava 15% da receita informada e dividia segundo os saldos no momento da apuração. Com stablecoin, financiava as obrigações; os titulares sacavam depois. Sem stablecoin, havia registro de liquidação externa.

O máximo de oito períodos limitava a quantidade de apurações, mas não garantia espaçamento semestral. Essa limitação e o uso de fotografia explicam duas evoluções importantes: calendário ancorado na abertura e ponderação por tempo.

### 11.5 Recuperação preservava direitos, mas exigiu salvaguardas adicionais

A recuperação histórica já buscava conservar supply e recebíveis ao substituir uma carteira. Esse é um requisito de continuidade: perder acesso não deveria criar novos tokens nem apagar obrigações de pagamento.

A revisão atual torna o procedimento mais restrito com anúncio, espera de sete dias, validação de destino, cancelamento e vínculo à mesma pessoa. A comparação ajuda a compreender que uma função administrativa capaz de mover posições precisa de proteção proporcional ao poder que concentra.

### 11.6 Por que preservar o histórico técnico

Contratos implantados não mudam quando um arquivo local é editado. O endereço histórico continua associado ao programa que foi publicado naquele momento. Um servidor pode reconhecer várias versões para leitura, mas não pode presumir que uma instância antiga adquiriu uma proteção nova.

Por isso, os testes, documentos e endereços históricos permanecem úteis para reprodução e comparação. Os 60 casos mencionados na documentação anterior não devem ser somados ou comparados diretamente aos 31 testes de uma rodada posterior como se medissem a mesma suíte.

## 12. Sprint 4 - Implementação do Contrato ERC-20, versão 2

Fontes: contrato IBIToken, biblioteca OpeningCalendar, módulos TypeScript, interface, scripts, testes e documentação da implementação entregue. A revisão interna principal é 4.0.0.

### 12.1 Arquitetura: uma responsabilidade em cada camada

O contrato Solidity controla o ativo, os limites, o calendário, a compra, os royalties e a recuperação. O backend Node/TypeScript controla cadastro, vínculos, autorização, pedidos e conciliação. O SQLite guarda o histórico que precisa sobreviver às requisições. A interface HTML/CSS/JavaScript apresenta estados e solicita operações.

O indexador conecta essas camadas lendo eventos da rede. A infraestrutura local usa solc, Anvil e ethers, sem Hardhat. Node 24 ou superior é a referência registrada para o serviço e seu SQLite nativo.

Essa separação permite que um erro de interface não seja suficiente para ultrapassar o teto on-chain, por exemplo. Também deixa claro que o contrato não sabe se a pessoa realmente se hospedou: esse fato pertence ao atendimento e ao banco.

### 12.2 ERC-20 é uma interface, não uma promessa de circulação livre

O padrão oferece operações e consultas como saldo, transferência e autorização de gasto. O IBIToken herda essa estrutura e aplica suas próprias restrições. Uma função existir na ABI não significa que toda chamada seja permitida.

`transfer` e `transferFrom` passam pelas regras comuns em `_update` e `_enforceTransferRules`. Na versão atual, transferências ordinárias são rejeitadas. Portanto, aprovar um terceiro a gastar IBT não abre um caminho alternativo para vender em uma corretora descentralizada.

### 12.3 Emissão, compra e recuperação não são a mesma criação de saldo

O construtor cria 150 unidades. A compra entrega parte do estoque da tesouraria, sem aumentar a emissão. A recuperação pode queimar o saldo da origem e emitir a mesma quantidade no destino, conservando o total ao fim da transação.

A propriedade relevante é preservar 150 no estado final e não permitir emissão administrativa livre. Dizer que nunca existe um `_mint` depois do construtor seria tecnicamente incorreto: existe emissão compensatória na recuperação.

O uso de hospedagem não chama `_burn`. A expiração também não desencadeia uma queima automática. O registro pode permanecer enquanto determinados direitos de uso deixam de estar ativos e recebíveis anteriores continuam exigíveis no sistema.

### 12.4 Owner e tesouraria têm papéis diferentes

O owner autoriza atos administrativos. A tesouraria guarda estoque e recebe pagamento das compras. Ambos começam relacionados ao administrador inicial, mas a tesouraria permanece fixada no contrato enquanto a propriedade administrativa pode ser transferida.

Se uma nova pessoa assume a administração, isso não transfere automaticamente 150 tokens nem muda o endereço que recebe vendas. Separar as funções evita que uma troca de responsável altere implicitamente o patrimônio e o cálculo da reserva.

`Ownable2Step` exige proposta e aceitação do novo owner. Isso protege contra transferência administrativa para um destino que não aceita ou não controla o endereço indicado. Não é multisig: continua existindo um único owner capaz de executar atos autorizados.

### 12.5 Regras fixas, configurações únicas e poderes contínuos

O supply, o limite econômico e o número de períodos estão fixados pelo desenho. O preço primário pode ser definido uma única vez. A stablecoin pode ser configurada uma única vez se a instância começou sem ela. A abertura também é registrada uma vez.

O owner pode reduzir a reserva, mas não aumentá-la pela mesma função. Pode pausar, retomar, registrar carteiras, reportar receitas e conduzir recuperação dentro das travas. A renúncia à administração é desabilitada para não deixar funções necessárias sem responsável.

Isso mostra uma governança com limites técnicos, mas ainda concentrada. Os papéis separados do portal não impedem, por si, que a chave owner exerça diretamente todos os poderes do contrato.

### 12.6 Como o limite de 20 funciona por pessoa

O cadastro externo cria uma referência de pessoa. O contrato associa endereços por `personOf` e acompanha seu agregado em `personBalance`, além de manter o saldo de cada carteira.

Se uma pessoa tem 12 IBT em um endereço e oito em outro, chegou a 20. Comprar mais uma unidade deve falhar mesmo que nenhuma das carteiras isoladamente esteja acima de 20. A trava por carteira continua existindo junto da pessoal.

O identificador on-chain deriva de um UUID, não de CPF colocado diretamente na rede. Ainda existe dependência externa: se a administração registrar a mesma pessoa civil com duas identidades distintas, o contrato não descobre esse erro sozinho.

### 12.7 Três autorizações diferentes na jornada

**Aprovação cadastral:** a equipe decide que a pessoa pode prosseguir na etapa prevista. **Registro da carteira:** a administração associa o endereço à referência daquela pessoa no contrato. **Allowance da stablecoin:** o comprador autoriza o contrato IBT a movimentar determinada quantidade da moeda de pagamento.

Misturar esses atos dificulta compreender a compra. Aprovar o cadastro não transfere dinheiro. Registrar a carteira não concede IBT. Autorizar gasto não é a compra em si.

### 12.8 Compra atômica: todas as mudanças ou nenhuma

`buyPrimary` verifica condições, marca a referência de compra, entrega as unidades e transfere a stablecoin para a tesouraria dentro de uma transação. A função confere se a quantia efetivamente recebida corresponde ao preço multiplicado pelas unidades.

Se faltar saldo, allowance ou outra condição, a transação reverte. A entrega, o saldo agregado e a marcação da referência também são desfeitos. A ordem interna não significa que o comprador consiga manter os tokens caso o pagamento falhe.

O par comprador/referência de venda só pode liquidar uma vez. Isso evita que um pedido seja pago novamente por repetição da mesma operação. Uma referência nova não deve ser criada para contornar um resultado ainda desconhecido.

### 12.9 Por que um timeout não autoriza comprar de novo

O navegador pode perder a resposta depois de a transação ter sido enviada. Nesse caso, “não recebi confirmação” não significa “a compra falhou”. Repetir com outro pedido pode criar uma segunda compra válida.

O portal preserva a referência e, quando disponível, o hash para conciliar o resultado. Confere rede, remetente, contrato de destino, chamada, quantidade, eventos, recibo e bloco. Um hash qualquer apresentado pelo cliente não é prova suficiente de pagamento daquele pedido.

Apenas uma rejeição explícita antes da transmissão permite retomar certas etapas sem tratar a operação como pendente. Essa distinção protege o usuário da duplicação causada por falhas de comunicação.

### 12.10 Pagamento externo tem outro limite de confiança

`primaryPurchase` só permite entrega administrativa quando não há stablecoin configurada. É uma via para uma liquidação comprovada fora da rede, não uma função que verifica PIX automaticamente.

Com stablecoin configurada, a entrega paga passa por `buyPrimary`. Isso evita que a administração use a via de pagamento externo para ignorar a cobrança on-chain na mesma instância.

Da mesma forma, `settleOffChain` registra a baixa de uma obrigação de royalty de período externo. A função não envia dinheiro bancário. A evidência externa continua necessária.

### 12.11 Calendário baseado na abertura oficial

A instância pode ser publicada com início e fim zerados. Enquanto isso, o cadastro pode avançar, mas compra e apuração permanecem bloqueadas pelas regras pertinentes. Depois, `recordOpening` registra uma abertura já ocorrida e uma referência de evidência.

`OpeningCalendar` calcula os oito encerramentos somando múltiplos de seis meses à data original. Usa meses de calendário e trata anos bissextos e finais de mês, em vez de considerar todo semestre como um número fixo de dias.

**Exemplo conceitual:** partir de um dia 31 pode exigir ajuste ao último dia de fevereiro. Derivar cada aniversário da data original evita que esse ajuste encurte permanentemente os aniversários seguintes. O fim de cada período é exclusivo no intervalo; a vigência termina no último segundo anterior ao aniversário de 48 meses.

### 12.12 Reportes atrasados não devem criar tempo extra

O contrato apura o próximo período e exige que ele tenha encerrado. Se vários semestres já venceram, é possível processá-los em sequência. A regra impede antecipação; não impõe um atraso artificial entre reportes que já estão maduros.

O peso temporal de um semestre para no encerramento daquele semestre. Reportar depois não concede ao titular mais dias de participação nesse período. A data do ato administrativo e o intervalo econômico apurado são diferentes.

### 12.13 Token-segundos: a lógica do royalty temporal

Para cada carteira, o sistema soma quantidade de IBT multiplicada pelos segundos em que essa quantidade foi mantida dentro do período. Chamando esse peso de W, a duração do semestre de D e o royalty total de R:

**Parcela da carteira = piso[R × W ÷ (150 × D)].**

Quem mantém dois IBT por todo o período tem W = 2 × D. Quem mantém dois apenas pela metade tem W = 2 × D/2. A quantidade final é igual, mas o peso da segunda carteira é metade.

Com receita de 150.000 tBRL, R = 22.500. A primeira carteira recebe 300; a segunda, 150. O cálculo reconhece o tempo em que cada titular esteve exposto ao direito econômico.

### 12.14 Como o histórico é preservado quando o saldo muda

Antes de alterar saldos, `_update` chama a acumulação temporal de origem e destino. Assim, o tempo anterior é registrado usando o saldo anterior; o tempo posterior passa a usar o novo saldo.

O sistema não precisa executar uma transação a cada segundo. Ele registra marcos de mudança e calcula a área acumulada: quantidade × intervalo. É semelhante a somar retângulos sob uma linha de saldo ao longo do tempo.

A tesouraria participa enquanto mantém o estoque. Mesmo que venda sua última unidade antes do reporte, o tempo anterior não deve desaparecer. A recuperação também precisa migrar pesos ainda não apurados, além dos valores já devidos.

### 12.15 A reserva não é excluída do denominador

Os 150 tokens representam o fluxo inteiro. Excluir unidades da tesouraria aumentaria artificialmente o direito de compradores, porque eles passariam a dividir entre si uma parcela que não adquiriram.

No exemplo com dois compradores de dois tokens, a tesouraria termina com 146 IBT. Mas seu direito no semestre também inclui os intervalos em que mantinha 148 ou 150. Por isso, o saldo final isolado não basta para calcular sua parcela.

### 12.16 Apuração, provisão e saque

`reportRevenue` recebe faturamento e hash, calcula 15% e registra o devido a cada beneficiário. Quando o período é on-chain, transfere para o contrato a soma das obrigações na mesma transação. Se o financiamento falha, o reporte reverte.

`claimRoyalty` é a retirada pelo titular. Esse padrão separa o cálculo coletivo da transferência individual e evita depender de um envio espontâneo bem-sucedido a todas as carteiras.

“Automatizado” significa que a regra é executada quando chamada e satisfeitas as condições. O contrato não acorda sozinho ao fim do semestre nem consulta automaticamente a contabilidade do hotel.

### 12.17 Arredondamento e inteiros

Solidity trabalha aqui com inteiros e unidades mínimas da moeda. O percentual é expresso em basis points: 1.500 ÷ 10.000 = 15%. `Math.mulDiv` ajuda a calcular produtos e divisões com precisão inteira adequada.

As parcelas são arredondadas para baixo. Isso impede distribuir acima do total por arredondamento individual, mas pode criar uma diferença residual. Como o contrato cobra a soma das parcelas, o residual permanece com o financiador do reporte.

Na camada TypeScript, valores financeiros da rede usam `bigint`. Converter quantidades grandes para ponto flutuante sem cuidado pode perder precisão. Formatar “R$ 34.874,14” é uma tarefa de apresentação, distinta da representação inteira usada na chamada.

### 12.18 Saque duplicado e reentrância

Antes de enviar a moeda, `claimRoyalty` zera a obrigação pendente e registra o valor pago. Assim, uma nova tentativa encontra ausência de valor a sacar. Se a transferência externa falha, a transação reverte e preserva a obrigação anterior.

`nonReentrant` acrescenta uma trava contra reentrada durante a execução. `SafeERC20` trata particularidades dos retornos de tokens ERC-20. São proteções complementares, não declarações de que qualquer stablecoin será segura.

O contrato também verifica diferenças de saldo em recebimentos, rejeitando valores inferiores ao esperado. Uma moeda que cobra taxa ao transferir, por exemplo, pode ser incompatível com a quantia exata exigida. tBRL é uma moeda fictícia de ensaio.

### 12.19 Recuperação é substituição de acesso da mesma pessoa

A administração anuncia origem, destino e referência do caso. A origem fica protegida por restrições, o destino é reservado e há espera de sete dias. O destino deve satisfazer condições de segurança: vazio, compatível com a mesma pessoa e sem ser tesouraria, owner ou owner pendente. A função rejeita destino que já possui código de contrato.

Após o prazo, o owner pode executar. O saldo, os valores pendentes e os pesos temporais pertinentes migram; a origem é revogada. O histórico de pagamentos já realizados permanece identificável, sem criar direito a recebê-los novamente.

O titular da carteira antiga ou o owner pode cancelar o pedido, inclusive durante a pausa. Essa contestação por assinatura pressupõe que a pessoa ainda controle a chave antiga; quem a perdeu precisa do processo institucional externo. Não há uma segunda aprovação independente obrigatória no contrato atual.

### 12.20 Troca de administrador invalida autorizações antigas

A recuperação guarda a época de administração por meio de `ownershipEpoch`. Se o owner muda, o anúncio anterior não pode ser executado como se nada tivesse ocorrido. É necessário cancelar e anunciar novamente nas condições atuais.

Esse controle evita que uma autorização sobreviva silenciosamente a uma mudança de responsável. Mesmo que o administrador antigo retorne depois, a época já mudou. A comparação apenas pelo endereço não seria suficiente para essa proteção.

### 12.21 Pausa: contenção com custo operacional

A pausa bloqueia operações protegidas, incluindo compra, reporte, saque e execução de recuperação. Pode ser útil diante de suspeita de exploração, divergência de apuração ou falha relevante na integração que justifique conter novas operações.

Ela não congela absolutamente todas as funções: consultas continuam disponíveis, cancelar recuperação é permitido, e certas configurações administrativas não usam `whenNotPaused`. Não há pausas seletivas por atividade na entrega atual.

Pausar também impede recebimentos legítimos, portanto o poder tem um custo para os titulares. E não desfaz transações já confirmadas. Se um reporte incorreto já foi registrado, a pausa não fornece por si uma função de retificação daquele período.

### 12.22 Login, sessão e assinatura de carteira

O portal usa e-mail e senha. Senhas são tratadas com scrypt e sal individual; sessões utilizam tokens aleatórios com hash no banco e cookies com proteções. A conta permite consultar direitos e solicitar hospedagens sem exigir extensão de carteira.

Quando é necessário provar controle de endereço, o desafio inclui contexto, rede, nonce e expiração. A validade de cinco minutos e o uso único reduzem o risco de reutilizar uma assinatura antiga em uma nova ação.

Login não movimenta tokens. Assinatura de mensagem não é, por si, transação com gas. KYC não é nenhuma dessas duas coisas. Cada mecanismo resolve uma parte distinta da relação entre pessoa, conta e carteira.

### 12.23 CPF: deduplicar, proteger e vincular

O serviço normaliza o CPF e usa HMAC para deduplicação. Diferente de um hash simples, o HMAC depende de um segredo. O portal também mantém o dado recuperável cifrado com AES-256-GCM para funções autorizadas.

A referência pública é derivada de UUID separado. Isso evita usar o próprio CPF ou seu hash direto como identidade on-chain. Ainda assim, segredos, banco, permissões e backups precisam de proteção; criptografia não transforma um cadastro pessoal em dado irrelevante à privacidade.

### 12.24 Papéis no portal e autorização efetiva

Cadastro, financeiro, atendimento e supervisão recebem áreas correspondentes às suas tarefas. O financeiro trabalha compras; atendimento trata hospedagens; cadastro e supervisão podem acessar dados civis conforme as permissões. O participante acessa sua própria conta.

Esconder um botão melhora a interface, mas a proteção precisa existir no backend. Uma chamada direta à API deve ser recusada quando o papel não é autorizado. Contas individuais também permitem atribuir ações a responsáveis, em vez de usar uma única senha compartilhada.

Essas permissões não substituem as da blockchain. Um operador autorizado no portal não recebe automaticamente a chave owner. Por outro lado, quem controla a chave owner pode atuar diretamente no contrato, dentro de seus poderes.

### 12.25 Por que SQLite usa transação e idempotência

Imagine duas requisições chegando quase juntas para a última cota disponível. Se ambas consultarem antes do débito, poderiam criar duas reservas. A transação `BEGIN IMMEDIATE` reúne a verificação e a alteração sob o controle de concorrência do banco.

A chave de idempotência trata outro problema: o mesmo pedido repetido por clique ou tentativa de rede. Com os mesmos dados, devolve o resultado existente; com dados conflitantes, deve rejeitar. Assim, repetir a requisição não significa consumir outra cota.

WAL, chaves estrangeiras e consultas parametrizadas têm funções complementares de persistência, integridade e segurança. O conjunto é adequado ao protótipo local, mas não demonstra por si uma arquitetura distribuída pronta para vários servidores.

### 12.26 O ciclo da hospedagem

Solicitar compromete a cota. Confirmar registra a decisão do atendimento. Concluir registra a utilização. Essas transições não descontam a mesma cota três vezes e não alteram o saldo de IBT.

O portal valida três noites. A regra comercial de até cinco pessoas e a disponibilidade real do hotel não estão integralmente implementadas como controle de inventário. O pedido acadêmico não é uma reserva integrada a um sistema hoteleiro de produção.

O cancelamento permanece manual e provisório: atendimento ou supervisão decide com motivo. Se houver devolução, ela aguarda conciliação e ocorre uma vez. Não existem meias cotas automáticas. Remarcar preserva o pedido e altera suas datas conforme as condições aplicáveis.

### 12.27 Indexação: transformar eventos em estado do portal

O indexador lê eventos do contrato em ordem e atualiza o livro externo. Para não contar duas vezes um evento, identifica rede, transação e posição do log. Para não usar uma cadeia incompatível, confere rede, contrato, parâmetros e bloco.

Na Sepolia, a referência é o bloco finalizado; na rede local, o ensaio usa o estado mais recente. Se houver reorganização ou histórico inconsistente, o serviço bloqueia operações inseguras e exige conciliação. Não apaga silenciosamente hospedagens para tentar reconstruir tudo.

Eventos permitem refazer parte do histórico on-chain. Não permitem reconstruir automaticamente informações que nunca foram publicadas, como aprovação civil, datas de hospedagem e uso registrado apenas no banco.

### 12.28 Perder o banco e perder a carteira são incidentes distintos

Recuperar uma carteira resolve acesso à posição on-chain dentro das regras do contrato. Restaurar o banco resolve continuidade de cadastro, cotas e pedidos. Uma coisa não substitui a outra.

Se o SQLite for perdido sem backup, saldo e pagamentos públicos podem continuar disponíveis, mas o histórico pessoal de consumo não pode ser deduzido apenas do saldo. Por isso, backups e restauração fazem parte da operação necessária, mesmo com blockchain.

Também não se deve apontar um banco de uma emissão para outra rede ou contrato sem migração. Os mesmos endereços ou nomes não tornam os históricos equivalentes.

### 12.29 Custódia local e operação institucional

Na modalidade IBITI, o desenho usa uma carteira dedicada à pessoa. O financeiro prepara a compra e o participante autoriza o pedido em sua conta. Na autocustódia, a assinatura permanece com o participante, com mais ou menos assistência.

O servidor normal não vira um cofre de chaves privadas por causa dessa jornada. O adaptador exclusivo de Anvil permite demonstrar a operação sem extensão com contas de teste. Produção exigiria guarda, autorização de uso, financiamento, backup e recuperação institucionais efetivos.

Usar uma conta coletiva para todos os titulares mudaria o modelo de atribuição e não corresponde ao desenho descrito. A carteira dedicada ajuda a manter vínculo, saldo e direitos por pessoa.

### 12.30 Funções, ABI, bytecode e eventos

`view` consulta sem alterar estado; `pure` não depende do estado; `external` faz parte da interface de chamadas externas; `internal` e `private` delimitam uso no código. `private` não significa segredo criptográfico em uma rede pública.

A ABI descreve como codificar chamadas e interpretar retornos e eventos. O bytecode é o programa executado pela EVM. Os eventos são logs que ajudam exploradores e indexadores a reconhecer o que aconteceu.

Uma consulta via RPC normalmente não exige que o usuário pague uma transação. Se a mesma execução fizer parte de uma transação, consome recursos e gas. Essa diferença explica por que consultar saldo e comprar são operações distintas para a carteira.

### 12.31 O custo dos laços e a escala pretendida

A apuração percorre beneficiários. Como existem 150 unidades indivisíveis, o número de carteiras com saldo é limitado. O calendário tem oito períodos. Esses limites tornam o custo analisável dentro da escala do projeto.

Mesmo assim, laço limitado não significa laço gratuito. A regressão examina casos com muitos titulares e reportes atrasados. Um resultado adequado para 150 unidades não pode ser extrapolado automaticamente para milhares de participantes ou outra rede.

### 12.32 O que os testes precisam demonstrar

Os testes mais informativos exercitam consequências: pagamento falho não entrega IBT; mesma compra não liquida duas vezes; duas carteiras da mesma pessoa respeitam 20; compra em metade do semestre recebe metade do peso; saque repetido falha; recuperação conserva posição e histórico; pedido repetido não consome outra cota; usuário não acessa funções de outro papel.

Também existem verificações de calendário, reserva, troca de owner, reorganização e compatibilidade de rede. Elas testam fronteiras em que uma aparente pequena diferença pode criar um direito incorreto.

Esta revisão documental examinou fonte e registros existentes. Não realizou nova auditoria de segurança nem nova execução integral das suítes. Testes aprovados sustentam os casos exercitados, não uma afirmação de ausência de qualquer falha.

### 12.33 Onde localizar os mecanismos

| Arquivo na implementação da Sprint 4 | Mecanismos centrais |
|---|---|
| `smart-contract/contracts/IBIToken.sol` | Emissão, pessoa, compra, royalty, pausa, recuperação e permissões. |
| `smart-contract/contracts/OpeningCalendar.sol` | Cálculo dos aniversários e períodos de calendário. |
| `offchain/src/ledger.ts` | Livro de cotas, pessoas, pedidos e transações no banco. |
| `offchain/src/auth.ts` | Desafios e prova de controle de carteira. |
| `offchain/src/chain.ts` | Consulta, eventos, sincronização e consistência da rede. |
| `offchain/src/purchase.ts` | Preparação e conferência de transações de compra. |
| `offchain/src/portal.ts` e `portal-api.ts` | Contas, papéis, candidaturas, jornadas e cancelamento. |
| `offchain/public/portal.js`, `portal.html` e `portal.css` | Apresentação e interação da jornada. |
| `smart-contract/scripts/01_publicar.js` | Publicação e configuração inicial pelo Remix. |

Os caminhos identificam pontos de entrada, não dependências que possam ser descartadas do pacote. Configuração, versões de bibliotecas e arquivos de lock também participam da reprodução do ambiente.

## 13. Sprint 4 - Deploy e evidências operacionais on-chain

Fontes: relatório em português de 12 páginas, quatro anexos incorporados e dois vídeos de demonstração.

### 13.1 Compilar, publicar, verificar e testar são ações diferentes

**Compilar** transforma a fonte Solidity em bytecode e gera informações de interface. **Publicar** envia uma transação de criação que produz uma instância em um endereço da rede. **Verificar** relaciona a fonte e as configurações ao programa publicado. **Testar** executa cenários para examinar comportamentos.

Um contrato pode compilar e falhar ao ser publicado por argumentos inválidos. Pode ser publicado e não ter código verificado. Pode ter correspondência exata de fonte e ainda conter um erro de negócio. Cada evidência responde a uma pergunta específica.

### 13.2 Por que usar Remix e MetaMask

O Remix fornece o ambiente de compilação e interação. A MetaMask permite ao operador escolher a conta e autorizar transações na rede configurada. O script organiza as etapas para reduzir diferenças manuais entre execuções.

O deploy registrado foi manual com apoio do script `01_publicar.js`, executado no Remix e com confirmações humanas na MetaMask. Isso não caracteriza uma esteira automática de CI/CD. A existência de um script não elimina a decisão humana de iniciar e aprovar a publicação.

### 13.3 O que o script de publicação fazia

Primeiro, conectava ao provedor e identificava rede e conta selecionadas no Remix. Aceitava as redes locais previstas e Sepolia; para Sepolia, exigia habilitação explícita de `permitirSepolia`. O arquivo entregue mantém esse sinalizador desabilitado por padrão para evitar uma nova publicação sem revisão.

Depois, carregava ABI e bytecode dos artefatos já compilados. O script não substituía a compilação: se não encontrasse o artefato correspondente, interrompia o processo com orientação para compilar.

Em ambiente local, publicava `MockStablecoin` e criava saldo fictício de teste. Na Sepolia, usava o endereço de tBRL já configurado, sem criar novamente essa moeda a cada publicação do IBT.

Em seguida, publicava o IBIToken com administrador, emissão de 150, início e fim zerados e moeda selecionada. Após a confirmação, configurava o preço primário de 34.874,14 tBRL, convertido para seis casas decimais.

Por fim, salvava `deployments/remix-latest.json` com versão interna, rede, endereços, administrador, tesouraria, preço, supply, datas, hash de criação e bloco. O arquivo é um registro de referência; sua existência deve ser conciliada com o recibo da rede.

### 13.4 O deploy não foi uma única transação indivisível

A criação do IBIToken e a definição de preço são transações diferentes. A publicação local da moeda e a criação do saldo de teste também são operações próprias.

Se a criação do contrato for confirmada e uma transação posterior falhar, a instância já publicada continua existindo. Não ocorre o mesmo rollback global da compra atômica, que reúne entrega e pagamento dentro de uma só transação.

Essa distinção explica por que uma execução interrompida deve verificar os recibos antes de repetir tudo. O script grava o registro final depois das etapas previstas; um erro antes dessa gravação não prova que nada foi publicado.

### 13.5 Identificação da instância pública da entrega

| Campo | Registro examinado |
|---|---|
| Rede | Ethereum Sepolia, chain ID 11155111. |
| Contrato IBIToken | `0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520`. |
| Bloco de criação | 11783256. |
| Data do recibo | 26/09/2026, 02:22:36 UTC. |
| Status | 1, execução da criação bem-sucedida. |
| Gas utilizado | 3.906.647. |
| Taxa registrada | Aproximadamente 0,010111730168582655 ETH de teste. |

A fonte é a evidência coletada no artefato, não uma nova verificação de estado atual da rede. O [recibo de criação no Etherscan](https://sepolia.etherscan.io/tx/0x132a696441b2a2feae4e2ea4b233c90e2f4534afaff84c9d7064a8d84ac0ec4f) permite localizar a transação correspondente.

O endereço de setembro 11, que começa por `0xaA6C`, é outra instância. Uma referência histórica não aponta automaticamente para o contrato novo porque ambos são chamados de IBIToken.

### 13.6 O que gas e status mostram

Gas mede recursos computacionais cobrados pela execução. O custo resulta do gas consumido multiplicado pelo preço efetivo por unidade. A taxa não é parte do preço do IBT, não é receita hoteleira e não é a captação para o ecossistema.

Status 1 demonstra sucesso daquela transação segundo a execução da rede. Não comprova que todos os requisitos de negócio estejam corretos. Uma transação que grava um faturamento incorreto pode ser tecnicamente bem-sucedida se cumprir as condições do código.

Sepolia usa recursos de teste. O valor de gas observado ajuda a compreender custo de execução, mas não é orçamento comercial fixo de uma futura implantação em outra rede ou data.

### 13.7 Por que registrar versão do compilador e configurações

A referência registrada é Solidity 0.8.34, EVM Osaka, otimizador com 200 execuções, viaIR e OpenZeppelin 5.6.1. Essas informações afetam a compilação e ajudam a reproduzir o bytecode.

Mesmo com código-fonte semelhante, mudar versão, configuração ou dependência pode gerar outro programa. Os argumentos do construtor também são necessários para reconstruir a criação da instância.

As bibliotecas herdadas não precisam de um deploy separado apenas porque aparecem em arquivos distintos. `MockStablecoin`, por sua vez, é um contrato independente de teste que fornece a moeda usada nos ensaios.

### 13.8 O que a verificação no Sourcify comprova

O relatório registra correspondência exata entre fonte compilada e bytecode de criação e execução. Isso permite que outra pessoa inspecione o código associado à instância, em vez de confiar apenas em uma fonte apresentada separadamente.

A verificação não é auditoria de segurança, certificação econômica ou parecer jurídico. Um código vulnerável também pode ter correspondência exata. O resultado responde “esta fonte corresponde a esta instância?”, não “esta operação está livre de falhas?”.

Referência: [registro do contrato no Sourcify](https://repo.sourcify.dev/11155111/0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520).

### 13.9 A função do Anvil

O Anvil fornece uma rede Ethereum local para executar contratos e transações de teste. No projeto, funciona como um laboratório controlado: contas e moeda são fictícias, o estado pode ser preparado e o tempo da rede pode avançar para exercitar regras longas.

Isso é decisivo para testar semestres e espera de recuperação sem aguardar meses ou dias reais. O contrato executa sua lógica na EVM local; o que é simulado é o ambiente e o contexto econômico.

Uma transação no Anvil não aparece na Sepolia. Endereço, hash e bloco precisam ser interpretados junto da rede. A demonstração local usa chain ID 31337.

### 13.10 O ciclo operacional demonstrado

O ensaio registra abertura fictícia em 15/03/2027. Dois participantes compram dois IBT cada, um no início e outro na metade do semestre. Cada compra paga 69.748,28 tBRL ao preço unitário de referência.

Depois do encerramento, o administrador informa receita fictícia de 150.000 tBRL, produzindo 22.500 de royalty. O primeiro titular recebe 300; o segundo, 150. A tesouraria tem 22.050 devidos pelo estoque mantido ao longo do tempo.

Após os dois saques individuais, os 22.050 restantes no contrato correspondem à obrigação ainda não sacada pela tesouraria nesse ensaio. Não são um erro de soma nem, nesse caso, uma sobra arbitrária de arredondamento.

O exemplo confirma a diferença entre saldo final e tempo acumulado e conecta compra, reporte, financiamento e saque em uma sequência reproduzível.

### 13.11 O que foi simulado, minerado ou coberto por testes

O relatório distingue chamadas que simulam rejeições com `eth_call` das transações locais mineradas. Uma chamada simulada que reverte demonstra uma condição de execução, mas não possui recibo de transação minerada nem consumo pago de gas pelo usuário.

O anúncio e o cancelamento de recuperação foram demonstrados no ciclo registrado. A execução após sete dias tem cobertura de testes; não deve ser atribuída ao vídeo como se todas as etapas tivessem sido demonstradas nele.

A rodada de 31 testes de regressão teve zero falhas no registro examinado. Ela complementa as transações e os vídeos, mas não equivale a toda a suíte histórica nem a uma auditoria externa.

### 13.12 Para que servem os quatro anexos

| Anexo | Evidência que preserva |
|---|---|
| `sepolia-deployment-receipt.json` | Recibo da criação pública, com dados e logs da transação. |
| `anvil-records.json` | Etapas, transações locais, resultados, eventos e saldos do ensaio. |
| `regression-tests.tap` | Resultado individual dos testes daquela rodada. |
| `evidence-manifest.json` | Hashes usados para conferir integridade de evidências e fontes. |

O manifesto ajuda a detectar se um arquivo foi alterado depois da coleta. Não demonstra, sozinho, que o conteúdo é verdadeiro. Sua utilidade aumenta quando acompanha os próprios arquivos, a origem e as instruções de reprodução.

Os vídeos ajudam a compreender a sequência e a interface. Para valores exatos e natureza da execução, os recibos, registros e fonte são evidências mais adequadas que uma frase da narração.

### 13.13 O alcance da entrega

O conjunto demonstra publicação e verificação em testnet, execução operacional local e testes de regressão. Não demonstra receita real, pagamento bancário, hospedagem efetiva, contratação de custodiante ou um ciclo inteiro de royalties executado na Sepolia.

Essa delimitação não diminui a utilidade do protótipo. Ela permite saber qual risco cada evidência reduziu e quais dependências continuam externas ao ensaio.

## 14. Conexões que ajudam a compreender o projeto inteiro

### 14.1 A mesma compra vista pelos diferentes artefatos

O diagnóstico explica por que captar recursos presentes. O memorando define os direitos e o preço de referência. A estrutura jurídica analisa a relação e as obrigações. UX e comunicação organizam a decisão e o consentimento. O contrato executa a compra nas condições programadas. O deploy identifica a instância que a executa.

Se um desses elementos diverge, não basta dizer que a compra “funcionou”. Uma operação tecnicamente correta pode ser comunicada de maneira errada ou representar termos diferentes dos descritos no documento.

### 14.2 Uma hospedagem usada mostra a razão da arquitetura

O titular mantém o IBT, porque o direito econômico continua. O banco registra a cota utilizada, porque o serviço não pode ser consumido indefinidamente. A interface apresenta saldo e cotas como informações distintas. O atendimento confirma a realização física.

Essa sequência conecta fungibilidade, privacidade e experiência. Evita exigir uma transação pública para cada detalhe da hospedagem, mas cria a necessidade de preservar o banco e sua trilha de operações.

### 14.3 Uma receita informada incorretamente mostra o limite da automação

O contrato pode calcular perfeitamente 15% de um número incorreto. A existência de um hash não resolve a origem do dado. A resposta depende de controles de apuração, obrigação do operador, revisão e procedimento de correção.

Se houver suspeita, a pausa pode conter operações protegidas. Entretanto, ela não reverte pagamentos nem reescreve um período já reportado. A governança precisa ser pensada em conjunto com as capacidades reais do código.

### 14.4 Um retorno abaixo da projeção não significa necessariamente falha de software

Menor ocupação pode reduzir o royalty mesmo com todas as funções executadas corretamente. Monte Carlo explora parte dessa incerteza operacional. A comunicação precisa preparar o participante para distinguir desempenho econômico, falha de apuração e falha técnica.

Essa distinção também explica a aplicação de Howey: a expectativa de remuneração depende da atividade de terceiros, mesmo que o mecanismo de pagamento seja automatizado e verificável.

### 14.5 As diferenças de versão mais relevantes

| Tema | Evolução que deve acompanhar a explicação |
|---|---|
| Destinação | Hipótese inicial de obra passou a captação para o ecossistema. |
| Preço | Referências anteriores foram sucedidas por R$ 34.874,14 no memorando v2. |
| Hospedagem | Proposta de marcação no token passou a livro de cotas por pessoa. |
| Royalties | Fotografia de saldos passou a quantidade multiplicada pelo tempo. |
| Calendário | Contador e anos de projeção deram lugar a semestres desde a abertura registrada. |
| Concentração | Limite por carteira ganhou agregado por pessoa no contrato. |
| Circulação | Transferências restritas históricas passaram a bloqueio das transferências ordinárias. |
| Compra | Entrega administrativa histórica ganhou pagamento atômico na modalidade stablecoin. |
| Recuperação | Poder administrativo ganhou anúncio, espera, validação e cancelamento. |
| Administração | Papéis do portal evoluíram; o contrato ainda mantém owner único. |

As pendências de governança e custódia mencionadas nos registros do projeto continuam como desenho a aprimorar. Elas ajudam a compreender os limites da entrega; não foram implementadas por este trabalho documental.

## 15. Fontes, cobertura e uso deste material

### 15.1 Os 12 artefatos incluídos

As referências abaixo apontam para a revisão fixa usada na análise. Os capítulos anteriores explicam cada artefato e relacionam as versões sem tratar hipóteses antigas como regras atuais.

- [Sprint 1 - Business Diagnosis and Discovery](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%201/Business%20Diagnosis%20and%20Discovery).
- [Sprint 1 - Entendimento da Experiência do Usuário](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%201/Entendimento%20da%20Experi%C3%AAncia%20do%20Usu%C3%A1rio).
- [Sprint 2 - Riscos éticos e impacto](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%202/Riscos%20%C3%A9ticos%20e%20impacto).
- [Sprint 2 - Whitepaper Técnico do Ativo Digital](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%202/Whitepaper%20T%C3%A9cnico%20do%20Ativo%20Digital).
- [Sprint 3 - Estrutura Jurídica](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Estrutura%20Jur%C3%ADdica).
- [Sprint 3 - Guia de Comunicação](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Guia%20de%20Comunica%C3%A7%C3%A3o).
- [Sprint 3 - Whitepaper Técnico do Ativo Digital](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Whitepaper%20T%C3%A9cnico%20do%20Ativo%20Digital).
- [Sprint 3 - Memorando de oferta, versão 1](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Memorando%20de%20oferta%20-%20vers%C3%A3o%201).
- [Sprint 3 - Implementação do Contrato ERC-20, versão 1](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Implementa%C3%A7%C3%A3o%20do%20Contrato%20Inteligente%20ERC-20%20-%20vers%C3%A3o%201).
- [Sprint 4 - Memorando de Oferta, versão 2](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%204/Memorando%20de%20Oferta%20-%20vers%C3%A3o%202).
- [Sprint 4 - Implementação do Contrato ERC-20, versão 2](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%204/Implementa%C3%A7%C3%A3o%20do%20Contrato%20Inteligente%20ERC-20%20-%20vers%C3%A3o%202).
- [Sprint 4 - Deploy e Evidências Operacionais On-Chain](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%204/Deploy%20e%20Evid%C3%AAncias%20Operacionais%20On-Chain).

### 15.2 Alcance da leitura

O conjunto documental selecionado inclui oito PDFs, totalizando 160 páginas, documentos Markdown, nove imagens de UX, cinco abas da planilha, fontes e documentação de duas implementações e dois vídeos. Os vídeos foram examinados por quadros representativos na preparação anterior; o narrado também teve transcrição automática. A fonte e os registros sustentam as afirmações técnicas, sem depender isoladamente da narração.

O inventário `cobertura-arquivos.csv`, nesta pasta, identifica os arquivos dos 12 artefatos e seu tratamento. Bibliotecas de terceiros, lockfiles e recursos de interface foram classificados pelo papel na entrega; isso não equivale a uma auditoria linha a linha de todas as dependências. A conferência financeira preservada em `verificacao-financeira.json` corresponde à reprodução feita em 01/10/2026.

As fontes jurídicas e de acessibilidade citadas junto às explicações foram consultadas para corrigir simplificações conceituais. O estudo não ratifica as minutas, recalcula uma oferta comercial ou substitui uma revisão jurídica da operação concreta.

### 15.3 Como ler sem decorar números isolados

Em cada tema, procure identificar o problema, o mecanismo escolhido, a consequência e a dependência que permanece. No preço, siga premissa → receita → royalty → desconto. Na tecnologia, siga pessoa → autorização → transação → confirmação → conciliação. Na evidência, identifique rede → contrato → operação → recibo.

Esse encadeamento permite explicar o projeto com suas próprias palavras e perceber quando dois documentos estão descrevendo versões ou camadas diferentes. Os exemplos numéricos e comparações deste material foram incluídos para tornar os mecanismos compreensíveis, sem alterar as condições econômicas adotadas.
