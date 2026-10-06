# IBIToken: guia de arguição oral

Preparação para negócios, gestão de projetos e programação | 01/10/2026

Base: repositório GitLab G01, revisão `00fde23c8ab118ba5e644fd348a35ee93ba8cb8a`. As respostas distinguem proposta de negócio, implementação entregue e evidência de execução. Não foram alterados os artefatos originais.

## 1. Como estudar e o que eu priorizaria

Apliquei a skill **sprint-analyzer**, encontrada no Claude, adaptando sua classificação de conteúdo crítico, recomendado e redundante à arguição. “Maior chance” abaixo é uma avaliação qualitativa baseada na centralidade dos temas, nos feedbacks registrados e nas divergências entre entregas; não é informação sobre as perguntas dos professores.

**Crítico:** conseguir responder sem consultar. **Recomendado:** explicar com o documento aberto e dar um exemplo. **Redundante:** releitura integral de introduções repetidas, conclusões e versões substituídas; estudar somente o que mudou.

| Prioridade | Pergunta que eu treinaria primeiro | Por que tem alta relevância |
|---|---|---|
| Crítica | O que o IBT dá e o que ele não dá? | Conecta negócio, jurídico e código. |
| Crítica | Por que 150 tokens, 100 ofertados e 50 reservados? | Testa tokenomics e denominador do royalty. |
| Crítica | Como chegamos a R$ 34.874,14? | Obriga a explicar receita, desconto e valuation. |
| Crítica | Por que a TIR-base é 20,46%? | Evita vender uma identidade matemática como descoberta. |
| Crítica | O que Monte Carlo acrescenta e o que não mede? | Principal evolução do memorando v2. |
| Crítica | Como se calcula e se trata um risco da matriz? | Pedido explícito e núcleo da gestão. |
| Crítica | Como justificamos os 90% do risco A17? | É uma afirmação quantitativa fácil de aprofundar. |
| Crítica | O que mudou da implementação anterior para a atual? | Há documentos históricos com regras diferentes. |
| Crítica | Como os royalties consideram o tempo de posse? | Principal regra de programação e justiça econômica. |
| Crítica | O que está na Sepolia e o que foi demonstrado no Anvil? | Define exatamente o alcance da evidência. |
| Crítica | Por que usar hospedagem não queima IBT? | Exige entender fungibilidade e cotas por pessoa. |
| Crítica | Como se impede uma pessoa de comprar 20 em várias carteiras? | Cadastro e contrato precisam funcionar juntos. |
| Crítica | Como funciona a compra atômica e o saque? | Dinheiro, autorização e prevenção de duplicação. |
| Crítica | Quem pode recuperar uma carteira e com quais limites? | Poder administrativo e segurança. |
| Crítica | Se o banco ou o operador falhar, a blockchain resolve? | Expõe os limites reais do protótipo. |

**Roteiro sugerido de quatro horas:** 20 min de referência atual; 65 min de memorando e contas; 45 min de gestão e riscos; 60 min de programação e deploy; 25 min de jurídico, ética, UX e comunicação; 25 min respondendo ao simulado sem ler. Se houver apenas uma hora, use a revisão rápida e os exemplos de royalty, valuation e A17.

Responda em quatro movimentos: **afirmação direta → mecanismo → exemplo/evidência → limite**. Exemplo: “O limite é 20 por pessoa. O backend vincula carteiras a uma identidade opaca e o contrato soma os saldos dessa identidade. Comprar 12 numa carteira e 9 em outra deve falhar. A qualidade da identificação civil ainda depende da verificação externa.”

## 2. Revisão rápida: a referência que deve orientar as respostas

| Assunto | Resposta atual |
|---|---|
| Natureza | Experiência de hospedagem, pertencimento e participação em royalties. Sem imóvel, participação societária ou voto de gestão. |
| Emissão | 150 IBT inteiros; `decimals() = 0`; 50 de reserva inicial; 100 inicialmente disponíveis. |
| Concentração | Teto de 20 por pessoa, também com trava por carteira; depende de vincular corretamente a identidade. |
| Circulação | Sem mercado secundário. Transferências ordinárias estão bloqueadas, inclusive entre carteiras da mesma pessoa. |
| Receita | Royalty de 15% da receita bruta elegível; não é lucro nem rentabilidade anual de 15%. |
| Rateio | Quantidade multiplicada pelo tempo de posse dentro de cada semestre; denominador inclui os 150 IBT. |
| Calendário | Oito semestres civis desde a abertura oficial registrada; data real ainda não confirmada. |
| Compra | Implementação atual bloqueia compra antes da abertura: ponto a conciliar com a tese de antecipar recursos antes da operação. |
| Preço de referência | R$ 34.874,14 por IBT, memorando v2. A planilha usa precisão maior; a demo usa tBRL fictício. |
| Hospedagem | Uma cota por IBT para toda a emissão, não por ano. Três noites; até cinco pessoas é regra de negócio, sem controle completo de hóspedes no código. |
| Uso da cota | Controlado por pessoa em SQLite. Não queima IBT nem encerra automaticamente royalties. |
| Administração | Proprietário único, transferência de administração em duas etapas; não é multisig. |
| Recuperação | Mesma pessoa, solicitação, espera de sete dias e execução administrativa; preserva posições e direitos pertinentes. |
| Custódia | IBITI, autocustódia assistida e direta são modalidades distintas. Sem extensão só funciona no adaptador local Anvil. |
| Maturidade | Protótipo acadêmico, deploy em testnet, testes e demonstrações locais; sem operação comercial integrada. |

**Não confundir três nomes:** “Implementação - versão 1” é o artefato da Sprint 3; nele há um contrato historicamente chamado v2. A entrega da Sprint 4 é o artefato “Implementação - versão 2”, contendo a revisão interna de código 4.0.0. O endereço identifica a instância com mais precisão que o rótulo “v2”.

## 3. Business Diagnosis and Discovery — Sprint 1

Fonte: Business Diagnosis, 19 páginas. Prioridade recomendada; perguntas B1–B3 são críticas.

### B1. Qual problema de negócio o projeto pretende resolver?

**Resposta curta:** antecipar para o ecossistema IBITI parte do valor de royalties que só seriam recebidos com a operação do Glamping, conectando participantes à experiência e ao território.

**Explique:** existe um descasamento entre necessidade de recursos presentes e recebimentos futuros. A proposta organiza direitos econômicos e de experiência numa unidade digital. O memorando posterior esclarece que a construção do Glamping é investimento de um terceiro; não devemos repetir a hipótese inicial de financiar a obra com os tokens.

**Aprofundamento provável:** “E por que não tomar empréstimo?” Empréstimo cria serviço de dívida; equity cria participação societária; uma pré-venda simples vende principalmente uso. O IBT combina experiência, pertencimento e um fluxo variável de royalty. Isso não demonstra que seja a alternativa mais barata: a comparação exige custos, riscos, demanda e obrigações equivalentes.

### B2. A blockchain cria valor sozinha?

Não. Ela pode tornar saldos, regras e pagamentos verificáveis, mas o valor depende de hóspedes, receita, cumprimento contratual e qualidade da experiência. Uma base de dados também registra direitos; a escolha da blockchain precisa justificar verificabilidade pública e execução programável frente a custo, privacidade e complexidade. O sistema continua dependente de operador, administrador e backend.

### B3. Quem paga, quem recebe e quem opera?

O participante paga pela aquisição; a IBITI recebe a captação para o ecossistema; o empreendedor opera o Glamping e gera faturamento; a estrutura de royalties destina 15% da receita elegível aos direitos representados pelos 150 tokens. Não confundir o operador hoteleiro, a IBITI e o administrador técnico do contrato.

### B4. Como o diagnóstico organizacional se conecta à solução?

Financeiro apura e concilia receitas; atendimento cuida de reservas e exceções; gestão coordena dependências; jurídico define obrigações; tecnologia registra regras; comunicação explica condições; áreas socioambientais validam impacto. Um contrato funcionando não substitui essas responsabilidades. A nova rotina acrescenta controles de identidade, recebíveis, custódia, prestação de contas e continuidade.

### B5. O que precisa ser tratado como hipótese?

Adesão do público, ocupação, posicionamento de preço, expansão de capacidade e impactos gerados. Descrições e dados históricos apresentados no diagnóstico não validam automaticamente uma operação futura. A amostra ou janela histórica citada não deve ser generalizada sem examinar representatividade. Ideias iniciais de preço, perpetuidade ou financiamento da construção ficaram superadas pelas definições posteriores.

## 4. Entendimento da Experiência do Usuário — Sprint 1

Fonte: documento Markdown e nove imagens: matriz de stakeholders, CSD, curva de emoção, três personas e três mapas de empatia.

### U1. Para que serve a matriz de stakeholders?

Cruza poder/influência e interesse para orientar o relacionamento. IBITI, hóspedes AAA e investidores relevantes exigem acompanhamento próximo; reguladores e órgãos ambientais precisam ser considerados nas decisões; comunidade, produtores e trabalhadores precisam receber informação e participar das discussões que os afetam. Baixo poder formal não significa baixo valor nem baixo impacto social.

**Se provocarem:** interesse e impacto não são a mesma variável. A imagem aproxima esses conceitos; uma revisão metodológica deveria distinguir quem quer participar de quem sofre consequências.

### U2. O que CSD significa e qual sua limitação aqui?

Certezas, suposições e dúvidas. Serve para orientar validações, não para transformar opiniões em fatos. A imagem inicial chama financiamento da construção de “certeza” e atribui ao smart contract garantia de destinação regenerativa. Ambos exigem correção à luz do modelo posterior: captação para o ecossistema e controle externo da aplicação efetiva dos recursos.

### U3. Como as três personas mudam a interface?

| Persona | Necessidade dominante | Resposta de produto | Cuidado na defesa |
|---|---|---|---|
| Helena, hóspede tradicional | Confiança, discrição e pouca fricção tecnológica | Atendimento claro, conta sem carteira, jornada de custódia explicada | Não prometer custódia comercial pronta nem acesso irrestrito à agenda. |
| Beatriz, investidora de impacto | Evidências, governança e dados de impacto | Fontes dos números, documentos, extratos e limitações | Transparência do token não comprova hectares regenerados. |
| Gabriel, cripto-nativo | Código e autonomia verificáveis | Acesso ao endereço, fonte, rede e autocustódia direta | A persona antiga desejava fracionamento e mercado secundário; o produto atual não oferece isso. |

São instrumentos de design, não prova de pesquisa com usuários reais. Há até diferença de idade de Gabriel entre imagem da persona e mapa de empatia; o essencial é o comportamento, não decorar biografia fictícia.

### U4. Onde está a principal queda de emoção da jornada?

Na fricção tecnológica: entender carteiras, segurança e contratos. A jornada passa por descoberta, avaliação, fricção, aquisição, pertencimento e experiência física. A resposta atual é mostrar detalhes progressivamente e separar cadastro, aprovação e compra. Login e reserva não devem exigir conexão de carteira.

