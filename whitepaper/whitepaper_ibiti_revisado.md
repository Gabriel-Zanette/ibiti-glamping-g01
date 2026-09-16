# WHITEPAPER IBITI
## Passaporte, experiências e participação em royalties
### Edição de setembro de 2026 | IBIToken v2

Este whitepaper apresenta a finalidade, os parâmetros econômicos, os direitos associados e o funcionamento tecnológico do IBIToken, no âmbito do projeto acadêmico IBITI Glamping.

O documento abrange a emissão e a circulação de IBT, a distribuição de royalties, o controle de experiências por pessoa, a governança e as responsabilidades operacionais. A implementação de referência é a versão 2, publicada na rede de testes Sepolia.

O modelo descrito não constitui oferta pública, contrato de hospedagem ou comprovação de contratação de prestadores. As condições aplicáveis a uma operação comercial dependem dos respectivos instrumentos. O capítulo 13 delimita o alcance desta edição e os serviços disponíveis.

Os capítulos 1 a 8 apresentam o programa e sua operação; os capítulos 9 e 10 detalham a arquitetura tecnológica; os capítulos 11 a 13 tratam de riscos, transparência e condições de operação. Os apêndices apresentam glossário, memória de cálculo, identificação técnica e referências.

# 1. Sumário executivo

O IBITI Glamping propõe antecipar parte do fluxo econômico de uma operação de hospedagem, oferecendo pertencimento ao ecossistema, acesso a experiências e participação em royalties. O projeto acadêmico organiza uma emissão piloto única de 150 IBT. O token não representa propriedade imobiliária, participação societária ou autorização para abrir uma oferta ao público.

A estrutura econômica pressupõe um empreendedor terceiro responsável pelo investimento no Glamping e o repasse de 15% do faturamento bruto da operação. A antecipação desse fluxo destina-se à IBITI e ao seu ecossistema. A participação em recebíveis depende da cessão e das obrigações estabelecidas nos instrumentos jurídicos da operação.

Cada IBT é uma unidade inteira de um token fungível ERC-20. Das 150 unidades, 50 ficam inicialmente reservadas à administração e 100 estão potencialmente disponíveis à colocação. O limite inicial é de 20 IBT por carteira de participante. O backend também verifica o agregado pessoal das carteiras vinculadas no acesso às cotas, mas o contrato não conhece a identidade civil.

A blockchain registra propriedade, circulação e obrigações de royalties. O backend identifica a pessoa, vincula carteiras e controla cotas e hospedagens. A operação da IBITI confirma disponibilidade, presta a experiência e atesta sua realização. Pedir uma hospedagem não queima, bloqueia nem marca IBT como resgatado no contrato.

A política vigente cria uma cota de experiência por IBT para toda a emissão, sem renovação anual. Transferências movimentam somente cotas livres, até a quantidade de tokens transferida; cotas utilizadas não reaparecem. O saldo de IBT, isoladamente, não informa quantas experiências ainda podem ser pedidas.

Os royalties são calculados sobre receita bruta informada pelo administrador e repartidos pelos saldos na transação de apuração. Com stablecoin configurada, o valor devido é depositado no contrato nessa mesma transação, e cada titular solicita seu recebimento. Não existe pagamento espontâneo a todas as carteiras nem comprovação automática do faturamento real.

A arquitetura prevista para operação comercial utiliza Ethereum Mainnet, IBT no padrão ERC-20 e BRZ para liquidação. A implantação de referência opera na Sepolia e utiliza tBRL, moeda de teste sem lastro financeiro. A infraestrutura financeira prevista e seu estágio de integração são descritos no capítulo 10.

Cada cota corresponde a 3 noites de hospedagem para até 5 pessoas, com os serviços comuns do local escolhido e confirmação de disponibilidade. O cancelamento elegível devolve a mesma cota após conciliação, sem ampliar a quantidade de direitos ou a vigência do programa.

# 2. Finalidade e contexto do programa

A IBITI atua no território de Conceição do Ibitipoca, em Minas Gerais, combinando conservação, regeneração e hospitalidade. O programa IBITI Glamping associa esse contexto a uma participação econômica e a experiências de hospedagem. Os direitos de IBT limitam-se ao programa descrito neste documento; serviços de outras operações da IBITI não integram automaticamente seus benefícios.

O programa tem por finalidade antecipar recursos associados a royalties futuros, com rastreabilidade das posições e dos pagamentos. Seu funcionamento contempla a interação direta por carteira digital e o atendimento para orientação dos participantes. A tecnologia registra direitos e operações; a prestação da experiência permanece sob responsabilidade da hospitalidade.

A tokenização não resolve inventário hoteleiro, execução da hospedagem, apuração contábil ou cumprimento de contratos. Ela registra e executa regras delimitadas. O serviço também depende de atendimento, identificação, proteção de dados e prestação de contas.

Trabalhadores, fornecedores e moradores podem se beneficiar indiretamente da atividade econômica e dos programas do território. Não está prevista distribuição automática de tokens a esses grupos. Tampouco se atribui ao token um impacto ambiental já mensurado.

# 3. Visão geral da solução

## 3.1 Direitos e controles distintos

| Dimensão | O que representa | Controle |
| --- | --- | --- |
| Propriedade de IBT | Saldo transferível em unidades inteiras | Contrato ERC-20 |
| Membership | Condição de participante vinculada à posse e à vigência | Contrato e identificação no serviço |
| Cota de experiência | Capacidade disponível para solicitar hospedagem nas condições do programa | Livro de cotas por pessoa e carteiras vinculadas |
| Royalties | Valor econômico apurado por período | Receita informada, rateio e obrigações no contrato |

Cota não é outro token, NFT, voucher negociável ou identificador individual de IBT. Identificadores de pessoas, pedidos e eventos organizam o banco; não individualizam unidades fungíveis na blockchain.

## 3.2 Separação entre token e experiência

O IBT mantém um saldo único e fungível na blockchain. O contrato não distingue unidades utilizadas ou não utilizadas em hospedagens. O atendimento é organizado por pessoa verificada, com associação às carteiras sob seu controle e registro das cotas disponíveis, reservadas e consumidas.

A transferência altera o saldo de IBT e movimenta, no livro de cotas, somente direitos livres até a quantidade transferida. O consumo de uma experiência afeta esse livro, sem reduzir o saldo do token ou sua participação em royalties futuros.

A identidade civil e os dados das hospedagens permanecem fora da blockchain. Os registros públicos permitem verificar posições, circulação, apuração e pagamento de royalties; o histórico de experiências depende do sistema do programa.

## 3.3 Arquitetura funcional

~~~architecture
Pessoa e carteira
    | assinatura de autenticação / pedido de hospedagem
    v
Aplicação e API --> Livro de pessoas, cotas e pedidos
    |                       |
    | consulta              | confirmação e execução
    v                       v
Ethereum / IBIToken     Operação de hospitalidade
    ^
    | depósito de stablecoin e apuração
Administrador <--> Conversão BRL / BRZ por prestador
~~~

O prestador conecta reais e ativos digitais. Não substitui o contrato na distribuição proporcional nem o operador na comprovação da receita. O serviço de hospedagens consulta a blockchain e mantém o histórico de uso que ela não registra.

# 4. Emissão e modelo econômico

## 4.1 Emissão e circulação