### U5. Como validar se a experiência melhorou?

Com tarefas reais: cadastrar interesse, entender direitos, explicar custódia e solicitar hospedagem. Medir conclusão, tempo, abandono, erros e compreensão; observar onde pedem ajuda. Esses são critérios propostos de avaliação, não resultados já medidos pelo grupo. A assinatura comprova controle da carteira, não compreensão do produto nem identidade civil.

## 5. Gestão de Projeto — Sprints 1, 2, 3 e 4

Fontes: plano inicial; Gestão de projeto da Sprint 2; Gestão de Projeto e Matriz de Riscos da Sprint 3; relatório de 19 páginas da Sprint 4; slides 2 e 3. Prioridade crítica.

### G1. Qual é a lógica de gestão e como ela evoluiu?

A equipe organiza o trabalho em sprints, explicita responsáveis, acompanha o Kanban e revê riscos. A Sprint 1 organiza o time; a 2 detalha rituais e acordos; a 3 conecta negócio, jurídico, comunicação e implementação; a 4 acrescenta controle de evidências, revisão entre artefatos e checklist de requisitos.

Não basta dizer “usamos Scrum”. Explique como uma decisão vira tarefa, ganha responsável, é revisada e recebe uma evidência de conclusão. Rotação de Scrum Master registrada: Lavínia, Leon, Thomas e Zanette, das Sprints 1 a 4.

### G2. Quais acordos concretos o grupo estabeleceu?

Daily em dias úteis às 9h, até 15 minutos: concluído, próximo passo e bloqueios. Atualização do Kanban até 18h e revisão de sábado às 12h. Impasse tem prazo de até 48h; o acordo registra maioria e desempate pelo Scrum Master. Retrospectiva de até 30 minutos com Continuar, Parar e Começar.

Metas documentadas: presença de pelo menos 90% nas dailies; atualização do quadro no prazo; no máximo uma reincidência de atraso; tratamento de impasses em 48h; satisfação de pelo menos 4/5. Meta escrita é diferente de indicador efetivamente coletado.

### G3. O que fazer quando alguém atrasa?

Identificar o fato e seu efeito, conversar de forma privada e objetiva, entender o bloqueio, replanejar e acompanhar. O acordo prevê escalonamento quando há pelo menos duas reincidências na sprint ou bloqueio de outras atividades. Redistribuição e trabalho em dupla devem tratar capacidade e dependência; não servem para ocultar atraso no quadro.

### G4. O que significa “pronto”?

Conteúdo exigido presente, revisão por outra pessoa, coerência com os demais artefatos, identificação da versão e arquivo no repositório. Para software, acrescentar validação do comportamento, ambiente e evidência dos testes. Um PDF exportado ou um contrato compilado sozinho não fecha o DoD.

**Exemplo:** dizer “royalty proporcional ao tempo” exige regra documentada, função no contrato, teste com duas datas de compra e exemplo numérico coerente no relatório.

### G5. Como demonstrar rastreabilidade?

Conectar requisito → responsável → tarefa/decisão → implementação/documento → teste/evidência. A matriz não deve ser apenas uma lista de nomes. Se mudarmos snapshot para tempo de posse, precisam mudar contrato, testes, memorando, whitepaper, guia e explicação oral. Os arquivos ainda divergentes são evidência de risco residual de integração.

### G6. O que mudou na divisão de trabalho da Sprint 4?

Zanette coordena como Scrum Master; Lavínia aparece na implementação com revisão técnica de Zanette; Adriana organiza gestão e análise de evidências; Leon trabalha a narrativa econômica, Thomas a modelagem financeira e Erik os aspectos jurídicos/comunicacionais. O relatório é a referência da atribuição planejada; isso não prova sozinho quem executou cada linha ou revisão.

### G7. Como diferenciar gestão de projeto de governança do produto?

Gestão de projeto organiza a entrega do time. Governança do produto define quem pode alterar parâmetros, reportar receita, guardar chaves, aprovar cadastros e resolver incidentes. O Scrum Master não ganha poderes no contrato por exercer esse papel acadêmico. A remodelação dos pilares administrativos e das modalidades de custódia continua como trabalho a detalhar.

## 6. Matriz de riscos: o conteúdo que precisa sair sem hesitar

### R1. Como se calcula a severidade?

`score = peso da probabilidade × peso do impacto`. Probabilidades de 10%, 30%, 50%, 70% e 90% correspondem a pesos 1, 2, 3, 4 e 5. Impacto vai de 1, muito baixo, a 5, muito alto. Classes: 1–4 baixa; 5–8 moderada; 9–14 alta; 15–25 crítica.

**Exemplo:** A4 tem 50% e impacto muito alto: `3 × 5 = 15`, crítico. Não é `0,5 × 5 = 2,5`. O score é ordinal para priorização, não probabilidade, valor monetário esperado ou medida com precisão científica.

Para oportunidades, a conta representa potencial: alta chance e alto benefício merecem ação para aproveitamento. Não se deve subtrair uma oportunidade de uma ameaça para “zerar” o risco.

### R2. Quais são as ameaças da Sprint 4?

A tabela compacta mantém todos os 18 eventos. O estado declarado no relatório não elimina a necessidade de conferir evidências atuais.

| ID / ameaça | P / impacto / score | Responsável | O que explicar na arguição |
|---|---|---|---|
| A1 Esforço e prazo | 70% / 4 / 16 | Adriana | Crítico. Priorizar requisitos, congelar escopo e redistribuir bloqueios. Não materializado não significa impossível. |
| A2 Implementação | 50% / 4 / 12 | Lavínia | Testes e revisão do delta entre versões; declarado mitigado. |
| A3 Inconsistência entre artefatos | 50% / 4 / 12 | Adriana | Materializou na S3; uma base e revisão cruzada. Divergências atuais mostram risco residual. |
| A4 Aderência ao IBITI | 50% / 5 / 15 | Leon | Crítico. Validar com parceiro; coerência acadêmica não comprova aceitação comercial. |
| A5 Premissas econômicas | 50% / 4 / 12 | Thomas | Parcial. Identificar fonte, hipótese e dado confirmado; validar ocupação e diária. |
| A6 Repositório | 30% / 3 / 6 | Adriana | Padronização, versão e rastreabilidade; organização não garante atualização de conteúdo. |
| A7 Regulatório | 50% / 4 / 12 | Erik | Parcial. Revisão especializada; minuta e rótulo utility não são autorização. |
| A8 Segurança do contrato | 30% / 5 / 10 | Zanette | Parcial. Testes e revisão; sem auditoria independente. |
| A9 Expansão de escopo | 30% / 4 / 8 | Lavínia | Registrar mudanças e proteger requisitos prioritários. |
| A10 Validações externas | 70% / 3 / 12 | Thomas | Materialização parcial. Pedido com dono, destinatário e prazo; declarar o que segue pendente. |
| A11 Disponibilidade da equipe | 50% / 3 / 9 | Adriana | Monitorar, formar duplas e compartilhar conhecimento. |
| A12 Infraestrutura externa | 50% / 4 / 12 | Zanette | RPC, faucet e explorador podem falhar; alternativas e registros locais. |
| A13 Perda de documentação | 10% / 4 / 4 | Lavínia | Baixo score, impacto alto: versionamento e recuperação ainda importam. |
| A14 Deploy sem evidência | 30% / 5 / 10 | Zanette | Novo. Endereço, rede, hash, recibo e escopo; mitigação declarada após evidências. |
| A15 Documento × contrato publicado | 50% / 4 / 12 | Adriana | Novo. Conferir fonte e instância; “mitigado” no relatório não resolve textos antigos. |
| A16 Apresentação ao parceiro | 50% / 4 / 12 | Leon | Novo. Ensaios completos cronometrados; pelo menos dois previstos. |
| A17 Omissão de requisitos | 90% / 4 / 20 | Adriana | Crítico. Checklist da rubrica com evidência e revisor; cálculo explicado abaixo. |
| A18 Exposição de dados/chaves | 30% / 5 / 10 | Lavínia | Novo. Revisão de arquivos e segredos; se exposto, revogar/rotacionar, não só apagar. |

Distribuição: **3 críticas, 12 altas, 2 moderadas e 1 baixa**. A8, mesmo com probabilidade baixa, tem impacto muito alto e não deve ser ignorado. Responsável pelo risco acompanha e aciona o plano; não precisa executar sozinho todas as ações.

### R3. E as oito oportunidades?

| ID | Oportunidade | Score | Ação de aproveitamento |
|---|---|---:|---|
| O1 | Aprendizado multidisciplinar | 20 | Rotação e participação dos seis integrantes em diferentes frentes. |
| O2 | Rastreabilidade | 15 | Registrar decisões e ligar requisito a evidência. |
| O3 | Arquitetura modular | 16 | Separar contrato, identidade, cotas e interface; documentar limites. |
| O4 | Escala no ecossistema | 10 | Validar o primeiro caso e manter expansão como roadmap. |
| O5 | Comunicação transparente | 12 | Linguagem consistente e fontes dos números. |
| O6 | Case replicável | 12 | Registrar aprendizados, decisões e limitações. |
| O7 | Validação com parceiro | 15 | Apresentar antes de congelar premissas. |
| O8 | Prova verificável on-chain | 16 | Vincular operação, rede, contrato e evidência correta. |

São cinco oportunidades críticas e três altas. “Realizada” precisa indicar qual resultado foi obtido: publicar um endereço não realiza automaticamente toda a oportunidade de operação verificável.

### R4. Mitigação, contingência, indicador e gatilho: qual a diferença?

Mitigação reduz probabilidade ou impacto antes do evento. Contingência é a resposta se ele ocorrer. Indicador acompanha a exposição. Gatilho define quando agir.

**Exemplo A1:** checklist e priorização são mitigação; redistribuir e formar dupla após bloqueio é contingência; quantidade de tarefas atrasadas é indicador; bloqueio acima de um dia útil é gatilho registrado. **A8:** testar é mitigação; pausar, investigar e publicar correção em nova instância é resposta possível, com tratamento explícito dos saldos, pois não há proxy.

### R5. Como explicar A17 e os 90%?

O relatório usa três sprints com omissões: seis, duas e duas. As notas foram 7,3; 7,5; 8,2. Aplicando a regra de sucessão de Laplace à ocorrência de pelo menos uma omissão: `(3 + 1)/(3 + 2) = 80%`. Usando Poisson com média de duas omissões nas duas últimas sprints: `P(N ≥ 1) = 1 − e^(−2) ≈ 86,47%`. A equipe enquadra o risco na faixa discreta de 90%; peso 5 × impacto 4 = 20.

**Resposta ao questionamento metodológico:** são aproximações para priorização com amostra muito pequena, não uma probabilidade calibrada da próxima nota. Laplace e Poisson respondem por modelos diferentes; não se devem somar seus resultados. Independência e taxa estável da Poisson não foram demonstradas. Se a média cair para uma omissão, a conta seria 63,2%, mas isso é hipótese futura de melhoria, não resultado observado do checklist.

### R6. Que evidência mostra que a matriz precisava melhorar?

Na Sprint 3 foram identificadas seis divergências de posicionamento/classificação em 20 eventos: 30%. A9, A11, A12, A13, O4 e O1 aparecem no diagnóstico de inconsistência. A Sprint 4 propõe uma base única para texto, tabela e imagem. O importante é explicar o controle introduzido e reconhecer o risco residual; não defender um desenho antigo como correto.

### R7. “Mitigado” significa risco encerrado?

Não. O relatório marca A2, A6, A14, A15, A17 e A18 como mitigados; isso descreve ações/evidências registradas. Deve-se avaliar exposição residual. Os documentos ainda divergentes, a falta de validação econômica e a ausência de auditoria impedem a conclusão de que “todos os riscos estão resolvidos”.

## 7. Memorando de Oferta v2 e planilha: cobertura das seções substantivas

Fontes: memorando da Sprint 4, 17 páginas, e `Modelo_Glamping_v2.xlsx`, cinco abas. O memorando v1 foi usado para identificar evolução e diferenças. As introduções e a conclusão repetitiva foram condensadas; os temas substantivos foram mantidos.

### M1. Seções 01–02: qual o status e quais são os termos centrais?

Documento acadêmico e conceitual, não demonstra oferta comercial autorizada. Os termos centrais são 150 unidades, 100 para colocação inicial, 50 de reserva, experiência, pertencimento e royalty variável de 15% da receita elegível. O disclaimer não valida sozinho uma eventual oferta real.

O preço de referência é R$ 34.874,14. É estimativa de valor presente, não cotação de mercado, preço de revenda ou garantia de receber esse valor. O modelo financeiro usa 2027–2030; o contrato atual usa oito semestres desde uma abertura ainda sem data real confirmada. Essa diferença precisa de conciliação antes de usar a projeção como cronograma contratual.

### M2. Seção 03: qual a tese econômica?

Antecipar parte do fluxo futuro de royalties para fortalecer o ecossistema IBITI. A construção é responsabilidade do empreendedor terceiro. O token combina utilidade, pertencimento e direito econômico; não cria receita por existir.

**Pergunta difícil:** “Como antecipar antes da abertura se o contrato não deixa vender?” Existe uma divergência real. A implementação atual exige abertura registrada para comprar. A equipe precisa escolher e documentar uma política comercial coerente e, se necessário, revisar a implementação com autorização. Não afirmar que já existe pré-venda funcional.

### M3. Seção 04: quais direitos permanecem depois da hospedagem?

A experiência é consumível; o IBT permanece. Pertencimento e royalties seguem conforme vigência e regras. Passaporte não é um segundo token. Não há direito societário, imobiliário ou de gestão.

**Atenção à versão:** o memorando ainda descreve marcação do resgate no smart contract e transferências entre aprovados. No código atual, a hospedagem é controlada no backend por pessoa e a transferência ordinária é bloqueada. Responda explicitamente que esses trechos precisam ser conciliados. Expiração não queima automaticamente os tokens nem apaga recebíveis já apurados.

### M4. Seção 05: por que 150? Como interpretar reserva e teto?

150 é uma premissa de estruturação econômica, não resultado necessário do número de unidades hoteleiras. Todos os tokens integram o denominador econômico. Dividir por 100 superestimaria o direito individual, porque os 50 de reserva também participam.

- Um IBT durante o semestre inteiro: `15% ÷ 150 = 0,1%` da receita bruta do período.
- Vinte IBT durante todo o período: 13,33% dos tokens e **2 pontos percentuais da receita bruta**.
- Cinquenta IBT: um terço dos tokens e **5 pontos percentuais da receita bruta**.
- Os 100 ofertados equivalem, se mantidos pelo período completo, a 10 pontos dos 15% da receita.

Não dizer “reserva de 5% dos tokens” nem “teto de 2% dos tokens”. Com limite de 20 por pessoa, colocar 100 exige no mínimo cinco participantes; não prova existência de demanda. Reduzir a reserva libera estoque já emitido e exige decisão administrativa; não cria novos tokens.

### M5. Seção 06: como a operação vira receita?

| Premissa | 2027 | 2028 | 2029 | 2030 |
|---|---:|---:|---:|---:|
| Unidades | 6 | 20 | 20 | 20 |
| Ocupação | 35% | 20% | 25% | 30% |
| Diária aproximada | R$ 7.333 | R$ 8.066 | R$ 8.873 | R$ 9.760 |
| Consumo por hospedagem | R$ 2.000 | R$ 2.090 | R$ 2.184 | R$ 2.282 |
| Receita bruta aproximada | R$ 6,132 mi | R$ 12,794 mi | R$ 17,522 mi | R$ 23,041 mi |
| Royalty total aproximado | R$ 919.762 | R$ 1.919.090 | R$ 2.628.259 | R$ 3.456.149 |

`Diárias vendidas = unidades × 365 × ocupação`.

`Hospedagens = diárias vendidas ÷ 3`.

`Receita = diárias vendidas × diária + hospedagens × consumo médio`.

`Royalty = receita × 15%`.

**Exemplo completo de 2027:** `6 × 365 × 35% = 766,5` diárias esperadas; `766,5 ÷ 3 = 255,5` hospedagens esperadas; hospedagem gera R$ 5.620.744,50 e consumo R$ 511.000,00; receita R$ 6.131.744,50; royalty R$ 919.761,675 antes de apresentação arredondada.

Diárias fracionárias representam expectativa agregada, não reserva de meia noite. Os 365 dias constantes inclusive em 2028 são uma simplificação. A queda percentual de ocupação em 2028 acompanha aumento de 6 para 20 unidades: pode haver mais diárias vendidas mesmo com menor taxa de ocupação.

A diária cresce 10% ao ano; o consumo cresce 4,5%. Não aplicar 10% a ambos. O documento atribui diária e consumo iniciais ao parceiro; a aceitação comercial desses valores e a curva de ocupação continuam exigindo validação.

### M6. Como sair da receita e chegar ao preço por token?

`Preço = [soma dos royalties anuais / (1 + k)^t] ÷ 150`, com `t = 1, 2, 3, 4` e `k = 20,4601%` ao ano.

A soma nominal dos royalties é **R$ 8.923.259,16**. Seu valor presente é **R$ 5.231.121,38**. Dividindo por 150: **R$ 34.874,1425...** por IBT. Não usar a soma nominal como preço: isso ignoraria tempo e risco.

Não há valor terminal nem devolução automática do principal no modelo. A utilidade da hospedagem e o pertencimento não recebem um valuation separado nessa conta; não afirmar que o preço incorpora uma avaliação independente de todos os benefícios.

**Detalhe de arredondamento:** a planilha calcula 100 unidades com preço integral, chegando a aproximadamente R$ 3.487.414,25. Cobrar exatamente R$ 34.874,14 por cada uma de 100 unidades resulta em R$ 3.487.414,00. A diferença de R$ 0,25 é precisão da planilha, não dinheiro faltando.

### M7. O que são CAPM e WACC e por que aqui coincidem?

CAPM estima custo de capital próprio: `Ke = Rf + beta × prêmio de risco`. No método selecionado: `14,26% + 0,83 × 7,47% = 20,4601%`.

Rf é a referência de taxa livre de risco adotada; beta é exposição ao risco sistemático do setor; prêmio de risco é remuneração adicional exigida. Não são a probabilidade de falência nem uma taxa garantida do token.

WACC pondera custos de capital próprio e dívida: `E/(D+E) × Ke + D/(D+E) × Kd × (1−T)`. Como a hipótese é dívida zero, WACC = Ke. A alíquota de 34% presente na aba não é o imposto devido por todo comprador sobre royalties; integra a estruturação de custo de capital.

**Aprofundamento pela planilha:** a aba Wacc tem dois caminhos. O método 1 combina referências em dólar, risco-país e ajuste de inflação, chegando a cerca de 13,3662% em reais. O método 2, selecionado, chega a 20,4601%. Isso demonstra sensibilidade à metodologia, não duas taxas igualmente usadas no preço. É necessário justificar moeda, data e prêmio escolhido; essas referências são premissas do arquivo, não taxas atuais verificadas de mercado.

### M8. Como o memorando v2 evoluiu em relação ao v1?

O v1 usa Ke/WACC de 17,8609%, valor presente de aproximadamente R$ 5.558.278 e preço de R$ 37.055,19. O v2 seleciona 20,4601%, reduz o valor presente a R$ 5.231.121 e o preço a R$ 34.874,14, mantendo a base operacional nominal. Acrescenta Monte Carlo com 5.000 cenários e interpretações de risco. A mudança de taxa explica a queda de preço; não atribuir a redução a uma queda de receita que o modelo-base não fez.

O v1 já corrigia um erro anterior: usar R$ 59.488 de royalties nominais por token como preço. Seu anexo distingue elasticidade, extensão de cenário a ±25% e fluxo projetado de retorno garantido. Essas lições continuam válidas, mas os números de taxa/preço são históricos.

### M9. Seção 07: o que cenário e sensibilidade mostram?

Cenário muda premissas para observar consequências. Sensibilidade mede quanto o resultado responde à mudança. Nenhum dos dois, sozinho, atribui probabilidade ao cenário.

Bear e bull do v2 aplicam choque relativo de −25% e +25% à ocupação: preços de **R$ 26.155,61** e **R$ 43.592,68**. Ocupação de 35% com choque de −25% vira 26,25%, não 10%. A matriz de sensibilidade também trabalha faixas de ±20%; não confundir a grade com a banda estendida.

No modelo, variar ocupação em ±20% varia o valor em ±20%, porque a receita de hospedagem e consumo escala proporcionalmente. Isso depende de manter outras premissas fixas, sem saturação ou reação de preços. Não prova comportamento linear do hotel real.

Com ocupação-base, diária crescendo 5% ou 15% gera aproximadamente R$ 32.359,86 ou R$ 37.552,55. WACC perto de 18,46% ou 22,46% gera R$ 36.534,59 ou R$ 33.324,66. A afirmação “ocupação domina” depende das faixas comparadas; não se compara 1% relativo com 1 ponto percentual sem explicar a unidade.

### M10. Seção 08: como Monte Carlo foi construído?

São 5.000 cenários, cada um com sete sorteios: um fator de nível da ocupação comum aos quatro anos; quatro ruídos anuais de ocupação; um fator de diária inicial; um crescimento anual da diária. Mantêm-se WACC, capacidade e demais premissas-base.

| Variável | Centro / desvio | Limites empregados |
|---|---|---|
| Nível de ocupação | 1 / 0,20 | 0,50 a 1,50 |
| Ruído anual de ocupação | 0 / 0,10 | −0,30 a +0,30 |
| Fator da diária | 1 / 0,10 | 0,70 a 1,30 |
| Crescimento da diária | 10% / 3 p.p. | 0% a 20% |