| Parâmetro | Definição | Aplicação |
| --- | --- | --- |
| Nome e símbolo | IBIToken / IBT | Token fungível ERC-20 |
| Quantidade | 150 IBT | Emissão integral no construtor |
| Casas decimais | 0 | Sem frações |
| Reserva inicial | 50 IBT | Um terço da emissão |
| Estoque para colocação | 100 IBT | Dois terços da emissão |
| Limite de participante | 20 IBT | Carteira no contrato; agregado pessoal no uso de cotas |
| Participação na receita | 15% do faturamento bruto | Não é rentabilidade anual de 15% |
| Distribuições | 8 períodos semestrais | Código limita quantidade, não intervalo |
| Horizonte econômico | 2027 a 2030 | Calendário econômico; vigência de teste identificada no Apêndice C |
| Emissão adicional | Não prevista nesta emissão | Sem função pública de criação de novos IBT |

A compra primária transfere unidades do estoque administrativo; não emite novos tokens. A reserva e o estoque não vendido participam do rateio enquanto tiverem saldo. Não se presume renúncia aos royalties da administração ou redistribuição de sua parcela aos compradores.

O administrador pode reduzir a reserva, liberando estoque. Isso não aumenta a oferta total. A liberação deve seguir a política de divulgação e os instrumentos da oferta.

A oferta de 150 IBT é fixada na implantação. O serviço de cotas verifica esse parâmetro ao reconhecer o contrato. O código não dispõe de função pública de emissão adicional; a recuperação de carteira conserva a oferta por operações compensatórias.

## 4.2 Receita e participação

Se G é a receita bruta elegível informada na menor unidade da stablecoin (ou em centavos de real nos períodos de liquidação externa), o royalty é R = piso(G × 1.500 / 10.000). Para um titular com b IBT, a parcela é r = piso(R × b / 150).

O contrato usa o saldo quando a transação de apuração é executada. Não recompõe saldos de uma data contábil anterior. Uma transferência antes da apuração muda quem participa; uma transferência depois não leva os valores já atribuídos à carteira anterior. Recuperações administrativas têm tratamento próprio.

O consumo de hospedagem não reduz o saldo de IBT usado no rateio nem amplia o direito econômico. A pessoa pode ter usado todas as cotas e continuar titular de tokens e royalties.

## 4.3 Projeção econômica

A projeção financeira desta edição utiliza o arquivo Modelo Glamping.xlsx, abas “Valor do token”, “Wacc” e “Sensibilidade”. O cenário-base considera 6 unidades operacionais em 2027 e 20 nos três anos seguintes, com ocupação de 35%, 20%, 25% e 30%, respectivamente. A diária inicial é de R$ 7.333,00, com crescimento de 10% ao ano; o consumo por hospedagem parte de R$ 2.000,00 e cresce 4,5% ao ano. O modelo adota 365 dias por ano e estadia média de 3 noites.

| Ano | Unidades operacionais | Faturamento bruto | Royalties de 15% |
| --- | --- | --- | --- |
| 2027 | 6 | R$ 6.131.744,50 | R$ 919.761,67 |
| 2028 | 20 | R$ 12.793.931,33 | R$ 1.919.089,70 |
| 2029 | 20 | R$ 17.521.727,67 | R$ 2.628.259,15 |
| 2030 | 20 | R$ 23.040.990,91 | R$ 3.456.148,64 |
| Total | - | R$ 59.488.394,41 | R$ 8.923.259,16 |

O faturamento bruto corresponde à soma das receitas de hospedagem e consumo da planilha. São projeções de receita, não valores já realizados ou distribuídos. Os insumos, fluxos e sensibilidades estão detalhados no Apêndice B.

Os **R$ 8.923.259,16** da tabela são os royalties projetados para **todos os 150 IBT**. Para **1 IBT**, mantido nas datas de apuração, a conta é: **R$ 8.923.259,16 ÷ 150 = aproximadamente R$ 59.488,39**, somados ao longo de **2027 a 2030**. É o recebimento projetado por token nos quatro anos, não por ano nem o preço de aquisição. Todos os valores estão expressos em reais, sem escala de milhares. Cada IBT corresponde a 0,1% do faturamento bruto elegível: 15% ÷ 150.

“Nominal” significa somar os recebimentos futuros sem descontá-los pelo tempo de espera. Já a referência de **R$ 37.055,19 por IBT**, explicada a seguir, traz esses fluxos a valor presente pela taxa de desconto. As projeções são anteriores a tributos e custos e não garantem recebimento, devolução do principal ou preço de revenda.

## 4.4 Referência de valor e taxa de desconto

A planilha calcula o valor presente dos royalties com taxa de desconto de **17,8609% ao ano**, no cenário de 100% de capital próprio e nenhuma dívida. O valor presente total é de **R$ 5.558.278,01**, correspondente à referência de **R$ 37.055,19 por IBT**. Para as 100 unidades destinadas à colocação, o modelo apresenta **R$ 3.705.518,67**. O valor dos 150 IBT inclui as 50 unidades de reserva e não equivale à captação pela venda de 100 unidades.

O cálculo desconta cada fluxo no fim do respectivo ano, de 2027 a 2030, com base em 2026. O programa mantém oito apurações semestrais, mas a planilha não modela a distribuição dos recebimentos entre os semestres. Portanto, a referência de valor reproduz o calendário anual da avaliação; não se apresenta uma TIR semestral calculada a partir de datas não especificadas.

A alíquota de 15% incide sobre o faturamento bruto. Ela não corresponde a rendimento anual de 15%. A taxa de desconto de 17,8609% é uma premissa de avaliação, não uma remuneração prometida. O preço efetivo, a forma de pagamento e as condições de aquisição pertencem ao memorando da oferta e aos instrumentos aplicáveis.

Os valores da planilha são preservados, com apresentação monetária arredondada a centavos neste documento. O cálculo de 100 unidades utiliza o valor por token com a precisão integral da planilha; por isso, pode diferir em centavos da multiplicação do preço unitário exibido. Tributos, gas, custos de conversão, inadimplência e receita efetivamente realizada podem alterar o resultado do participante.

# 5. Passaporte, membership e experiências

## 5.1 A pessoa como unidade de atendimento

A pessoa deve ser aprovada no processo de identificação e comprovar o controle das carteiras vinculadas. Uma carteira pertence a um cadastro de pessoa. Uma pessoa pode vincular várias carteiras, cujos saldos são agregados. A troca de carteira preserva a identidade e o histórico de experiências utilizadas.

A assinatura comprova controle da chave naquele momento; não comprova identidade civil ou aprovação cadastral. A validação de CPF no serviço de referência detecta inconsistências formais, e sua representação no banco usa HMAC. A aprovação depende de verificação externa.

A jornada primária especificada exige identificação e vínculo antes da liberação dos tokens. O administrador controla essa liberação, mas o contrato não obriga tecnicamente o procedimento. Para hospedagens, o backend exige cadastro aprovado e carteira vinculada.

## 5.2 Membership não é saldo de experiências

No contrato, membership considera saldo positivo, carteira não revogada e prazo não encerrado. Não verifica identidade civil, pausa ou início da janela de uso. O aplicativo combina esse estado com os critérios de elegibilidade do programa.

No serviço, membership também depende da pessoa aprovada e das carteiras ativas. Pedir experiências exige janela válida, ausência de pausa, limite pessoal e cotas disponíveis. Manter membership não renova cotas.

## 5.3 Concessão e circulação de cotas