Ocupação anual = ocupação-base × nível comum × (1 + ruído anual), limitada entre zero e 95%. A diária parte de R$ 7.333 vezes o fator inicial e cresce pela taxa sorteada. Recalculam-se receita, royalties, valor presente e TIR para cada linha.

Os sorteios uniformes foram gravados como valores, com semente 20260924. As transformações e resultados são fórmulas. Mudar uma premissa recalcula o modelo sem necessariamente mudar os sorteios. Reproduzi as 5.000 linhas: a maior diferença entre o VP recalculado e o valor salvo ficou abaixo de R$ 0,000000001. Isso confirma a reprodução numérica, não valida as premissas econômicas.

**Precisão metodológica:** o texto chama as distribuições de “normais truncadas”, mas as fórmulas aplicam `NORMINV` e travas `MIN/MAX`. Isso corta os valores para as bordas, acumulando observações nos limites; não é a mesma amostragem de uma normal condicionalmente truncada. Saiba reconhecer a diferença sem esconder o que foi implementado.

### M11. Quais resultados de Monte Carlo precisam ser entendidos?

| Métrica | Resultado | Interpretação correta |
|---|---:|---|
| Média do valor por token | R$ 35.062,09 | Média dos cenários modelados. |
| Mediana | R$ 34.683,61 | Metade dos valores fica abaixo, metade acima. |
| P5 / P95 | R$ 22.221,82 / R$ 48.836,28 | Faixa central de 90% dos cenários dessa simulação. |
| P25 / P75 | R$ 29.348,70 / R$ 40.435,28 | Faixa central de 50%. |
| Desvio-padrão | R$ 8.104,53 | Dispersão dos resultados, não erro de digitação. |
| Coeficiente de variação | 23,1% | Desvio dividido pela média. |
| VP menor que o preço | 51,04% | Cenários abaixo do retorno requerido pelo desconto adotado. |
| TIR abaixo de Rf | 28,14% | Cenários abaixo da referência de oportunidade do arquivo. |
| Soma nominal menor que o preço | 2,9% | Perda nominal nos fluxos modelados, sem desconto do tempo. |
| TIR P5 / mediana / P95 | 2,8% / 20,2% / 36,4% | Distribuição da TIR das linhas simuladas. |

Não há contradição entre 51,04% e 2,9%: pode-se recuperar mais reais nominais do que se pagou e ainda receber menos que o retorno exigido pelo risco e pelo tempo.

O preço-base não é exatamente a mediana nem a média. Mínimo e máximo observados, aproximadamente R$ 13.269 e R$ 66.887, não são limites garantidos do mundo real. O erro-padrão da média, aproximadamente R$ 114,62, mede precisão amostral da média sob o modelo; não mede erro das hipóteses.

### M12. O que significa dizer que ocupação explica aproximadamente 75%?

A planilha calcula correlações de cada entrada com o VP, eleva ao quadrado e normaliza pela soma dos R². O nível da ocupação representa aproximadamente 75%; os quatro ruídos, 4,7%; diária inicial, 15,6%; crescimento, 4,7%.

É uma aproximação de contribuição baseada em correlação, não decomposição causal exata nem índice de Sobol. Os ruídos anuais usam os sorteios uniformes como proxy. Há dependência entre as ocupações dos anos porque compartilham o fator de nível, mesmo com ruídos independentes.

**Decisão útil:** coletar evidências melhores de demanda e ocupação antes de sofisticar casas decimais do valuation. Mais simulações reduzem ruído numérico, mas não consertam uma hipótese errada.

### M13. Quais riscos a simulação deixou de fora?

Atraso na abertura, não pagamento do operador, mudança de WACC, impostos/custos do investidor, mudanças regulatórias, falhas de custódia, indisponibilidade técnica e alterações estruturais de demanda não estão modelados de forma completa. Distribuições e desvios são hipóteses, sem calibração operacional suficiente demonstrada.

Por isso, “2,9%” não é a chance real total de perder dinheiro. As probabilidades valem **condicionalmente ao modelo**. A banda bear/bull também não é um limite: 13,7% das simulações ficam abaixo do bear e 15,58% acima do bull.

Usar P25 como preço é uma alternativa analítica discutida, não decisão aprovada: aproximadamente 75% dos VPs simulados ficariam acima desse preço, mas a captação de 100 unidades cairia em cerca de R$ 552,5 mil. O trade-off é receita de emissão versus margem para o comprador, sem eliminar riscos omitidos.

### M14. Seção 09: para onde vai a captação?

Está definido no documento: fortalecimento do ecossistema IBITI, não construção do Glamping. São categorias propostas: atividades/infraestrutura do ecossistema, Passaporte e relacionamento, estruturação jurídica, tecnológica e auditoria. Percentuais, cronograma e gestor dos recursos não estão integralmente aprovados.

Não inventar uma distribuição percentual entre categorias. Demanda acima de 100 unidades não autoriza emissão extra. Valor econômico atribuído aos 50 tokens da reserva também não é dinheiro captado em caixa.

### M15. Como explicar os dois fluxos de tesouraria?

**Fluxo A, emissão:** participante → pagamento da compra → tesouraria/estrutura IBITI → destinação aprovada ao ecossistema.

**Fluxo B, operação:** hotel gera receita → financeiro apura → obrigação de 15% → reporte e provisão do valor devido → saque pelos titulares, inclusive direitos da tesouraria.

Royalties devem vir da receita operacional elegível, não de novas compras de tokens. A expressão “fluxos distintos” é econômica; não significa que o código prove segregação contábil, origem dos fundos ou cumprimento jurídico.

No contrato atual, `reportRevenue` calcula direitos pelo tempo de posse e deposita a soma das parcelas. Cada titular chama `claimRoyalty`. O administrador reporta receita externa; o hash permite conferir a integridade do relatório disponibilizado, mas não prova que o faturamento é verdadeiro.

### M16. Seção 10: qual o retorno do comprador e por que a TIR coincide com o WACC?

Um token mantido por todos os períodos teria fluxos nominais projetados de aproximadamente R$ 6.131,74; R$ 12.793,93; R$ 17.521,73; R$ 23.040,99. Soma: R$ 59.488,39. Frente ao preço-base, diferença nominal de R$ 24.614,25, cerca de 70,6%, múltiplo de 1,71 vez.

Isso não é 70,6% ao ano. Também não basta dividir 70,6% por quatro para achar TIR: as entradas ocorrem em datas diferentes. A TIR é a taxa que zera o valor presente líquido. Como o preço foi definido pelo desconto desses mesmos fluxos a 20,4601%, a TIR-base coincide por construção. Não é garantia nem resultado independente confirmando a atratividade.

A planilha agrega anos; o contrato paga por semestres civis desde a abertura e pondera aquisição. O comprador que entra depois não herda automaticamente todos os fluxos anuais integrais da tabela. A conversão do valuation anual para o calendário efetivo é um ponto a fechar.

### M17. Seções 11–12: governança, jurídico e riscos específicos?

IBITI administra; operador gera receita; titulares não votam sobre o hotel. `Ownable2Step` evita transferência unilateral para um administrador que não aceitou, mas mantém um único proprietário com poderes relevantes. Controles adicionais de receita, chaves e custódia não são demonstrados como estrutura institucional concluída.

Riscos substantivos: enquadramento regulatório, baixa demanda, desempenho operacional, iliquidez, concentração, dependência de apuração externa, tecnologia, propósito regenerativo, privacidade, chave administrativa, perda do banco e falta de auditoria independente. Limitar participação a 20 não dispersa o poder da chave administrativa.

### M18. Seção 13: qual a recomendação financeira central?

Validar ocupação e diária com o operador, esclarecer o calendário e documentar destinação/governança. Refinar o cálculo sem melhorar essas evidências pode dar precisão aparente. A tese é condicionada a operação e recebíveis reais; um modelo reproduzível não equivale a negócio comercialmente validado.

### M19. Como navegar pela planilha se o professor abrir uma célula?

| Aba | O que mostrar |
|---|---|
| Valor do token | Premissas, receitas, royalties, valor presente e preço. B24 é referência do preço. |
| Wacc | Dois métodos; C40 seleciona o caminho e C44 alimenta o desconto. |
| Sensibilidade | Efeito de ocupação, crescimento da diária e WACC. |
| Monte Carlo | Hipóteses, estatísticas, histograma, probabilidades e correlações. |
| MC Sorteios | 5.000 linhas; B:H são sorteios fixos; U contém VP por token; AB, TIR. |

A sequência é premissa → receita → royalty → desconto → preço → risco. Foram encontradas pequenas inconsistências de rótulo: “Valor presente (consumo)” identifica uma conta ligada a royalties; uma indicação textual da aba Wacc aponta para linha que não representa o fluxo final pretendido. Explique a fórmula e suas referências, não apenas o título da célula. A inspeção dos valores salvos não encontrou células com erro de Excel.

## 8. Whitepapers das Sprints 2 e 3

Fontes: whitepaper inicial de 31 páginas e sua versão Markdown; revisado de 28 páginas. Prioridade recomendada para arquitetura; diferenças de versão são críticas.

### W1. Para que serve o whitepaper se já existe memorando?

O whitepaper explica modelo, direitos, arquitetura, regras e limites técnicos. O memorando organiza termos, tese econômica, projeções, riscos e destinação. O código executa um subconjunto das regras; instrumentos jurídicos criam obrigações fora da rede. Um documento não substitui os demais.

### W2. Qual evolução precisa ser defendida?

O histórico saiu de propostas de resgate associado à unidade para cotas de hospedagem por pessoa fora da blockchain. A implementação posterior acrescentou pessoa registrada no contrato, compra atômica, calendário ligado à abertura, royalty temporal e bloqueio de circulação secundária. A arquitetura preserva um ERC-20 fungível em vez de individualizar cada unidade com um estado de experiência usada.

### W3. O que os whitepapers cobrem além de tokenomics?

Problema e proposta de valor; agentes e responsabilidades; fontes de receita; direitos e lifecycle; arquitetura on-chain/off-chain; identidade e carteiras; compra, uso e royalties; administração e segurança; propriedades do sistema; integração, execução, riscos e referências. Para programação, saber localizar regras, invariantes e o motivo da separação entre contrato e banco é mais útil que decorar todas as siglas.

### W4. Quais afirmações históricas não devo repetir como atuais?

Preço de R$ 53 mil e ocupação antiga da Sprint 2; preço de R$ 37.055 e WACC de 17,8609% da Sprint 3; fotografia de saldo para royalty; circulação permitida entre titulares; controle agregado somente no backend; janela fixa 2027–2030; ausência de imposição de três noites no portal. São momentos diferentes do projeto. O README raiz ainda descreve a Sprint 3 e aponta ao endereço de setembro 11, apesar de haver nova entrega da Sprint 4.

## 9. Riscos éticos e impacto — Sprint 2