A emissão origina 150 cotas potenciais, uma por IBT para toda a vigência, sem reposição anual. Cotas do estoque administrativo não são utilizáveis pela administração no fluxo de hóspedes; passam a atender participantes conforme a circulação e o regulamento.

Ao transferir n IBT, seguem até n cotas livres da carteira de origem. A quantidade é o menor valor entre n e o saldo livre da origem. Cotas reservadas para pedidos e experiências concluídas não são recriadas.

Exemplo: a origem tem 5 IBT e 1 cota livre. Ao transferir 2 IBT, transfere 1 cota. O destinatário recebe 2 IBT e somente 1 cota nova. Nenhum IBT individual é rotulado como usado ou livre.

A fungibilidade permanece, mas o benefício depende do histórico do programa. Uma revenda deve informar separadamente IBT e cotas que poderão acompanhar a transferência. O ERC-20 não fornece essa informação nem uma liquidação atômica de preço, tokens e cotas.

As cotas são agregadas no atendimento da pessoa, sem unidades fictícias de token. Usos concluídos continuam no histórico pessoal. A circulação não serve para zerá-lo.

## 5.4 Disponibilidade

Considere B como saldo elegível de IBT; F como cotas livres; R como cotas comprometidas em pedidos solicitados ou confirmados; U como cotas utilizadas; e D como devoluções de cancelamentos pendentes de conciliação.

Para pessoa elegível, A = máximo(0, mínimo(F, B - R)) é a quantidade disponível. Fora das condições de elegibilidade, A = 0.

Não basta subtrair hospedagens usadas do saldo. Transferências, reservas e devoluções também importam. Uma devolução pode deixar mais cotas livres que tokens; B - R impede seu uso sem saldo suficiente.

Pedidos não bloqueiam IBT on-chain. Se a pessoa transferir tokens necessários à reserva, o serviço impede avançar sua confirmação ou conclusão até reconciliar o saldo. A reserva não cria bloqueio financeiro no contrato.

## 5.5 Conteúdo da experiência

Cada cota corresponde a uma hospedagem de **3 noites consecutivas para até 5 pessoas no total**, incluindo dependentes na contagem, sujeita à confirmação de disponibilidade. A acomodação é a hospedagem oferecida no local escolhido, com seus serviços comuns. Não há promessa de categoria premium ou upgrade; alimentação especial, transporte, passeios e outros extras não são presumidos como incluídos.

A solicitação é registrada no sistema do programa e submetida à confirmação da operação responsável. A existência de cota disponível não equivale à confirmação de uma acomodação ou data.

O cancelamento elegível desfaz a reserva e devolve a mesma cota após conciliação, permitindo outro pedido dentro da vigência. Não concede cota adicional nem prorroga o token. Esta edição não estabelece prazo de antecedência ou penalidade por cancelamento tardio e ausência; essas condições dependem do regulamento de hospedagem aplicável.

A confirmação de serviços, horários de entrada e saída e condições da acomodação integra o atendimento da hospedagem. Marcas parceiras, upgrades, prioridade irrestrita e experiências de outras operações não compõem os benefícios descritos.


# 6. Estrutura tokenizada de royalties

## 6.1 Da receita ao recebimento

O operador apura e documenta o faturamento bruto elegível. A administração confere a base, produz uma referência de evidência e informa a receita ao contrato. A entrada corresponde ao faturamento bruto; a alíquota de 15% é aplicada pelo próprio código.

Com stablecoin configurada, a administração obtém o ativo e autoriza o contrato a movimentá-lo. Ao registrar a receita, o contrato calcula as parcelas e transfere da administração o total devido. Saldo ou autorização insuficientes revertem toda a operação, sem período parcialmente financiado.

O titular solicita o saque do valor atribuído. A obrigação é baixada antes da transferência, com proteção contra reentrância. Repetir o saque não produz novo pagamento.

A pausa administrativa também impede novos saques, apurações e quitações externas enquanto estiver ativa, sem apagar os valores devidos. Não existe execução automática por data. O administrador inicia a apuração; o titular inicia o saque. Automação ou patrocínio de gas seriam integrações adicionais.

## 6.2 Rateio e arredondamento

O rateio inclui todos os saldos positivos, inclusive reserva e estoque administrativo. O denominador é a oferta total, não apenas tokens vendidos.

Os cálculos são inteiros. A soma das parcelas pode ser menor que os 15% por arredondamento para baixo. Apenas o total atribuído é depositado; a diferença permanece com o financiador. A prestação de contas deve mostrar receita, royalty calculado, total atribuído e diferença.

O contrato registra obrigações, pagamentos e agregados do período. Os eventos e recibos permitem reconciliar os valores; o registro não contém uma tabela completa de saldos históricos de cada titular.

## 6.3 IBT, BRZ, tBRL e gas

| Unidade | Função | Ambiente |
| --- | --- | --- |
| IBT | Participação no programa e base de rateio | Contrato do projeto |
| BRZ | Ativo referenciado ao real proposto para liquidação | Produção, sujeita à integração |
| tBRL | Moeda fictícia para testar depósito e saque | Testes locais e Sepolia |
| ETH | Custo de execução da rede | Real na Mainnet; de teste na Sepolia |

A tBRL é independente do IBT: seu saldo serve exclusivamente aos testes de depósito e saque. Criar unidades dessa moeda não altera a emissão de 150 IBT ou as cotas de experiência.

O contrato executa o rateio e o pagamento do ativo configurado. A conversão de reais em stablecoin e seu resgate em reais são serviços externos a essa execução, sujeitos às condições do prestador e ao arranjo da operação.

A infraestrutura prevista considera Transfero e BRZ na Ethereum [4]. Sua indicação descreve uma referência de integração e não representa contratação vigente ou serviço já disponível no programa. A emissão de IBT e o cálculo de royalties pertencem à administração e ao contrato do token, respectivamente.

## 6.4 Modalidade e encerramento

Sem stablecoin configurada, um período pode usar liquidação externa. A função administrativa registra referência de pagamento já realizado e baixa a obrigação; não executa PIX ou transferência bancária.

Um endereço de stablecoin não nulo só pode ser configurado uma vez. Depois não pode ser trocado ou removido. A modalidade é por período, sem escolha individual livre entre BRL e stablecoin. Período on-chain não pode ser quitado pela função externa.

O contrato limita a oito períodos, mas não obriga intervalo semestral. O calendário é operacional. A expiração restringe a circulação, sem apagar royalties pendentes ou impedir por si uma última apuração dentro do limite. O encerramento jurídico deve preservar tratamento compatível dos direitos acumulados.

# 7. Modelo operacional e atores

## 7.1 Responsabilidades

| Ator | Responsabilidade | Dependência externa ao código |
| --- | --- | --- |
| Participante | Controlar carteira, autenticar e solicitar serviços | Segurança de chaves e decisões de uso |
| Administrador do token | Estoque, receita, financiamento, pausa e recuperação | Legitimidade e autorização dos atos |
| Cadastro e atendimento | Aprovar identidade e acompanhar pedidos | KYC real e tratamento de exceções |
| Hospitalidade | Confirmar inventário e entregar experiência | Disponibilidade e prova de prestação |
| Prestador financeiro | Serviços contratados de conversão e liquidação | Contrato, onboarding, custos e atendimento |
| Jurídico e responsáveis pela oferta | Direitos e distribuição lícita | Enquadramento e instrumentos concretos |

Na implementação de referência, a API usa uma credencial administrativa única e o contrato possui um proprietário. As responsabilidades descritas não correspondem a perfis técnicos de acesso separados.

## 7.2 Compra primária

A pessoa recebe as condições, é identificada e vincula a carteira por assinatura. A operação confirma pagamento fora do contrato e libera IBT do estoque. A função de compra primária registra referência da venda, sem processar BRL ou validar documentos.

O indexador aguarda finalização da transação, reconstrói o movimento e atribui cotas. A disponibilidade apresentada no aplicativo reflete a posição conciliada.

O administrador também pode usar transferências ERC-20 sujeitas às regras do contrato. A conciliação relaciona as liberações de estoque às suas referências comerciais; a verificação cadastral permanece fora do contrato.

## 7.3 Hospedagem

A pessoa solicita experiência com datas e quantidade. O serviço verifica identidade, vigência, saldo, pausa, limite e atualização da blockchain, reservando cotas numa transação do banco.

A operação confirma disponibilidade real antes de confirmar o pedido. A conclusão registra realização e transforma cotas reservadas em utilizadas, sem novo débito na confirmação ou conclusão.

Cancelar cria devolução pendente. As cotas só ficam livres quando a conciliação cobre o instante do cancelamento, evitando restituição baseada em saldo anterior a uma transferência próxima.

A vigência e a ordem das datas são verificadas pelo serviço. A confirmação de disponibilidade e a atestação de realização pertencem à operação de hospitalidade. O registro digital organiza o atendimento, mas não comprova, por si, a prestação física da hospedagem.

## 7.4 Carteira e custódia

Na implementação de referência, o participante utiliza uma carteira própria para assinar autenticações e transações. O atendimento pode orientar seu uso sem receber a chave privada ou a frase de recuperação. O controle de acesso à carteira permanece com seu titular.

A autenticação suporta contas externas comuns, conhecidas como EOA. Carteiras de contrato e contas coletivas de custodiante não integram esse fluxo. A custódia institucional não está disponível na implementação descrita; sua eventual contratação exige definição própria de poderes, identificação das posições individuais e integração.

O serviço de conversão entre reais e stablecoin é distinto da custódia de IBT. A escolha de um prestador financeiro não transfere automaticamente a ele o controle da carteira do participante.

# 8. Governança

## 8.1 Poderes efetivos

A administração libera estoque, reduz reserva, pausa/retoma operações, apura receita, registra quitação externa, configura stablecoin uma vez e recupera posições. A propriedade usa indicação e aceite em duas etapas, via Ownable2Step [3]. Renunciar à propriedade foi desabilitado.

A governança é administrativa, sem votação dos titulares, DAO, proxy de atualização ou prazo obrigatório de espera para atos administrativos. A recuperação de posições depende da autoridade do proprietário.

| Configuração | Alterável na mesma implantação? | Condição |
| --- | --- | --- |
| Oferta, casas decimais e limite por carteira | Não | Fixados na implantação e no código |
| Alíquota e máximo de períodos | Não | Regras do código |
| Datas de validade | Não | Fixadas na implantação |
| Reserva mínima | Pode diminuir | Ato administrativo |
| Stablecoin | Configuração inicial única | Sem substituição posterior |
| Proprietário | Sim | Indicação e aceite |
| Pausa | Sim | Sem extinguir todo direito acumulado |

## 8.2 Recuperação de participante

A reemissão transfere saldo integral da carteira antiga para a nova por queima e emissão compensatórias. Ao fim, a oferta permanece igual; a antiga fica revogada e royalties pendentes são redirecionados. Pagamentos e eventos anteriores não são apagados.

O backend move cotas livres e alocações de pedidos sem criar nova compra. Para recuperação, a nova carteira deve pertencer à mesma pessoa verificada. Sessões antigas são invalidadas.

Sucessão e disputa de titularidade dependem de análise documental e conciliação específicas. O mecanismo técnico de recuperação não determina, por si, quem possui legitimidade para receber a posição.

## 8.3 Administração e continuidade

A troca de proprietário exige indicação e aceite. Estoque e royalties permanecem em suas carteiras até movimentação e conciliação próprias. O antigo administrador pode permanecer temporariamente acima do limite de participante porque a troca de autoridade não reaplica regras de recebimento.

A perda da única chave administrativa compromete a continuidade das funções exclusivas do proprietário. Não existe uma autoridade independente de recuperação nem uma carteira de múltiplas assinaturas configurada na implantação de referência.

Os atos administrativos ficam sujeitos à prestação de contas da operação. A implementação de referência não oferece múltiplos perfis administrativos, autenticação multifator, dupla aprovação ou trilha externa imutável.

A recuperação destina-se à recomposição de acesso ou à transferência de posição documentalmente autorizada. Liberação de reserva, pausa, recuperação e mudança de autoridade são atos identificáveis nos registros da operação.

# 9. Smart contracts e regras automatizadas

## 9.1 Composição dos contratos

O contrato de negócio é o IBIToken. Nos testes, o MockStablecoin representa o ativo de pagamento. Em produção, pretende-se integrar um ativo existente, como BRZ, sem criar uma stablecoin própria.

O IBIToken incorpora bibliotecas da OpenZeppelin para interfaces ERC-20, administração, pausa e proteção de pagamentos. Essas dependências integram o código compilado. O ativo de pagamento é um contrato separado do IBIToken.

Um contrato de negócio concentra saldo, circulação e distribuição no mesmo estado, reduzindo pontos de integração. A contrapartida é concentrar poderes administrativos e exigir nova implantação para alterações estruturais.

## 9.2 Funções e limites

| Grupo | Funções ou mecanismo | Garantia e limite |
| --- | --- | --- |
| ERC-20 | balanceOf, totalSupply, transfer, transferFrom, approve, allowance | Saldo fungível; approve autoriza gasto, não identidade |
| Colocação | primaryPurchase | Move estoque e registra referência; não recebe BRL |
| Limites e reserva | Regras de movimentação e reduceReserve | Limite por carteira e piso administrativo |
| Membership | isMember, accessInfo | Consulta saldo e vigência, sem KYC ou hospedagens |
| Interrupção | Pausa administrativa | Restringe operações definidas; não elimina saldos |
| Receita | reportRevenue | Calcula 15% e atribui obrigações por saldo corrente |
| Recebimento | claimRoyalty | Paga valor já atribuído e financiado |
| Liquidação externa | settleOffChain | Registra pagamento realizado externamente |
| Ativo | setStablecoin, quando não definido | Configuração única |
| Recuperação | reissue | Redireciona posição, preserva oferta e revoga origem |
| Administração | Indicação e aceite de propriedade | Duas etapas, sem timelock |

O contrato não registra consumo de hospedagem, contadores de experiências ou estados individuais de IBT. Datas de pedidos, documentos pessoais e identidade civil permanecem no serviço externo à blockchain.

## 9.3 Circulação

A transferência primária parte da administração e respeita estoque, reserva, destinatário, limite e restrições. Entre participantes, o destinatário deve já possuir IBT, salvo retorno à administração. A versão atual não permite venda secundária direta a qualquer carteira nova só porque ela foi aprovada fora da blockchain.

A aprovação cadastral não é registrada no contrato. A função ERC-20 approve concede a outro endereço permissão de movimentação de saldo, independentemente da verificação de identidade.