Fonte: Markdown e PDF de 13 páginas. Prioridade recomendada; conexão com governança é crítica.

### E1. Quais dilemas éticos centrais foram identificados?

Baixa demanda/exclusão; conflito entre remuneração financeira e propósito regenerativo; concentração de poder; dependência tecnológica; tensão entre transparência e privacidade. A iniciativa pode criar vínculo e recursos, mas também pressão por ocupação e receitas incompatíveis com limites ambientais.

### E2. Não dar voto ao titular elimina influência sobre o projeto?

Não. Retorno esperado, reputação e poder econômico podem pressionar decisões mesmo sem direito formal de voto. O teto reduz concentração econômica entre participantes, mas não descentraliza o administrador nem elimina dependência do operador.

### E3. Como evitar greenwashing?

Separar objetivo de impacto de resultado medido. Definir indicador, linha de base, responsável, periodicidade e evidência externa. Um hash atesta integridade de um arquivo, não demonstra que uma área foi regenerada. Benefícios locais, oportunidades para produtores e salvaguardas ambientais precisam de execução e avaliação; a emissão sozinha não os entrega.

### E4. Transparência exige publicar CPF ou reservas?

Não. Publicar dados pessoais seria desnecessário para demonstrar saldo e pagamento. A proposta usa referências e dados agregados; ainda assim, endereços e relações podem permitir correlação. Pseudonimização não deve ser chamada de anonimato absoluto. Na operação atual, o banco continua contendo dados pessoais protegidos e exige controle de acesso, retenção e continuidade.

### E5. Qual compromisso ético deve aparecer na comunicação?

Explicar iliquidez, dependência de receita, administração centralizada e limitações. Ocultar riscos sob linguagem de pertencimento não os elimina. Primazia regenerativa e participação comunitária são orientações a concretizar em governança, não garantias do código.

## 10. Estrutura Jurídica — Sprint 3

Fonte: `IBIToken_Estrutura_Juridica.md`, inclusive minutas. Esta seção prepara a discussão acadêmica; não conclui enquadramento comercial definitivo.

### J1. Ser ERC-20 ou utility token define a natureza jurídica?

Não. A análise depende de direitos e estrutura econômica efetivos. Expectativa de remuneração ligada ao esforço do operador torna relevante avaliar contrato de investimento coletivo. A CVM adota análise funcional, não apenas o nome do token. O Parecer 40 considera investimento, formalização, caráter coletivo, benefício econômico, esforço de empreendedor/terceiro e oferta pública. [CVM, Parecer de Orientação 40](https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/pareceres-orientacao/anexos/Pare040.pdf).

O artefato utiliza uma aproximação ao Howey Test. Não reduzir automaticamente a análise brasileira a quatro perguntas nem afirmar que “sem participação societária” significa “sem possível regulação de valores mobiliários”.

### J2. Dizer “oferta privada” ou “material acadêmico” resolve a regulação?

Não por si. O documento propõe colocação curada e restrita, sem listagem aberta. A execução concreta, a distribuição e a comunicação precisam corresponder a essa proposta. O cadastro público da demo registra interesse, não uma compra comercial, mas uma oferta futura exigiria avaliar seus canais e destinatários. A afirmação documental sobre dispensa ou enquadramento precisa de validação especializada; não apresentar CVM 88 ou outra via como automaticamente aplicável ou automaticamente excluída.

### J3. Quais instrumentos o artefato propõe e para quê?

| Instrumento proposto | Função |
|---|---|
| Emissão/estrutura do token | Definir emitente, direitos, limites, vigência e obrigações. |
| Adesão do participante | Registrar ciência, condições de uso, riscos e obrigações recíprocas. |
| Relação com provedor de serviços de ativos virtuais | Definir conversão, custódia ou serviços efetivamente contratados. |
| Instrumento/aditivo com operador do Glamping | Definir receita elegível, apuração, repasse, prestação de contas e consequências do descumprimento. |

São minutas com elementos a preencher/validar, não contratos assinados. Transfero/BRZ são referências de arquitetura comercial; a demo não comprova contratação ou integração financeira real.

### J4. O token garante o recebível ou o patrimônio do hotel?

O registro digital não cria sozinho segregação patrimonial, garantia real nem execução automática contra o operador. É preciso instrumento jurídico e mecanismos de cobrança e prestação de contas. A insolvência ou inadimplência não é resolvida simplesmente por haver um saldo na blockchain.

### J5. Como responder sobre tributação?

O documento traz hipóteses tributárias, mas não se deve equiparar automaticamente distribuição de royalties a ganho de capital na alienação de criptoativo. Fato gerador, natureza do pagamento, contribuinte, jurisdição, retenção e legislação aplicável precisam ser definidos. Para a arguição, reconheça que a tributação comercial permanece pendente; não reproduza como regra universal a faixa de 15%–22,5% ou um limite de isenção citado no histórico.

### J6. Recuperação técnica é sucessão hereditária?

Não. O fluxo atual recupera acesso da mesma pessoa para outra carteira validada. Transferência para herdeiro altera o titular civil e exige tratamento jurídico/operacional próprio. Também não usar a ideia antiga de queima ao expirar como descrição do código entregue.

## 11. Guia de Comunicação — Sprint 3

Fonte: PDF de 23 páginas, incluindo complemento sobre cotas off-chain. Prioridade recomendada.

### C1. Qual o objetivo de comunicação?

Em pouco tempo, a pessoa deve entender o que recebe, como utiliza e como participa. A experiência pode abrir a conversa, mas riscos, limitações e componente econômico precisam ser claros. A linguagem é calma, concreta e sem promessa de valorização.

### C2. Quais princípios são mais cobrados?

Blockchain discreta por padrão, acessível quando necessária; cada número com fonte e data; honestidade sobre centralização; consistência de termos; detalhes em camadas; privacidade; mensagens de erro que expliquem fato, motivo e próximo passo. Nos slides, os princípios P3, P5 e P9 recebem destaque: tecnologia acessível sem excesso de jargão, origem dos números e transparência dos poderes administrativos.

### C3. Dê um exemplo de comunicação boa e ruim.

Ruim: “Ganhe 15% ao ano automaticamente”. Correto: “O programa prevê destinar 15% da receita bruta elegível aos direitos dos 150 tokens; o valor individual depende da quantidade, do tempo de posse e da receita apurada.”

Ruim: mostrar `NOT_ELIGIBLE` sem explicação. Melhor: “Sua compra ainda depende do vínculo da carteira. A equipe de cadastro precisa concluir essa etapa.” Não afirmar uma causa específica se o sistema não a identificou.

### C4. Como acessibilidade e design entram na defesa?

Hierarquia legível, contraste, foco de teclado, estados textuais além de cor, controles compreensíveis e mensagens acessíveis. O guia especifica referências visuais e tipográficas, mas aplicar uma paleta ou citar acessibilidade não comprova conformidade: é necessário verificar a interface real.

### C5. Qual limite de “blockchain invisível”?

Reduzir carga técnica sem ocultar quem controla a chave, quem pode pausar ou quais direitos existem. Trocar “investimento” por “pertencimento” não muda a natureza econômica. O guia histórico contém números e fluxos que precisam acompanhar a versão atual; a comunicação deve seguir a mesma referência factual.

## 12. Programação: respostas para o professor técnico

Fontes principais: implementação da Sprint 4, contrato, biblioteca de calendário, backend, interface, scripts e testes. A implementação da Sprint 3 serve para comparação histórica. Prioridade crítica até P24; os aprofundamentos também devem ser conhecidos por quem apresentará o código.

### P1. Descreva a arquitetura em um minuto.

“O contrato Solidity controla IBT, participantes registrados, compra, royalty, calendário e recuperação. O serviço Node/TypeScript associa a pessoa a carteiras e mantém cadastro, cotas e hospedagens em SQLite. O indexador lê eventos da rede e concilia o banco. A interface HTML/CSS/JavaScript apresenta jornadas por etapa e papel. A blockchain não sabe se o hóspede compareceu nem se a receita informada é verdadeira.”

Não usa Hardhat nem um frontend React. A validação local usa solc, Anvil, ethers e o runner de testes do Node. Node 24+ é requisito registrado.

### P2. Por que ERC-20 com zero decimais e não NFT?

As unidades representam direitos econômicos equivalentes e são fungíveis. Zero decimais impede frações de IBT; não significa que a moeda de pagamento também tenha zero decimais. Individualizar “token usado” quebraria essa equivalência; por isso consumo de hospedagem fica no livro de cotas por pessoa, sem ID individual de cada IBT.

A interface ERC-20 foi herdada com restrições de transferência. Não prometer compatibilidade irrestrita com DEXs ou qualquer integração que espere transferências livres.

### P3. Como o supply fica em 150?

A emissão ocorre no construtor; compras entregam estoque existente. Não existe função pública para emitir livremente. Recuperação pode usar queima e emissão compensatórias, preservando 150 no estado final da transação. A regra é soma dos saldos igual ao total e emissão total fixa; não “jamais existe uma chamada interna de mint depois do construtor”.

A reserva inicial de 50 é um piso de estoque retido; `reduceReserve` pode diminuí-lo conforme autorização administrativa, não aumentar a emissão. Não há burn por hospedagem nem por simples expiração.

### P4. `owner` e `treasury` são iguais?

Começam relacionados ao administrador inicial, mas têm responsabilidades distintas. `owner` autoriza operações administrativas. `treasury` mantém estoque e recebe pagamento primário, sendo fixada na implantação. Trocar owner não transfere automaticamente o estoque. Essa separação evita que a troca administrativa destrua o cálculo de reserva ou trate uma pessoa administradora como nova tesouraria.

### P5. Como o teto por pessoa funciona sem pôr CPF na rede?

O backend valida/deduplica o CPF com HMAC e associa a um UUID. Deriva desse UUID uma referência `bytes32` para `personOf`; ela não é o hash direto do CPF. O contrato acompanha `personBalance`, além do saldo da carteira. A administração registra a associação; compra que ultrapasse 20 no agregado reverte.

Exemplo: pessoa com 12 IBT numa carteira só pode adquirir mais 8 em outra. O contrato não detecta identidades civis duplicadas criadas incorretamente pelo administrador: a qualidade do vínculo é uma dependência externa.

### P6. `approve` cadastra a pessoa ou libera transferência secundária?

Não. `approve` concede allowance ERC-20 a um spender. O cadastro do participante é outra operação. Para pagar, o comprador aprova o contrato IBT a gastar tBRL; depois chama `buyPrimary`. Aprovar gasto de IBT não contorna o bloqueio em `_update`/regras de transferência. `transferFrom` continua sujeito às mesmas regras.

### P7. O que acontece numa compra atômica?

`buyPrimary` valida quantidade, referência única, abertura, vigência, cadastro, estoque e teto; entrega unidades e cobra a stablecoin dentro da mesma transação. Se falta saldo/allowance ou a transferência falha, a EVM reverte todo o conjunto, inclusive a entrega e o agregado pessoal. A referência da venda impede repetir a mesma compra para o mesmo comprador.