Pausa e expiração restringem as movimentações previstas. A data inicial não é trava geral de transferência on-chain; o backend a usa para autorizar hospedagens. Transferência para a própria carteira não movimenta valor e não concede novas cotas.

O limite por carteira não impede uma pessoa de possuir várias carteiras. O backend verifica excesso agregado no uso de cotas, mas não desfaz transferências. Não há garantia on-chain de limite universal por pessoa física.

Restrições podem reduzir liquidez, sem eliminar especulação ou negociação externa. Não existe recompra ou comprador garantido.

## 9.4 Apuração, depósito e saque

O administrador fornece receita bruta e referência de evidência. O contrato percorre titulares positivos e calcula parcelas. Um hash liga o ato ao documento externo, mas não prova receita verdadeira ou integral.

Com stablecoin definida, o depósito acontece na mesma transação da apuração. Falha de saldo, autorização ou transferência reverte o período. Utilizam-se mecanismos da OpenZeppelin para movimentação ERC-20 e proteção contra reentrância.

A obrigação fica com a carteira identificada na apuração. Vender IBT depois não a transfere; recuperação administrativa possui lógica própria para valores pendentes.

A enumeração utiliza uma lista de titulares mantida pelo contrato. A oferta de 150 unidades indivisíveis limita a 150 o número de endereços com saldo positivo. O custo de execução da apuração cresce com a quantidade de titulares e depende também do ativo de pagamento.

O ativo de pagamento deve ter comportamento compatível. Taxa na transferência, rebasing, bloqueios e outras particularidades podem afetar o modelo. Declarar ERC-20 não comprova compatibilidade com todos os pressupostos econômicos do rateio.

## 9.5 Propriedades do sistema

| Propriedade | Interpretação |
| --- | --- |
| Conservação | Soma de saldos igual a 150 após operações bem-sucedidas na configuração do projeto |
| Hospedagem sem alteração de IBT | Pedido e consumo não queimam nem marcam tokens |
| Recuperação sem inflação | Queima e emissão compensatórias mantêm a oferta |
| Rateio consistente | Mesma receita e saldos da apuração para as parcelas do período |
| Pagamento único | Valor quitado não pode ser sacado outra vez |
| Financiamento | Obrigações on-chain dependem do depósito previsto |
| Circulação | Recebimentos respeitam regras, com exceção administrativa |

A conservação de oferta, o rateio e o pagamento único são propriedades verificadas nos testes funcionais. A suficiência financeira depende de um ativo de pagamento compatível. Na troca de proprietário, a conciliação do estoque permanece necessária, pois a mudança de autoridade não redistribui saldos.

## 9.6 Compilação e verificação

A implementação utiliza Solidity 0.8.34, otimizador com 200 execuções, alvo EVM Osaka e OpenZeppelin 5.6.1. A versão de referência foi compilada e publicada pelo Remix. O código de criação e de execução possui correspondência exata verificada no Sourcify [11].

A validação funcional cobre oferta, reserva, limites, transferências, recuperação, apuração, financiamento, pagamento único e integração com o livro de cotas. O conjunto documentado reúne 60 casos, incluindo testes Solidity, scripts e serviço off-chain, executados em ambiente local com Anvil.

Os testes funcionais e a verificação de código sustentam a descrição técnica. Não representam auditoria independente, validação de carga em produção ou comprovação de integração hoteleira.

# 10. Arquitetura tecnológica

## 10.1 Componentes e confiança

| Componente | Estado ou responsabilidade | Limite de confiança |
| --- | --- | --- |
| Carteira | Chave e autorizações | Controle da chave não comprova identidade civil |
| IBIToken | Saldos, circulação e obrigações | Depende da receita informada |
| Stablecoin | Ativo usado no pagamento | Emissor, permissões e comportamento do ativo |
| Indexador RPC | Eventos e referência de confirmação | Rede correta e histórico completo |
| API e livro de cotas | Pessoas, vínculos, pedidos e autenticação | Integridade do serviço e do banco |
| Hospitalidade | Inventário e execução | Não substituída pelo registro técnico |
| Prestador financeiro | Conversão e liquidação | Fora da execução do IBIToken |

O navegador não é a fonte de verdade do saldo nem do histórico. A API calcula elegibilidade com dados conciliados. A blockchain é a fonte das posições e obrigações on-chain; o banco é a fonte operacional das experiências. Perder esse histórico não se resolve consultando apenas balanceOf.

## 10.2 Modelo de dados

O serviço usa Node.js e SQLite, com transações e restrições de integridade. As entidades são pessoas, carteiras, movimentos, pedidos, alocações de cotas, devoluções, desafios de autenticação, sessões, auditoria e metadados de sincronização.

A pessoa guarda uma chave derivada por HMAC do identificador normalizado. Esse campo não mantém CPF em claro, mas não torna a pessoa anônima. Carteiras e histórico também podem permitir identificação por associação. A técnica não substitui política de proteção de dados.

A carteira guarda endereço, pessoa, saldo observado, cotas livres e revogação. O pedido guarda pessoa, quantidade, datas e estado. Alocações indicam as cotas comprometidas e como devolvê-las sem duplicação. Identificadores de banco não são tokenIds.

## 10.3 Autenticação e vínculo

O servidor emite desafio com origem, rede, nonce, emissão, validade e identificador da solicitação. A pessoa assina; o servidor verifica assinatura, prazo e uso único. O desenho utiliza elementos do ERC-4361 [2], sem afirmar certificação integral de conformidade.

O desafio expira em cinco minutos. A sessão dura uma hora, usa segredo aleatório armazenado como hash e fica vinculada à pessoa e carteira. Rotas pessoais usam essa identidade, evitando acesso a outro cadastro pela troca de um identificador na requisição.

Vincular exige pessoa aprovada e prova da carteira. O ato administrativo de aprovar cadastro não prova posse da chave. A implementação verifica contas comuns, conhecidas como EOA; não implementa ERC-1271 para carteiras de contrato.

Não há fluxo público de desvincular e reassociar uma carteira a outra pessoa. Recuperação, erro cadastral e sucessão exigem procedimento que preserve histórico.

## 10.4 Sincronização da blockchain

Na Sepolia, o indexador trabalha com bloco finalizado. Confere rede, código do endereço, nome, casas decimais e oferta esperada. Lê estado no mesmo bloco de referência e percorre eventos em intervalos de até 2.000 blocos, ordenados por bloco e posição do log.

A identidade de cada movimento combina rede, transação e posição do evento. Reprocessar não duplica cotas. O histórico precisa incluir a emissão inicial; inferir cotas somente pelo saldo atual é insuficiente.

O cursor inclui hash do bloco para detectar divergência. Sincronizações são serializadas no processo. Eventos de recuperação recebem tratamento especial, sem interpretar queima e emissão compensatórias como compra nova.

Antes de atos que consomem ou confirmam uso, o sistema verifica coerência com o estado atual, saldos, revogação e movimentações relevantes não consolidadas. Os limites atuais exigem bloco recente de até 120 segundos e referência finalizada de até 1.800 segundos.

Confirmação na rede não significa disponibilidade instantânea no aplicativo. Atualização pendente, dado antigo ou divergência suspende o uso dependente de saldo. Reorganização detectada, histórico incompleto ou evento incompatível exige conciliação; não há reconstrução destrutiva automática do banco de hospedagens.

Essas verificações não tornam reserva e transferência uma operação atômica. O participante ainda pode transferir depois da consulta; por isso, etapas relevantes revalidam saldo.

## 10.5 Estados, reservas e devoluções

~~~states
Livre -- solicitar --> Reservada
Reservada -- confirmar --> Reservada
Reservada -- concluir --> Utilizada
Reservada -- cancelar --> Devolução pendente
Devolução pendente -- conciliar blockchain --> Livre
~~~

O pedido passa por solicitado, confirmado, concluído ou cancelado. Concluído e cancelado são terminais. Reagendar altera datas sem conceder cotas e preserva a quantidade comprometida.

Cancelar pode ser registrado durante uma atualização da rede. A restituição é separada: apenas devoluções anteriores ao ponto coberto pela conciliação são liberadas. Uma barreira de sequência exclui cancelamentos criados depois do início daquela atualização.

A conservação do livro é: livres + reservadas + utilizadas + devoluções pendentes = 150, incluindo estoque administrativo e carteiras ainda não vinculadas. Transferência e recuperação redistribuem; pedido, conclusão e cancelamento mudam classificação. Não se criam cotas periodicamente.

Esse total é orçamento de direitos, não inventário de acomodações. Disponibilidade física pertence à operação hoteleira.

## 10.6 Concorrência e idempotência

As mutações usam transações SQLite com aquisição de escrita antes de verificar e alterar quantidades. Unicidade e restrições impedem duplicações de identidade, vínculo e movimento e gravação de quantidades inválidas.

Pedidos têm chave de idempotência por pessoa e conteúdo. Repetir a mesma solicitação retorna o resultado anterior. Reusar a chave com conteúdo diferente causa conflito, evitando consumo duplicado por duplo clique ou repetição de rede.

A configuração usa WAL, chaves estrangeiras e espera limitada por contenção. Testes de operações concorrentes não comprovam coordenação entre várias instâncias. A implementação de referência opera em processo único, sem validação de carga distribuída.

## 10.7 API, privacidade e continuidade

Há operações pessoais autenticadas e operações administrativas de cadastro, atendimento e conciliação. A API administrativa usa um único bearer token, sem perfis separados, MFA ou dupla aprovação.

O serviço de referência opera localmente, com acesso restrito à máquina em que é executado. A disponibilidade pública depende de infraestrutura com transporte criptografado, gestão de segredos, controle de acesso, monitoramento e política de retenção e restauração.

A trilha de auditoria reside no banco e está sujeita ao controle de sua infraestrutura. Ela registra as operações do serviço, mas não possui a imutabilidade do registro público da blockchain.

A continuidade do serviço depende da preservação conjunta do histórico de experiências e da configuração de identificação. O banco verifica a compatibilidade de sua configuração para evitar associações incorretas. Restauração e rotação de credenciais precisam conservar os vínculos entre pessoas, carteiras e pedidos.

## 10.8 Mainnet e ativo real

A rede prevista para operação comercial é Ethereum Mainnet, chain ID 1, com IBT no padrão ERC-20. A implantação nessa rede envolve custos de execução em ETH e uma configuração própria de contratos e serviços.

O ativo de liquidação previsto é BRZ na Ethereum, listado pela Transfero no endereço 0x01d33FD36ec67c6Ada32cf36b31e88EE190B1839 [4]. Essa identificação é uma referência técnica; o contrato de testes utiliza tBRL. A integração comercial pressupõe compatibilidade do ativo e contratação dos serviços financeiros aplicáveis.

O backend de referência aceita as redes local e Sepolia, identificadas por 31337 e 11155111. Não oferece suporte ativo à Mainnet nesta edição. A integração comercial abrange rede, contrato, eventos, política de confirmação e infraestrutura de atendimento.

Como a stablecoin não é substituível depois da configuração, ativo errado ou incompatível exigiria nova implantação e transição, não simples ajuste administrativo.

## 10.9 Identificação da implantação

A versão 2 está publicada na rede Sepolia, chain ID 11155111. Seu endereço, parâmetros, transação e fontes verificadas constam do Apêndice C. A emissão é de 150 IBT, com zero casas decimais, reserva inicial de 50 IBT e limite de 20 por carteira de participante.

A blockchain de testes utiliza tBRL para simular o ativo de pagamento. A versão 2 possui um livro de cotas próprio, sincronizado desde sua emissão, e o serviço reconhece a posição consolidada em blocos finalizados.

O contrato não utiliza proxy de atualização. Uma nova publicação cria outro endereço e outra emissão, sem transferir automaticamente saldos, cotas ou obrigações. Somente a implantação identificada no Apêndice C corresponde à versão descrita neste documento.

# 11. Riscos, premissas e limitações

## 11.1 Direitos e enquadramento

O IBT combina experiências e participação em receita. Seu enquadramento jurídico depende das características econômicas e dos instrumentos que estabelecem os direitos, conforme a orientação da CVM sobre criptoativos [6]. O padrão técnico ERC-20 não determina, isoladamente, a classificação do ativo.

A prestação de serviços de ativos virtuais está sujeita ao regime regulatório aplicável ao prestador e à atividade, incluindo a regulamentação do Banco Central [5]. A referência a uma empresa neste documento não comprova contratação ou autorização específica para o arranjo do programa.

Os instrumentos da operação abrangem cessão de recebíveis, direitos dos participantes, condições de distribuição, prestação de informações, inadimplência e tratamento de dados. A publicação do contrato não equivale à aprovação regulatória de uma oferta.

## 11.2 Riscos materiais

| Risco | Consequência | Tratamento |
| --- | --- | --- |
| Receita abaixo da projeção | Royalties menores | Hipóteses explícitas e apuração real |
| Receita incorreta ou sem repasse | Base errada ou período não financiado | Conciliação e obrigação contratual |
| Baixa liquidez | Dificuldade de vender | Divulgar restrições e ausência de recompra |
| Cotas consumidas | IBT recebido sem cota equivalente | Divulgação separada de IBT e cotas livres |
| Falta de inventário | Pedido sem acomodação | Regulamento e confirmação operacional |
| Chave administrativa comprometida | Uso indevido de poderes | Gestão institucional e controles |
| Perda do banco | Histórico não recuperável só pela rede | Backups e restauração |
| RPC ou histórico divergente | Interrupção de pedidos | Suspender uso dependente de saldo e conciliar |
| Ativo incompatível | Depósito ou saque comprometido | Análise e teste com ativo real |
| Gas | Custo de transações na rede | Informação de custos e orientação no uso da carteira |
| Dados expostos | Identificação indevida | Minimização, acesso e retenção |
| Falhas não detectadas | Perdas e indisponibilidade | Revisão independente antes de produção |

O código não elimina erro administrativo, falha de custódia, bloqueio do emissor da stablecoin ou descumprimento hoteleiro. Armazenar hash também não torna um dado de receita verdadeiro.

# 12. Transparência e prestação de contas

A participação em royalties depende de informação sobre faturamento elegível, valor apurado, posição considerada no rateio, montante financiado e pagamento realizado. Eventos e recibos da blockchain permitem conferir a execução financeira; a documentação contábil dá suporte à receita informada.

O sistema de atendimento registra cotas disponíveis, solicitações, confirmações, cancelamentos e experiências concluídas. Esses dados são associados à pessoa e às carteiras vinculadas, com acesso autenticado. A consulta pública de saldo de IBT não expõe o histórico pessoal de hospedagens.