`primaryPurchase` é a via administrativa de pagamento externo quando não há stablecoin configurada; não é um modo de dar baixa em PIX automaticamente. Com moeda configurada, a compra paga usa `buyPrimary`.

### P8. Onde fica o preço e ele pode mudar a cada compra?

No `primaryUnitPrice`, definido uma única vez. O contrato multiplica pelo número de unidades usando inteiros. No demo, tBRL tem seis casas: R$ 34.874,14 é representado por 34.874.140.000 unidades mínimas. O IBT tem zero casas, então quantidade 2 significa dois tokens, sem multiplicar por 10^18.

A interface apresenta a referência econômica, mas o checkout consulta preço e moeda do contrato. Trocar texto na tela não altera preço on-chain.

### P9. Como o calendário evita oito reportes no mesmo dia?

A abertura é registrada uma vez, com referência e data já ocorrida. Cada encerramento é calculado adicionando seis meses civis à abertura original. O reporte precisa seguir o próximo período e aguardar seu fim. O limite de oito não é a única trava: há barreira temporal real.

`OpeningCalendar` trata dias por mês e anos bissextos; 31 de agosto mais seis meses ajusta para o fim de fevereiro. Os aniversários derivam da data original, evitando deslocamentos acumulados. Usa UTC e limita a faixa suportada. Se a apuração estiver atrasada, pode processar períodos vencidos sequencialmente; o atraso não muda o tempo de posse de cada corte.

### P10. Como calcular royalties proporcionais ao tempo?

Para cada carteira e período, acumula-se `W = soma(saldo × segundos)`. Seja `D` a duração do semestre e `R = floor(receita × 1500 / 10000)`. Então `devido = floor(R × W / (150 × D))`.

Os 1500/10000 representam 15% em basis points. A receita entra em unidades mínimas da moeda. Não usar ponto flutuante ou reais formatados no contrato.

**Exemplo central:** receita de 150.000 tBRL → royalty de 22.500. Pessoa A com 2 IBT pelo semestre inteiro recebe `22.500 × 2/150 = 300`. Pessoa B com 2 IBT só pela metade recebe 150. Mesma quantidade final, valores diferentes. A tesouraria recebe os direitos correspondentes ao estoque e ao tempo que o manteve.

### P11. Como o código não perde o tempo anterior a uma compra?

Antes de alterar os saldos, `_update` acumula os pesos de origem e destino até aquele instante. Depois atualiza os saldos e o agregado pessoal. A acumulação respeita início e fim de cada semestre; há apenas oito períodos. Apurar tarde não transforma o intervalo após o semestre em royalty extra daquele período.

Em recuperação, os pesos pertinentes migram sem duplicar tempo. A tesouraria pode ter saldo zero no fim e ainda ter direito referente ao estoque mantido antes da venda total.

### P12. Por que o denominador inclui a reserva?

Porque a emissão é de 150 direitos. Excluir tokens não vendidos elevaria artificialmente a parcela dos compradores. O contrato considera a tesouraria como titular econômico do estoque enquanto ele permanece com ela. O exemplo de 146 IBT finais não basta para calcular sua parcela: é preciso considerar o estoque maior que possuía antes das duas vendas.

### P13. Quem prova que a receita é verdadeira?

O contrato não prova. O owner informa `grossRevenue` e `reportHash`. O hash liga a apuração a um documento, desde que ele esteja disponível para conferência, mas não audita a contabilidade. São necessários processo de apuração, obrigação contratual e validação independente. A administração atua como entrada de informação externa, um ponto de confiança.

### P14. `reportRevenue` já paga todo mundo?

Ele apura e, com stablecoin, exige provisão da soma devida na mesma transação. Cada titular solicita o saque com `claimRoyalty`. Isso é pagamento por retirada, ou pull payment. Não existe um envio espontâneo a cada pessoa assim que o hotel fatura.

O cálculo arredonda para baixo. O contrato transfere para si **a soma das parcelas devidas**, não necessariamente os 15% brutos arredondados. A diferença residual permanece com quem financia o reporte; a frase antiga de que a sobra fica no contrato não descreve esta lógica.

### P15. Como evitar saque duplicado e reentrância?

A função verifica a obrigação, zera o valor pendente e registra o pagamento antes da interação externa. `nonReentrant` acrescenta trava contra reentrada; `SafeERC20` trata transferências de tokens com diferentes comportamentos de retorno. Se o envio falha, a transação toda reverte e a obrigação não desaparece. Teste essencial: o segundo saque não paga novamente.

### P16. Configurar stablecoin garante segurança do pagamento?

Não. A configuração é única e exige um endereço de contrato; isso não prova estabilidade econômica ou compatibilidade irrestrita. O código confere variação de saldo para rejeitar recebimento inferior ao esperado, como tokens com taxa de transferência. Rebasing e comportamento não convencional precisam ser avaliados. tBRL é moeda de teste, não BRZ real nem reais bancários.

Períodos de liquidação externa preservam sua modalidade, mesmo se uma moeda for configurada depois. `settleOffChain` registra pagamento externo referenciado; não executa transferência bancária.

### P17. Como funciona a recuperação de carteira?

1. Administração verifica o caso e anuncia origem, destino e referência.
2. Destino deve ser apropriado, vazio e da mesma pessoa; não pode ser tesouraria, administrador ou administrador pendente, nem contrato incompatível.
3. Aguarda sete dias. A origem e o destino têm restrições durante o processo.
4. Owner executa após o prazo; a carteira antiga é revogada e os direitos pertinentes são preservados.
5. O pedido pode ser cancelado pelo owner ou pela origem, inclusive durante pausa.

A execução respeita `ownershipEpoch`: trocar o administrador invalida anúncios anteriores; trazer o administrador antigo de volta não ressuscita o pedido. Isso não é multisig nem substitui análise civil. Recuperação pode ser necessária após expiração ou sem saldo de IBT, se há royalties pendentes.

### P18. O que a pausa bloqueia?

É global para operações importantes: compra, reporte, saque e execução de recuperação, conforme os modificadores. Cancelar recuperação continua possível. Não há pausa seletiva implementada por área de negócio. A pausa ajuda a conter incidentes, mas também permite interromper recebimentos; é poder administrativo a explicar.

### P19. `Ownable2Step` é multisig?

Não. Um proprietário propõe outro e o destinatário aceita. Não exige duas assinaturas para cada operação. A renúncia à administração foi desabilitada. Governança com múltiplos aprovadores é uma integração/desenho futuro, não consequência automática dessa biblioteca.

### P20. Qual a diferença entre saldo de IBT e cotas disponíveis?

Saldo é quantidade de tokens. Cota é direito operacional de hospedagem que pode estar livre, reservado, utilizado ou aguardando devolução. Quem tem 3 IBT e já usou uma experiência não deve ganhar três novas experiências só por trocar de carteira.

O banco registra pessoas, carteiras, movimentos, hospedagens e alocações. A reemissão preserva o histórico. Uma consulta apenas a `balanceOf` é insuficiente para saber o que ainda pode ser reservado.

### P21. Como evitar duas reservas gastando a mesma cota?

Transação SQLite `BEGIN IMMEDIATE`, validações e débito/alocação feitos juntos. Chave de idempotência é única por pessoa; a mesma chave com mesmos dados devolve o pedido existente, mas com conteúdo diferente dá conflito. Isso evita duplicação por clique repetido ou retry. Confirmar uma reserva não debita a mesma cota novamente.

O banco usa WAL, chaves estrangeiras, restrições e SQL parametrizado. Essas medidas têm papéis distintos: integridade transacional, referências consistentes e prevenção de injeção por concatenação indevida.

### P22. Como funcionam cancelamento e devolução?

O titular solicita; atendimento/supervisão decide devolver, reter ou negar, com motivo registrado. A solicitação não devolve automaticamente a cota. Se aprovada a devolução, a conciliação libera uma única vez após aplicar movimentos relevantes, evitando duplicação em corrida com a sincronização.

A política permanece manual e provisória. Não existe regra atual de meia cota automática nem garantia geral de cancelamento automático acima de 30 dias. As três noites são validadas pela rota do portal; quantidade de hóspedes e inventário real do hotel não estão integrados de modo completo.

### P23. Como o backend sabe qual estado da blockchain usar?

Confere rede, endereço, bytecode presente e parâmetros esperados; lê eventos por intervalos de blocos e os ordena. Na Sepolia usa bloco finalizado; no Anvil, latest. Registra número e hash do bloco, deduplica eventos por rede/transação/índice e verifica se o bloco continua canônico.

Rede errada, histórico sem emissão, reorganização, atraso excessivo de rede ou contrato incompatível bloqueiam ações inseguras. Ele não apaga silenciosamente o histórico de hospedagens para “reconstruir tudo”. Antes de uma ação crítica, verifica diferenças recentes relevantes e pode responder que é preciso aguardar finalização.

### P24. O que acontece se eu perder o SQLite?

Os saldos/eventos on-chain podem ser consultados novamente, mas CPF, vínculos, aprovações e consumo de hospedagens não estão todos na rede. A blockchain não recupera o histórico completo. Produção exige backup, restauração testada e proteção do segredo de identidade. Alterar rede, contrato ou segredo sem migração pode invalidar a compatibilidade do banco.

### P25. Como é feita autenticação e qual a diferença entre login e assinatura?

Login do portal usa e-mail e senha, com scrypt, salt aleatório, comparação resistente a diferenças de tempo e sessão cujo token é guardado como hash. A carteira aparece no fluxo de vínculo/compra, não como condição de entrar e reservar.

O desafio assinado inclui origem, rede, nonce, emissão, validade e identificador, expira em cinco minutos e só pode ser usado uma vez. A assinatura confirma controle da chave correspondente; não é KYC. A sessão e o desafio são mecanismos distintos.

### P26. O CPF está apenas hasheado?

Não simplifique assim. O HMAC do CPF normalizado serve para deduplicação; o portal também guarda a identidade recuperável cifrada com AES-256-GCM para funções autorizadas. O identificador on-chain deriva de UUID separado. CPF legível fica restrito a cadastro/supervisão. Proteger o segredo, o banco e seus backups é indispensável; criptografia não elimina responsabilidade sobre dados pessoais.

### P27. Como os papéis são autorizados?

Member, cadastro, financeiro, atendimento e supervisão. Permissões são conferidas no backend, não só escondendo botões. Cadastro/supervisão revisam candidatura; financeiro trabalha compras; atendimento trabalha hospedagem; member acessa sua própria pessoa. O financeiro não tem acesso à fila cadastral nem ao CPF.

A quantidade de interesse pode mudar após aprovação quando não há pedido em andamento. Interesse não é reserva de estoque nem cobrança. A versão do registro evita sobrescrever mudanças concorrentes; pedidos preparados preservam seus termos.