A verificação do código identifica a correspondência entre a fonte e o contrato publicado. Ela não comprova a veracidade de dados externos, a disponibilidade de acomodações ou a adequação jurídica da operação.

O vínculo com o território não implica certificação automática de impacto ambiental ou social. Resultados dessa natureza dependem de indicadores e evidências da operação. Não há reinvestimento, doação ou conversão automática de royalties em novas emissões.

# 13. Escopo e condições de operação

## 13.1 Alcance desta edição

Este whitepaper descreve o modelo do IBIToken e sua implementação acadêmica na Sepolia. A emissão de testes não é uma emissão comercial na Mainnet.

As condições de aquisição pertencem ao memorando da oferta; as obrigações sobre recebíveis e serviços, aos instrumentos jurídicos; e as condições de atendimento, ao regulamento de hospedagem. Este documento explica o funcionamento do programa sem substituir esses instrumentos.

## 13.2 Hospedagem e atendimento

A experiência descrita no capítulo 5 depende de elegibilidade e confirmação de disponibilidade. Esta edição não estabelece prazo de cancelamento, penalidade por cancelamento tardio ou ausência. Não se presume cancelamento irrestrito nem perda automática da cota.

O serviço registra pedidos e devoluções, mas não aplica automaticamente os limites de noites, hóspedes ou prazo de cancelamento. Também não consulta inventário hoteleiro.

## 13.3 Serviços externos e disponibilidade

Identificação civil, disponibilidade e prestação de hospedagem e apuração contábil são responsabilidades externas ao contrato. Na demonstração, cadastro e pedidos recebem aprovação do operador, sem integração com KYC ou sistema hoteleiro real.

Mainnet, BRZ e Transfero compõem a arquitetura comercial prevista, sem implantação ou contratação apresentada nesta edição. Conversão de reais e custódia institucional não estão disponíveis. A operação comercial depende da formalização dos direitos e serviços, da infraestrutura de atendimento e da validação técnica e jurídica correspondente.

# Apêndice A. Glossário

| Termo | Significado |
| --- | --- |
| IBT | Unidade inteira e fungível do IBIToken |
| ERC-20 | Interface de saldo, transferência e autorização de gasto [1] |
| Membership | Condição derivada de posse e critérios do programa |
| Cota | Capacidade operacional de pedir experiência |
| Pessoa verificada | Cadastro aprovado; não só CPF formalmente válido |
| Carteira vinculada | Endereço associado mediante prova de controle |
| On-chain / off-chain | Na blockchain / fora dela |
| Stablecoin | Ativo referenciado a unidade econômica, sujeito ao arranjo e emissor |
| BRZ / tBRL | Ativo considerado para produção / moeda fictícia de testes |
| Gas | Custo de execução na rede |
| Finalização | Referência usada para consolidar eventos |
| Idempotência | Repetição sem duplicar efeito |
| Reemissão | Recuperação com queima e emissão compensatórias |
| KYC | Identificação e avaliação cadastral |
| VASP / PSAV | Prestador de serviços de ativos virtuais |
| Autocustódia | Participante controla suas chaves |
| Pull payment | Recebimento iniciado pelo titular |
| Hash / HMAC | Integridade ou derivação; não provam verdade do dado |

# Apêndice B. Premissas e memória de cálculo

## B.1 Premissas operacionais

Fonte: Modelo Glamping.xlsx, aba “Valor do token”, células B3:E12. Todas as projeções desta edição se referem ao cenário-base desse arquivo.

| Premissa | 2027 | 2028 | 2029 | 2030 |
| --- | --- | --- | --- | --- |
| Unidades operacionais | 6 | 20 | 20 | 20 |
| Diária (R$) | 7.333,00 | 8.066,30 | 8.872,93 | 9.760,22 |
| Crescimento da diária | 10% | 10% | 10% | 10% |
| Ocupação | 35% | 20% | 25% | 30% |
| Dias no ano | 365 | 365 | 365 | 365 |
| Estadia média (noites) | 3 | 3 | 3 | 3 |
| Consumo por hospedagem (R$) | 2.000,00 | 2.090,00 | 2.184,05 | 2.282,33 |

A quantidade é de 150 tokens e a alíquota é de 15% em todos os anos. A receita de consumo por hospedagem cresce 4,5% ao ano nas fórmulas da planilha. A estadia média de 3 noites é uma premissa de projeção de demanda; a experiência concedida por cota segue as condições próprias do capítulo 5.

## B.2 Formação das receitas e dos fluxos

Diárias vendidas = unidades operacionais × ocupação × 365. Receita de hospedagem = diária × diárias vendidas. Hospedagens = diárias vendidas ÷ 3. Receita de consumo = hospedagens × consumo médio por hospedagem. Royalties = 15% × (receita de hospedagem + receita de consumo).

| Indicador | 2027 | 2028 | 2029 | 2030 |
| --- | --- | --- | --- | --- |
| Diárias vendidas | 766,50 | 1.460,00 | 1.825,00 | 2.190,00 |
| Hospedagens | 255,50 | 486,67 | 608,33 | 730,00 |
| Receita de hospedagem (R$) | 5.620.744,50 | 11.776.798,00 | 16.193.097,25 | 21.374.888,37 |
| Receita de consumo (R$) | 511.000,00 | 1.017.133,33 | 1.328.630,42 | 1.666.102,54 |
| Royalties (R$) | 919.761,67 | 1.919.089,70 | 2.628.259,15 | 3.456.148,64 |
| Valor presente dos royalties (R$) | 780.378,97 | 1.381.515,52 | 1.605.310,05 | 1.791.073,46 |

Fonte: “Valor do token”, B15:F20. O total é de 6.241,50 diárias vendidas e 2.080,50 hospedagens projetadas. Quantidades fracionárias representam médias de projeção, não reservas individuais fracionadas. A receita de hospedagem totaliza R$ 54.965.528,12 e a de consumo, R$ 4.522.866,29; a soma é R$ 59.488.394,41. Os royalties somam R$ 8.923.259,16.

Os resultados usam a precisão integral das fórmulas do arquivo; as tabelas exibem valores monetários e volumes com duas casas decimais. O arredondamento de apresentação pode produzir diferenças de centavos entre parcelas exibidas e totais. Não foram alterados insumos, fórmulas ou valores do arquivo de origem.

## B.3 Taxa de desconto e valor por token

| Premissa da aba “Wacc” | Valor | Referência |
| --- | --- | --- |
| Capital próprio / dívida | 100% / 0% | C5:C7 |
| Taxa de referência nominal em reais | 14,35% a.a. | C10 |
| Beta setorial desalavancado | 0,83 | C11 |
| Alíquota usada no cenário de capital | 34% | C12 |
| Dívida / capital próprio | 0 | C13 |
| Beta realavancado | 0,83 | C14 |
| Prêmio de risco de mercado | 4,23% | C15 |
| Custo de capital próprio e WACC | 17,8609% a.a. | C17, C20 e C23 |

A fórmula efetivamente utilizada é 14,35% + 0,83 × 4,23% = 17,8609%. Como o cenário não possui dívida, WACC é igual ao custo de capital próprio. Não há parcela adicional de iliquidez nem de risco-país somada nessa fórmula. Os parâmetros de mercado e as justificativas são premissas fornecidas na planilha, não uma atualização independente de cotações neste whitepaper.