### P28. Por que não confiar no hash de transação informado pelo usuário?

Um hash pode apontar para outra compra. `purchase.ts` confere rede, origem, destino, dados da chamada, valor nativo, status e eventos de compra/pagamento com quantidade e referência esperadas. Também verifica inclusão/finalização e hash do bloco. “Existe uma transação” não significa “este pedido foi pago”.

### P29. O que diferencia as três custódias?

Na IBITI, o desenho prevê que o usuário delegue a operação de carteira à instituição, exigindo estrutura própria. Na assistida, a pessoa conserva a autocustódia com orientação. Na direta, opera sua própria carteira autonomamente. O adaptador sem extensão da demonstração só existe no Anvil local; não há custodiante comercial implementado no servidor normal.

### P30. Quais controles HTTP e frontend vale citar?

Validação de origem, JSON e tamanho do corpo; limites de tentativas; cookies/sessões conforme a rota; política de conteúdo; acesso a arquivos por lista permitida; erros que não expõem URL ou chave de RPC. O frontend trata estados e mensagens, mas toda regra crítica precisa de validação no servidor/contrato.

**Limite:** rate limit em memória e servidor local não representam uma infraestrutura distribuída de produção. Teste de layout ou esconder opção não comprova autorização correta.

### P31. O que são `view`, `pure`, `external`, `internal`, `private` e modifier?

`view` consulta sem alterar estado; `pure` não depende do estado do contrato; `external` compõe interface de chamadas externas; `internal` permite uso interno/herança; `private` restringe acesso direto ao contrato que define a função. Modificadores inserem condições como `onlyOwner`, `whenNotPaused` e `nonReentrant`.

`private` não torna dados secretos na blockchain. `view` chamado via RPC normalmente não paga gas pelo usuário; se invocado dentro de uma transação, sua execução consome gas dessa transação.

### P32. ABI, bytecode, evento e hash: como distinguir?

ABI descreve como codificar chamadas e interpretar retornos/eventos. Bytecode é o programa executado na EVM. Eventos geram logs consultados por exploradores e pelo indexador; não são, por si só, banco de dados de toda a operação. Hash identifica/integraliza um conteúdo ou transação conforme seu uso; não comprova a verdade econômica desse conteúdo.

### P33. Onde está o risco de laços e custo de gas?

Apuração percorre titulares e períodos. O supply de 150 unidades inteiras limita titulares com saldo, e o calendário tem oito períodos. Mesmo limitado, é preciso medir custo no caso extremo. Há regressão de reporte atrasado com 150 titulares abaixo de 2^24 gas por transação no ambiente testado. Não extrapolar isso para emissão de milhões de tokens nem para qualquer rede/limite de bloco.

### P34. Quais testes você mostraria primeiro?

| Regra | Caso que demonstra compreensão |
|---|---|
| Teto por pessoa | 20 em duas carteiras passa; mais 1 reverte. |
| Compra atômica | Falta de allowance/saldo não entrega tokens. |
| Sem mercado secundário | Transferência e transferFrom falham mesmo com aprovação. |
| Calendário | Reporte antes do fechamento falha; 29 de fevereiro preserva aniversários. |
| Royalty temporal | Mesmos 2 IBT, compra no início versus metade, parcelas 300 e 150. |
| Reserva e owner | Mudar owner não desloca estoque/tesouraria. |
| Recuperação | Antes de sete dias falha; destino de outra pessoa falha; execução preserva supply e direitos. |
| Saque | Segundo claim não duplica pagamento. |
| Cotas | Repetir requisição não cria reserva extra; troca de carteira não renova consumo. |
| Segurança da API | Outro papel/pessoa não acessa a operação protegida. |
| Sincronização | Rede errada, reorg e histórico incompleto bloqueiam uso. |

Os 31 testes do anexo são uma regressão específica de feedback e royalty temporal, não toda a suíte do projeto. Os “60 casos” do relatório de setembro 11 pertencem à versão histórica e a outra contagem. Nesta preparação analisei arquivos e resultados registrados; não fiz um novo deploy nem reexecutei toda a suíte.

### P35. Quais arquivos abrir se o professor pedir “mostre no código”?

| Pergunta | Arquivo / ponto de entrada na implementação da Sprint 4 |
|---|---|
| Abertura, cadastro, preço e compra | `smart-contract/contracts/IBIToken.sol`: `recordOpening`, `registerWallet`, `buyPrimary`. |
| Royalty e saque | Mesmo contrato: `reportRevenue`, `_registerRoyalty`, `claimRoyalty`, `tokenSecondsOf`, `_accrue`. |
| Recuperação e poderes | Mesmo contrato: `requestRecovery`, `cancelRecovery`, `reissue`, `_transferOwnership`. |
| Transferências | Mesmo contrato: `_update`, `_enforceTransferRules`. |
| Semestres civis | `smart-contract/contracts/OpeningCalendar.sol`. |
| Pessoa, cota e transação SQLite | `offchain/src/ledger.ts`. |
| Autenticação por assinatura | `offchain/src/auth.ts`. |
| Estado da rede | `offchain/src/chain.ts`. |
| Verificação de pagamento | `offchain/src/purchase.ts`. |
| Cadastro, papéis e cancelamento | `offchain/src/portal.ts` e `portal-api.ts`. |
| HTTP, limites e configuração | `offchain/src/api.ts`, `runtime.ts`, `server.ts`. |
| Interface progressiva | `offchain/public/portal.js`, `portal.html`, `portal.css`. |
| Custódia de demonstração | `offchain/src/custody.ts` e `scripts/local-custody.ts`. |
| Compilação/reprodução | `smart-contract/tools/compile.ts`, `tools/local-chain.ts`, scripts e `package-lock.json`. |

Dependências OpenZeppelin estão versionadas em `vendor`: ERC20, Ownable2Step, Pausable, ReentrancyGuard e SafeERC20 são os componentes centrais. Não são produtos independentes que precisam de um deploy cada. `MockStablecoin` é contrato de teste separado; fixtures em `tests/helpers` não são contratos de operação comercial.

## 13. Deploy e Evidências Operacionais On-Chain — Sprint 4

Fontes: relatório em português de 12 páginas, quatro anexos embutidos e dois vídeos. Prioridade crítica para os dois professores.

### D1. O que o artefato prova?

Publicação e verificação de código na Sepolia; execução de um ciclo operacional em ambiente local Anvil; e uma rodada separada de 31 testes de regressão. São evidências complementares, em ambientes distintos. Não prova hotel funcionando, receita real, KYC civil, custódia institucional ou toda a operação executada na Sepolia.

### D2. Qual é a implantação da entrega atual?

| Campo | Evidência registrada |
|---|---|
| Rede | Ethereum Sepolia, chain ID 11155111 |
| IBIToken | `0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520` |
| Bloco | 11783256 |
| Data registrada | 26/09/2026, 02:22:36 UTC |
| Transação | `0x132a696441b2a2feae4e2ea4b233c90e2f4534afaff84c9d7064a8d84ac0ec4f` |
| Administrador / tesouraria inicial | `0x549852CA58C2e843e29428a81Ab97D2d613BB749` |
| tBRL de teste | `0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE` |
| Status do recibo | 1, execução bem-sucedida |
| Gas usado | 3.906.647 |
| Custo registrado | 0,010111730168582655 ETH de teste |

São dados da evidência coletada, não uma nova consulta ao estado corrente da rede. O endereço histórico `0xaA6C...c030`, presente no README raiz e no whitepaper da Sprint 3, é outra instância. Não decorar o hash inteiro: saber localizar rede, endereço, recibo e fonte basta.

### D3. O que significa código verificado no Sourcify?

Que a fonte e a configuração compiladas correspondem ao bytecode da instância verificada. O relatório registra correspondência exata de criação e execução. Isso torna possível inspecionar o código correto; não prova ausência de bugs, correção jurídica ou segurança econômica.

Reprodução requer versão do compilador, fontes/dependências, configurações e argumentos. A referência é Solidity 0.8.34, EVM Osaka, otimizador 200, viaIR e OpenZeppelin 5.6.1. Compilar “uma versão parecida” pode produzir bytecode diferente.

### D4. Como explicar gas e status?

Gas mede trabalho computacional; preço por gas transforma esse consumo em taxa paga na moeda nativa. A taxa do exemplo resulta de gas usado × preço efetivo. Sepolia ETH não é pagamento da compra de IBT nem captação comercial. Recibo status 1 prova sucesso daquela transação; não prova que o requisito de negócio inteiro esteja satisfeito.

### D5. O que foi demonstrado no Anvil?

O ensaio local usa chain ID 31337, pessoas e moeda fictícias. Registra abertura simulada em 15/03/2027; cadastra participantes; cada um compra 2 IBT por 69.748,28 tBRL; o primeiro no começo e o segundo na metade do semestre. Depois do encerramento, informa receita fictícia de 150.000 e financia 22.500 de royalty. Os titulares retiram 300 e 150.

Ao fim: tesouraria com 146 IBT; participantes com 2 cada; total 150. O saldo de 22.050 tBRL ainda no contrato corresponde ao direito da tesouraria não sacado, não a uma sobra misteriosa. A tesouraria ficou com 116.996,56 tBRL após receber as compras e financiar o reporte.

O semestre simulado dura 15.897.600 segundos. Pesos dos titulares: 31.795.200 e 15.897.600 token-segundos. Esse é o melhor exemplo para explicar a diferença entre saldo final e participação temporal.

### D6. Quais falhas foram mostradas e por que não têm hash?

Compra sem cadastro: `WalletNotRegistered`; transferência secundária: `SecondaryTransfersDisabled`; apuração antes de fechar: `PeriodNotClosed`; recuperação antes do prazo: `RecoveryNotReady`.

Esses casos aparecem como simulações `eth_call`/`staticCall` rejeitadas. Não foram transações mineradas, portanto não possuem recibo nem gas efetivamente pago. Uma transação realmente enviada que reverte pode consumir gas. Não inventar hash para preencher tabela de evidência negativa.

### D7. O vídeo prova recuperação concluída após sete dias?

O ciclo mostrado anuncia, tenta antecipar e cancela. A execução após o prazo é coberta em testes separados. Não dizer que todas as ramificações possíveis foram demonstradas no mesmo vídeo. A espera de sete dias é regra do fluxo de recuperação, não confirmação de que se esperaram sete dias reais na gravação local.

### D8. Para que servem os quatro anexos do PDF?

`anvil-records.json`: etapas, transações locais, erros simulados, eventos e saldos. `sepolia-deployment-receipt.json`: recibo da publicação pública. `regression-tests.tap`: resultados individuais dos 31 testes. `evidence-manifest.json`: hashes de anexos e fontes para conferir integridade.

Um SHA-256 permite detectar mudança de arquivo, mas não atesta sozinho que os dados foram coletados corretamente. A força da evidência vem de combinar fonte, rede, recibo, resultados e contexto.

### D9. O que o vídeo off-chain acrescenta?