Para cada ano y, VP_y = royalty_y ÷ (1 + 0,178609) elevado a (y - 2026). A soma dos quatro valores presentes é R$ 5.558.278,01. Dividida por 150, resulta em R$ 37.055,19 por token. Multiplicada por 100 unidades, a referência por token com precisão integral resulta em R$ 3.705.518,67 para colocação, conforme “Valor do token”, B23:C23.

Trata-se de avaliação do fluxo de royalties do programa, sem valor terminal ou restituição de principal adicionados à fórmula. O cálculo não estima separadamente valor monetário para membership e experiência. A periodicidade semestral dos pagamentos permanece uma regra operacional; o desconto utilizado na avaliação é anual.

## B.4 Sensibilidade

As matrizes abaixo reproduzem a aba “Sensibilidade”, B35:F39 e B43:F47, em reais por token. O choque de ocupação é relativo à curva-base de 35% / 20% / 25% / 30%, e não uma alteração em pontos percentuais. Ele afeta proporcionalmente receitas de hospedagem e consumo.

**Ocupação e crescimento da diária, com WACC de 17,8609% a.a.**

| Choque de ocupação | Diária +5% | +7,5% | +10% | +12,5% | +15% |
| --- | --- | --- | --- | --- | --- |
| -20% | 27.478,59 | 28.543,86 | 29.644,15 | 30.780,08 | 31.952,26 |
| -10% | 30.913,41 | 32.111,84 | 33.349,67 | 34.627,59 | 35.946,30 |
| 0% | 34.348,23 | 35.679,83 | 37.055,19 | 38.475,10 | 39.940,33 |
| 10% | 37.783,05 | 39.247,81 | 40.760,71 | 42.322,60 | 43.934,36 |
| 20% | 41.217,88 | 42.815,79 | 44.466,22 | 46.170,11 | 47.928,40 |

**WACC e ocupação, com crescimento da diária de 10% a.a.**

| WACC a.a. | Ocup. -20% | -10% | Sem choque | +10% | +20% |
| --- | --- | --- | --- | --- | --- |
| 15,8609% | 31.100,49 | 34.988,05 | 38.875,62 | 42.763,18 | 46.650,74 |
| 16,8609% | 30.359,27 | 34.154,18 | 37.949,09 | 41.743,99 | 45.538,90 |
| 17,8609% | 29.644,15 | 33.349,67 | 37.055,19 | 40.760,71 | 44.466,22 |
| 18,8609% | 28.953,97 | 32.573,21 | 36.192,46 | 39.811,70 | 43.430,95 |
| 19,8609% | 28.287,61 | 31.823,56 | 35.359,52 | 38.895,47 | 42.431,42 |

As duas células centrais correspondem à referência de R$ 37.055,19 por IBT. As matrizes são cenários de sensibilidade, sem probabilidades atribuídas e sem garantia de preço ou rentabilidade. Mantêm-se os demais parâmetros do arquivo.

# Apêndice C. Identificação técnica

## C.1 Contrato de referência

| Parâmetro | Identificação |
| --- | --- |
| Contrato | IBIToken, versão 2 |
| Rede | Ethereum Sepolia, chain ID 11155111 |
| Endereço IBT | 0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030 |
| Transação de publicação | 0x415a6618a50981407552e4297c48ab0e66c724d03d846cc3f9c165b5a114fb5c |
| Bloco de publicação | 11684811 |
| Data de publicação | 11/09/2026, 22h23min24s UTC |
| Administração inicial | 0x549852CA58C2e843e29428a81Ab97D2d613BB749 |
| Oferta e precisão | 150 IBT; zero casas decimais |
| Reserva e limite | Reserva inicial de 50 IBT; até 20 por carteira de participante |
| Ativo de testes | tBRL, 6 casas decimais |
| Endereço tBRL | 0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE |
| Compilação | Solidity 0.8.34; otimizador 200; EVM Osaka; OpenZeppelin 5.6.1 |
| Verificação | Sourcify: correspondência exata do código de criação e de execução [11] |

## C.2 Vigência e identificação da rede

A vigência de teste vai de 11/09/2026 a 10/09/2030, às 18h53min48s UTC, correspondendo aos timestamps 1789152828 e 1915296828. Esse intervalo de 1.460 dias é próprio da demonstração e não substitui o horizonte econômico de 2027 a 2030 utilizado nas projeções.

A identificação de IBT combina rede e endereço do contrato. Nome e símbolo, isoladamente, não distinguem emissões. O endereço acima corresponde à versão 2; implantações anteriores não integram a emissão de referência nem ampliam sua oferta de 150 unidades.

Fonte, metadados, parâmetros de compilação, argumentos e recibo permitem conferir a implantação. A publicação e sua verificação podem ser consultadas nas referências abaixo.

Sourcify: https://repo.sourcify.dev/11155111/0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030/

Transação: https://sepolia.etherscan.io/tx/0x415a6618a50981407552e4297c48ab0e66c724d03d846cc3f9c165b5a114fb5c

# Apêndice D. Referências

## D.1 Documentação técnica do projeto

A descrição funcional tem como base o código do IBIToken v2, o serviço de cotas por pessoa e seus testes. O conjunto técnico do projeto reúne o código-fonte, as regras de negócio, os procedimentos de execução, o relatório de testes e o registro de implantação.

O registro da Sepolia inclui recibo, argumentos, metadados e entrada do compilador. As fontes publicadas no Sourcify correspondem ao contrato identificado no Apêndice C.

As projeções econômicas utilizam o arquivo Modelo Glamping.xlsx fornecido pelo grupo em 11/09/2026, abas “Valor do token”, “Wacc” e “Sensibilidade”. O capítulo 4 apresenta os resultados; o Apêndice B reproduz premissas, metodologia, referências de células e sensibilidades. O arquivo de origem foi consultado sem alterações.

## D.2 Referências primárias

[1] Ethereum Improvement Proposals. ERC-20: Token Standard. https://eips.ethereum.org/EIPS/eip-20

[2] Ethereum Improvement Proposals. ERC-4361: Sign-In with Ethereum. https://eips.ethereum.org/EIPS/eip-4361

[3] OpenZeppelin. Contracts 5.x: Access Control. https://docs.openzeppelin.com/contracts/5.x/access-control

[4] Transfero. Available Assets. Referência de BRZ e redes. https://docs.transfero.com/reference/available-assets

[5] Banco Central do Brasil. Resolução BCB 520, de 10 de novembro de 2025. https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=520&tipo=Resolu%C3%A7%C3%A3o+BCB

[6] CVM. Parecer de Orientação 40, de 11 de outubro de 2022. https://conteudo.cvm.gov.br/legislacao/pareceres-orientacao/pare040.html

[7] Remix IDE. Solidity Unit Testing. https://remix-ide.readthedocs.io/en/latest/unittesting.html

[8] Remix IDE. Running JavaScript Scripts. https://remix-ide.readthedocs.io/en/latest/running_js_scripts.html

[9] Foundry. Anvil. https://www.getfoundry.sh/anvil/index.html

[10] Node.js. SQLite. https://nodejs.org/api/sqlite.html

[11] Sourcify. IBIToken v2 na Sepolia, correspondência exata. https://repo.sourcify.dev/11155111/0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030/

Referências consultadas em 11 de setembro de 2026. A identificação de serviços externos corresponde às informações disponíveis nessa data.