Demonstra jornada do portal: simulação de interesse; conta de participante com cotas; pedido de hospedagem e confirmação; solicitação de compra; preparação da carteira de teste; vínculo autorizado; pedido preparado; consentimento do titular; conclusão pelo financeiro; duas cotas disponíveis depois da compra.

A leitura foi feita com quadros representativos e transcrição automática do áudio, confrontados com o código. A narração inclui uma referência a cancelamento acima de 30 dias. Não tratá-la como política automática vigente: o código atual implementa solicitação e decisão manual. O vídeo também não demonstra uma infraestrutura institucional de custódia fora do ambiente local.

### D10. Alterar o GitLab atualiza o contrato publicado?

Não. O contrato não usa proxy. Alterações de fonte precisam de nova implantação e plano explícito para posições e histórico. GitLab, deploy e verificação são três passos diferentes: publicar arquivo, publicar bytecode e comprovar correspondência. Nunca repetir deploy só para “mostrar que funciona” sem identificar a nova instância.

## 14. Divergências que podem virar perguntas difíceis

Este quadro é uma preparação para responder com honestidade, não uma alteração das regras econômicas ou dos documentos.

| Se o professor apontar… | Resposta que evita contradição |
|---|---|
| “Aqui diz que financia a construção.” | Hipótese da Sprint 1; o memorando posterior define captação para o ecossistema, com construção por terceiro. |
| “Aqui diz que pode transferir.” | Regra histórica. A implementação atual bloqueia transferências ordinárias e mercado secundário. Recuperação tem finalidade e controles próprios. |
| “O memorando diz resgate no contrato.” | Trecho desatualizado: cotas e consumo ficam no backend por pessoa. IBT não é marcado como usado. |
| “O royalty é pelo saldo na data de corte?” | Era a modelagem anterior; a entrega atual usa quantidade × tempo no semestre. |
| “O teto é só por carteira?” | Hoje há agregado por identificador de pessoa no contrato; o cadastro civil correto continua externo. |
| “Começa em 2027?” | É horizonte financeiro do modelo e data fictícia em demo. A abertura real não está confirmada. |
| “Então já vende antes da inauguração?” | O contrato atual não permite. Há divergência entre tese de antecipação e regra de compra a resolver. |
| “A reserva é 5%?” | 50 de 150 = 33,33% dos tokens; equivale a 5 pontos da receita bruta no royalty de 15%. |
| “O retorno é 15% ou 20,46% garantido?” | Não. 15% é parcela da receita; 20,46% é taxa de desconto e TIR-base por construção. |
| “A simulação provou só 2,9% de risco?” | Não. É perda nominal em cenários limitados às hipóteses simuladas. |
| “A normal foi truncada?” | O arquivo aplica travas nos valores de uma normal; tecnicamente é corte nas bordas, não reamostragem condicional. |
| “Os resíduos ficam no contrato?” | Só entra a soma das parcelas devidas; o residual de arredondamento fica com o financiador. |
| “Ownable2Step tem dois aprovadores?” | Não. São duas etapas de troca de proprietário, com uma administração única. |
| “As operações estão todas na Sepolia?” | Deploy/verificação na Sepolia; ciclo operacional do vídeo no Anvil. |
| “Cadê o hash da tentativa bloqueada?” | A evidência é eth_call rejeitado, sem mineração. |
| “Os 60 e os 31 testes são a mesma suíte?” | Não. Correspondem a versões/rodadas e escopos diferentes. |
| “Custódia sem extensão está pronta?” | Está demonstrada no adaptador local; operação institucional real não está integrada. |
| “O vídeo fala em 30 dias para cancelar.” | Não corresponde a uma automação vigente; cancelamento é manual e provisório. |
| “Se o risco foi mitigado, por que há divergência?” | A mitigação reduz exposição, não comprova que todos os documentos foram conciliados. |
| “O código garante o impacto ambiental?” | Não. É necessária evidência operacional e socioambiental externa. |

## 15. Simulado final e respostas de emergência

Faça uma rodada sem consulta, com 45–90 segundos por pergunta. Se travar, volte ao bloco indicado; não tente decorar frases que não consegue explicar.

| Pergunta de ensaio | Sua resposta precisa conter |
|---|---|
| 1. Defenda a solução sem usar a palavra blockchain. | Antecipação de royalties, experiência, pertencimento, obrigações e limites. |
| 2. Por que o denominador é 150 e não 100? | Reserva também participa; emissão total; proporção econômica. |
| 3. Calcule receita e royalty do primeiro ano. | 6 × 365 × 35%; hospedagens ÷3; diária + consumo; 15%. |
| 4. Como o WACC afeta o preço? | Maior desconto, menor VP; dívida zero; método escolhido. |
| 5. Explique 51,04% versus 2,9%. | Perda de valor presente versus perda nominal; condicionamento ao modelo. |
| 6. Defenda a probabilidade de A17. | Dados 6/2/2; Laplace; Poisson; faixa ordinal; amostra pequena. |
| 7. Dê um plano completo para A3. | Causa, efeito, responsável, prevenção, gatilho, contingência e evidência. |
| 8. Explique uma divergência entre documentos sem escondê-la. | Versão histórica, implementação atual e o que precisa de conciliação. |
| 9. Por que dois compradores com dois tokens recebem diferente? | Token-segundos; 300 versus 150 no exemplo. |
| 10. O que acontece se o pagamento falha depois de entregar IBT? | Atomicidade e reversão de todo o estado da transação. |
| 11. Por que não basta balanceOf para reservar hotel? | Cotas consumidas/reservadas, pessoa e histórico no banco. |
| 12. O que você mostraria para provar o deploy? | Rede, endereço, recibo, status, fonte verificada e limites. |
| 13. O que ainda depende de confiança? | Identidade, receita, administrador, banco, hotel e instrumentos jurídicos. |
| 14. Como recupera uma carteira sem criar uma venda disfarçada? | Mesma pessoa, destino validado, sete dias, cancelamento e revogação. |
| 15. O que falta antes de operar comercialmente? | Validação de demanda, documentos, custódia, governança, pagamentos, hotel, segurança e continuidade. |

**Quando não souber uma informação:** “Não tenho essa evidência fechada. O que o artefato demonstra é X; Y permanece como premissa/pendência.”

**Quando houver um trecho antigo:** “Esse documento registra a versão anterior. Na instância da entrega atual, a regra é X, demonstrada por Y. O trecho precisa ser conciliado.”

**Quando pedirem sua contribuição individual:** descreva a decisão ou tarefa que realmente executou, um problema enfrentado, a evidência e a revisão recebida. As responsabilidades formais do relatório não autorizam atribuir a si trabalho de outra pessoa.

## 16. Fontes e alcance da cobertura

O pacote do GitLab contém **233 arquivos**. A leitura documental incluiu os **13 PDFs, somando 224 páginas**, os documentos Markdown dos artefatos, **cinco abas da planilha**, imagens de UX e risco, documentação técnica das duas implementações e anexos de evidência. Os dois vídeos foram analisados por quadros representativos; o vídeo narrado também teve transcrição automática, portanto não se usa a transcrição isoladamente para afirmar um comportamento.

Na implementação atual, os 102 arquivos listados no manifesto remoto coincidem por hash com o espelho local; o manifesto em si completa 103 arquivos nessa pasta. A implementação histórica tem 91 arquivos no pacote, também correspondentes ao espelho. Bibliotecas de terceiros, lockfiles, configurações, fontes duplicadas de deploy e recursos visuais foram classificados pelo papel técnico; não são 233 textos independentes para decorar, nem esta análise equivale a auditoria linha a linha de todas as dependências.

A reprodução da simulação verifica as 5.000 linhas de valor presente e os sorteios com a semente declarada. Não é auditoria financeira, calibração estatística com dados do hotel ou novo cálculo tributário. Resultados dos testes de software são os registros examinados, não nova execução nesta preparação.

O arquivo `cobertura-arquivos.csv`, entregue ao lado deste guia, lista todos os arquivos com tamanho, hash, URL da revisão e tratamento na análise. `verificacao-financeira.json` preserva os resultados da reprodução numérica. Não foi modificado qualquer PDF original, regra do contrato, condição econômica ou publicação do GitLab.

### Fontes por artefato

- [Sprint 1/Business Diagnosis and Discovery](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%201/Business%20Diagnosis%20and%20Discovery).
- [Sprint 1/Entendimento da Experiência do Usuário](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%201/Entendimento%20da%20Experi%C3%AAncia%20do%20Usu%C3%A1rio).
- [Sprint 1/Gestão de Projeto](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%201/Gest%C3%A3o%20de%20Projeto).
- [Sprint 2/Gestão de Projeto](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%202/Gest%C3%A3o%20de%20Projeto).
- [Sprint 2/Riscos éticos e impacto](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%202/Riscos%20%C3%A9ticos%20e%20impacto).
- [Sprint 2/Whitepaper Técnico do Ativo Digital](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%202/Whitepaper%20T%C3%A9cnico%20do%20Ativo%20Digital).
- [Sprint 3/Estrutura Jurídica](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Estrutura%20Jur%C3%ADdica).
- [Sprint 3/Gestão de Projeto](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Gest%C3%A3o%20de%20Projeto).
- [Sprint 3/Guia de Comunicação](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Guia%20de%20Comunica%C3%A7%C3%A3o).
- [Sprint 3/Implementação do Contrato Inteligente ERC-20 - versão 1](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Implementa%C3%A7%C3%A3o%20do%20Contrato%20Inteligente%20ERC-20%20-%20vers%C3%A3o%201).
- [Sprint 3/Memorando de oferta - versão 1](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Memorando%20de%20oferta%20-%20vers%C3%A3o%201).
- [Sprint 3/Whitepaper Técnico do Ativo Digital](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%203/Whitepaper%20T%C3%A9cnico%20do%20Ativo%20Digital).
- [Sprint 4/Deploy e Evidências Operacionais On-Chain](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%204/Deploy%20e%20Evid%C3%AAncias%20Operacionais%20On-Chain).
- [Sprint 4/Gestão de Projeto](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%204/Gest%C3%A3o%20de%20Projeto).
- [Sprint 4/Implementação do Contrato Inteligente ERC-20 - versão 2](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%204/Implementa%C3%A7%C3%A3o%20do%20Contrato%20Inteligente%20ERC-20%20-%20vers%C3%A3o%202).
- [Sprint 4/Memorando de Oferta - versão 2](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/00fde23c8ab118ba5e644fd348a35ee93ba8cb8a/Sprint%204/Memorando%20de%20Oferta%20-%20vers%C3%A3o%202).

Método aplicado: [sprint-analyzer no Claude](https://claude.ai/customize/skills/yours/id/skill_0162Ddk1tWHcJ2MQm3DdXs31/contents), com leitura, priorização conservadora, dependências e estimativa de estudo. A skill foi consultada; este guia é a análise dos artefatos feita nesta tarefa.
