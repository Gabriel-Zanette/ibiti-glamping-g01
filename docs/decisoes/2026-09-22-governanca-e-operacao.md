# Governança e operação — entrevista de decisões

> **Prevalece a consolidação após as 12 anotações:** [decisões atuais de 23/09](2026-09-23-consolidacao-das-anotacoes.md). Royalties por quantidade e tempo de posse; mercado secundário integralmente retirado; identificação híbrida e fluxo de recuperação aceitos. Os avisos e propostas abaixo preservam etapas anteriores da entrevista.

> **Estado mais recente, 23/09/2026:** [respostas Q3–Q13](2026-09-23-respostas-q3-q13.md). Pré-venda removida; revisão conjunta, pausa por atividade, recuperação com sete dias e escopo externo aceitos. Reserva pode ser liberada para venda; hospedagem compromete cotas off-chain. Núcleo da tesouraria 2 de 3 aceito, com anotações complementares pendentes. Q10 e Q13 abertos; Q11 indicado como retirado, alcance a conciliar com as anotações. As recomendações originais abaixo são histórico e não prevalecem sobre essas respostas.

> **Continuação em 23/09/2026:** [respostas disponíveis e Q1/Q2](2026-09-23-anotacoes-e-q1-q2.md). O memorando v1 foi localizado e consultado diretamente na Sprint 3 do GitLab. A rodada atual foi limitada pelo usuário a Q1/Q2. Uma imagem posterior confirma 12 anotações no aplicativo, distintas das respostas numeradas já lidas; seu conteúdo ainda não foi recuperado. A imagem pede reformular Q1 e condiciona o aceite da recomendação de Q2 à verificação durante o período.

22/09/2026. Sessão solicitada com `grill-with-docs`, `grilling` e `domain-modeling`. Documento de trabalho: propostas não são aprovação institucional, contratação ou implementação. Código e pacotes não foram alterados nesta rodada.

## Confirmado e observado

- **Confirmado:** quatro anos desde a abertura, períodos de seis meses. [ADR 0001](../adr/0001-vigencia-a-partir-da-abertura.md).
- **Confirmado:** compra secundária por participante previamente aprovado, inclusive primeira aquisição. [ADR 0002](../adr/0002-entrada-pelo-mercado-secundario.md).
- **Direção aceita:** distribuir poderes por função; atendimento/contestação externos. Matriz de poderes, aprovação conjunta e integração da contestação ainda abertas.
- **Fonte consultada em 23/09:** [memorando v1 da Sprint 3](../referencias/memorando-v1-sprint3/README.md). Páginas 11–12 fixam corte no reporte na v1; mudar para encerramento é uma proposta de evolução, ainda não aprovada. O memorando v2 consolidado permanece pendente.
- **Código observado:** calendário civil, owner único, pausa ampla, reserva reduzível, recuperação em 48h, tesouraria imutável, preço fixado uma vez e stablecoin não substituível. Testes anteriores validam esse estado, não as propostas abaixo.

## Entregas e limites do escopo

| Artefato | Exigência recebida | Relação com o desenho |
| --- | --- | --- |
| Implementação v2 | Regras coerentes e funcionais; evolução justificada; português | Implementar/testar decisões e delimitar interfaces externas |
| Evidências operacionais | Operações reais contextualizadas; interpretação crítica; PDF em inglês | Comprovar o que existe, distinguindo propostas e simulações |
| Memorando v2 | Direitos, riscos, retorno, governança e responsabilidades; PDF em português | Comunicar o mesmo modelo sem prometer funções inexistentes |

Os enunciados não exigem nominalmente sucessão automática, biometria, fornecedor KYC ou oracle. Recomenda-se tratar sucessão como procedimento externo explicitamente delimitado nesta entrega; a recuperação atual é da mesma pessoa. Se o memorando prometer transferência por herança, compatibilizar a promessa com capacidade efetiva ou revisar deliberadamente o escopo. Declarar uma limitação não garante nota.

## Royalties e abertura

Exemplo: abertura hipotética em 15/04/2027; fechamento em 15/10; Alice vende em 20/10 e relatório entra em 30/10. O corte atual remunera o comprador. Corte no fechamento remuneraria Alice. Ambos são semestrais.

Recomendação: posição no encerramento, com histórico verificável. Média ponderada pelo tempo de posse é alternativa mais complexa e economicamente diferente. Sugestão inicial de disponibilização até 30 dias corridos depois do fechamento, sujeita ao memorando/capacidade contábil; não é prazo aprovado nem garantia de saque simultâneo.

Recomenda-se definir abertura como início oficial de atendimento comercial regular. Soft opening, inauguração promocional e primeiro hóspede não são necessariamente equivalentes. Autoridade/provas de ativação dependem da governança; a ativação deve ser única, sem reinício arbitrário do relógio. Se houver pré-venda, definir atraso/não abertura, prazo limite e proteção dos recursos; não presumir reembolso automático. Código atual permite circulação antes de validFrom; hospedagem exige vigência.

## Governança, pausa e reserva

Separação por função limita poderes individuais. Aprovação conjunta impede um ato crítico de ser concluído por uma única pessoa. Uma chave por pilar não produz automaticamente a segunda proteção.

| Pilar proposto | Responsabilidade | Controle proposto |
| --- | --- | --- |
| Cadastro/atendimento | Identificação, vínculo e protocolo de recuperação | Conta individual; separar identidade e critérios do programa |
| Financeiro | Receita, conciliação e recursos | Preparação e revisão por pessoas diferentes |
| Segurança | Incidentes e alertas | Contenção rápida; retomada revisada |
| Supervisão | Recuperações, exceções e mudança de responsáveis | Aprovação independente para atos críticos |

Troca dos próprios papéis também deve exigir controle conjunto; um administrador que possa conceder todos os papéis a si mesmo desfaz a separação. Endereços diferentes não demonstram pessoas independentes. Exigir cadastro + supervisor é diferente de aceitar quaisquer duas assinaturas de três.

Pausa atual impede circulação, compras, cadastro, apuração, saques, anúncio/execução de recuperação e elegibilidade de hospedagem. Não apaga saldo/dívida; cancelamento de recuperação permanece disponível. Recomendação: pausa por atividade afetada, com contenção rápida e retomada revisada. Falha de cadastro não necessariamente justifica bloquear saques já financiados; falha de pagamentos pode justificá-lo. Não prometer retomada automática enquanto houver vulnerabilidade.

Redução de reserva 50 → 40 libera dez unidades para venda, sem emissão/queima/venda automática. Supply permanece 150; cada token mantém sua proporção. Se a tesouraria detinha exatamente 50 e vende dez, sua parcela passa de cinco para quatro pontos percentuais da receita bruta. Estoque não vendido também recebe royalties.

Recomendação provisória: piso de 50 durante a emissão, salvo justificativa comercial expressa. Alternativa: liberação excepcional, motivo, aprovação conjunta e espera. O código atual permite redução unilateral e irreversível do piso.

## Recuperação e contestação

Proposta: protocolo privado → revalidação de identidade → desafio assinado pela nova carteira → conferência independente → anúncio pseudônimo → notificação aos contatos anteriores → espera → execução sem disputa. A contestação recebida e validada precisa impedir execução no contrato; chamado externo isolado não protege.

Prazo recomendado para discussão: **sete dias corridos** após anúncio e registro de envio das notificações; inclui fim de semana e permite perceber tentativas de fraude. 48h privilegiam rapidez; quatorze dias ampliam proteção temporal e indisponibilidade. Trata-se de proposta operacional, não prazo legal nem garantia de leitura. Contenção após triagem de incidente pode ser rápida sem antecipar transferência.

Evidências: identificação validada coerente com cadastro anterior; declaração do incidente; prova do novo endereço; confirmação por contato anterior; registros dos revisores. Não exigir assinatura da chave perdida, seed ou chave privada. Boletim de ocorrência pode complementar roubo, sem ser prova suficiente ou requisito universal.

Uma chave antiga comprometida pode contestar uma recuperação legítima; a resolução precisa de rito próprio. Novos contatos do próprio pedido não substituem silenciosamente os anteriores. Hash do dossiê prova integridade relativa ao arquivo preservado, não veracidade. Manter dados pessoais privados; publicar referência aleatória/compromisso adequado, sem CPF ou seu hash simples.

## Identificação e segurança da coleta

Seleção pela IBITI e prova de identidade são verificações distintas. A reputação do público não sustenta uma estimativa verificável de fraude. CPF formalmente válido não prova documento autêntico; assinatura prova controle de carteira.

| Alternativa | Benefício | Limite |
| --- | --- | --- |
| Presencial, documento original e consulta de autenticidade disponível | Aproveita atendimento próximo | Treinamento, erro humano, custo e conluio |
| Remota especializada: validação documental e presença/prova de vida quando adequada | Controles técnicos e rastreabilidade | Fornecedor, custo, falsos resultados e dados pessoais |
| Híbrida: verificação independente + seleção IBITI + revisão de exceções | Separa autenticidade e elegibilidade | Responsabilidades e integração mais complexas |

Recomendação: híbrida como arquitetura-alvo; na entrega acadêmica, simulação explicitada e interface definida, sem coletar documentos reais para aparentar integração.

Controles adicionais: contas individuais/MFA; upload autenticado/cifrado, acesso restrito e retenção definida; autenticação da origem dos resultados do fornecedor; reconciliação com cadastro anterior; duas pessoas nas exceções; trilha de mudanças/alertas. Biometria não é infalível: avaliar necessidade e alternativa presencial. Vínculos pseudônimos on-chain são correlacionáveis.

Hoje, retirar aprovação no serviço bloqueia hospedagens, mas não revoga automaticamente circulação on-chain. A descoberta de fraude após compra requer política própria; não presumir confisco ou exclusão econômica automáticos.

## Custódia

Tesouraria recomendada: endereço institucional estável com **duas de três assinaturas independentes**. Alterar signatários preserva endereço/estoque; perder uma chave não impede atuação das outras duas. Duas chaves comprometidas ou dois signatários em conluio podem autorizar; perder duas bloqueia o quórum. Exige backups separados e proteção das mudanças de signatários/quórum. Módulos auxiliares podem criar caminhos que contornam assinaturas; não adotá-los por padrão.

Alternativas: carteira comum com troca de tesouraria no token (mais poder e complexidade sobre estoque/reserva) ou custodiante contratado (dependência, condições e custos). Endereço fixo com signatários substituíveis resolve rotação de pessoas sem transformar reserva em saldo livremente migrável.

Custódia institucional é distinta da custódia dos participantes. Autocustódia assistida: o participante guarda a chave e recebe orientação sem revelá-la; tem autonomia e responsabilidade de backup. Custódia por prestador: simplifica uso, mas transfere poder/dependência. O backend atual e a recuperação não suportam carteira contratual do participante; multisig institucional não implica esse suporte.

## Faturamento, financiamento e preço

Proposta: operador prepara demonstrativo → financeiro concilia fontes pertinentes → revisor independente aprova versão → dossiê privado e hash público → depósito integral e apuração. Duas aprovações e hash não tornam uma receita falsa verdadeira. Oracle transporta uma informação; sua fonte também exige confiança.

Hoje o dinheiro da apuração sai do chamador, não automaticamente da tesouraria. Com papéis separados, definir financiador e autorizações. Base bruta, descontos/cancelamentos, prazo e retificação aguardam memorando/responsável financeiro. Retificação deve preservar o original; nunca retirar valores já pagos ou descontar no futuro sem regra explícita.

| Modelo de preço/liquidação | Benefício | Custo/risco |
| --- | --- | --- |
| Preço fixo em BRL; moeda referenciada em BRL | Coerência com receita/valuation brasileiros | Emissor, conversão, custos e desvio da paridade |
| Preço fixo em BRL; moeda referenciada em USD | Outra infraestrutura de liquidação | Cotação, spread, validade e risco cambial |
| Quantidade fixa de stablecoin | Simplicidade técnica atual | Valor em reais pode variar |
| Preço ajustável ou por lotes | Flexibilidade comercial | Poder de alterar oferta e proteger cotações aceitas |

Recomendação inicial: preservar referência econômica em reais e compra atômica; avaliar moeda referenciada ao real. Não alterar valuation nem presumir contratação. Aceite deve mostrar total, custos e validade da cotação. PIX exige prestador/conciliação e não se torna atômico com token por um simples registro administrativo. Recebíveis já financiados não devem trocar de moeda silenciosamente.

## Mercado secundário e hospedagem

Entrada de pessoa previamente aprovada está decidida. Sensibilidade: não basta remover a exigência de saldo. Proposta de controles: identidade vigente, teto agregado, autorização do vendedor, preço/quantidade aceitos, validade e cancelamento da oferta, prevenção de execução duplicada e pagamento/entrega atômicos quando em stablecoin. Vendedor define preço secundário; preço primário não é recompra garantida nem piso de mercado.

Cotas não são renovadas. Exemplo: vendedor tem cinco IBT, já consumiu duas cotas e só tem três livres; vender cinco não entrega cinco experiências novas. O comprador deve conhecer as cotas efetivamente transferíveis antes de aceitar. Uma consulta de tela pode ficar desatualizada: se cotas integrarem a oferta, é necessário reservar/conciliar o compromisso durante sua validade. O livro off-chain não ganha atomicidade por haver atomicidade entre token e stablecoin.

A composição atual usa as cotas livres da **carteira remetente**, não o total de todas as carteiras da pessoa: duas carteiras com o mesmo saldo podem transferir quantidades diferentes de cotas. Cotação e comprovante precisam identificar origem, quantidade de IBT, cotas e posição conciliada. Cancelamento posterior de uma reserva devolve a cota à origem, não retroativamente ao comprador. Não alterar essa política sem decisão expressa.

Reserva de hospedagem confirmada e venda do saldo correspondente:

| Alternativa | Benefício | Limite |
| --- | --- | --- |
| Bloquear somente os IBT que sustentam reservas confirmadas | Impede venda que invalide estadia | Reduz liquidez enquanto reservado; precisa regra verificável também nas transferências diretas |
| Preservar estadia confirmada mesmo após venda; direito fica comprometido com vendedor | Maior liquidez e certeza da estadia | Altera elegibilidade atual; comprador deve aceitar tokens sem aquela cota |
| Permitir venda e bloquear estadia se faltar saldo, como hoje | Implementação simples | Risco de surpresa e conflito; não recomendado como experiência final |

Bloquear um botão do site não impede transferência direta. Oferta, confirmação de estadia e transferência concorrentes precisam conciliar os mesmos direitos. Não bloquear toda a posição quando somente parte sustenta estadias.

Modelos de cancelamento para discussão, sem aprovação institucional:

- **Flexível:** devolução até sete dias antes; maior liberdade e maior exposição a vacância.
- **Intermediário:** devolução até quatorze dias; no período posterior, revisar revenda da acomodação e exceções justificadas.
- **Conservador:** trinta dias; maior previsibilidade operacional e menor flexibilidade do participante.
- Ausência sem justificativa pode consumir cota se essa regra for aprovada e comunicada; força maior requer revisão. Cancelamento pelo operador deve restaurar a mesma cota e buscar solução de atendimento, sem prolongar automaticamente a vigência.
- Remarcação altera a reserva, não cria nova cota. Falta de disponibilidade perto do fim da vigência precisa de solução expressa; não prometer extensão automática ou perda inevitável sem decisão.

Recomendação: partir do regulamento real do operador; se o grupo precisar propor uma política acadêmica, usar o modelo intermediário como hipótese e testar seus efeitos. Limites de três noites e cinco hóspedes já estão definidos; sua validação técnica não exige inventar nova política.

## Árvore e fronteira da primeira rodada

| Ramo | Pergunta atual | Recomendação | Dependências posteriores |
| --- | --- | --- | --- |
| Royalties | Q1: corte no fechamento, reporte ou média? | Fechamento | Histórico e efeitos de recuperação |
| Abertura | Q2: qual marco caracteriza início? | Atendimento comercial regular oficial | Provas, autoridade, ativação e aniversários |
| Pré-venda | Q3: compras antes da abertura? | Só com condições explícitas de atraso/não abertura | Recursos, limite temporal, circulação e reembolso |
| Governança | Q4: responsabilidade individual ou revisão conjunta nos atos críticos? | Papéis + revisão conjunta | Pares, quóruns, substituições e financiador |
| Reserva | Q5: piso permanente ou liberação excepcional? | Piso 50 permanente sem motivo comercial contrário | Espera/limites de eventual liberação |
| Pausa | Q6: geral ou por atividade afetada? | Por atividade | Autoridade, retomada e comunicação |
| Recuperação | Q7: 48h, sete ou quatorze dias? | Sete dias corridos | Contestação, notificações e resolução |
| Escopo externo | Q8: processos externos/interfaces simuladas ou integrações reais/sucessão automatizada nesta entrega? | Externos documentados; simulações explícitas | Fornecedor, documentos/retenção, capacidade de sucessão |
| Tesouraria | Q9: endereço estável com duas de três assinaturas? | Sim | Pessoas, backups e substituição |
| Participante | Q10: autocustódia assistida ou custodiante? | Autocustódia assistida | Autenticação, recuperação e suporte |
| Compra secundária | Q11: pagamento atômico em stablecoin ou pagamento externo? | Atômico | Oferta, preço, aprovação e conciliação de cotas |
| Hospedagem/venda | Q12: bloquear IBT comprometidos ou preservar estadia após venda? | Bloquear apenas o necessário, salvo prioridade maior para liquidez | Período do bloqueio, pedidos vs confirmações, cancelamento |
| Cancelamento | Q13: regulamento do operador ou proposta do grupo? | Regulamento; hipótese intermediária se necessário | Antecedência, no-show, exceções e fim da vigência |

Preço/moeda, base da receita, prazo máximo de disponibilização e retificações serão confrontados com o memorando prometido. Não fechar termos por silêncio. A resposta a cada questão redefine as perguntas seguintes; não executar decisões dependentes por suposição.

## Fontes consultadas

- [OpenZeppelin — controle de acesso](https://docs.openzeppelin.com/contracts/5.x/access-control): capacidades técnicas de papéis e riscos da administração.
- [Safe — signatários/quórum](https://docs.safe.global/advanced/smart-account-concepts): carteira institucional e alteração de signatários; independência das pessoas continua externa.
- [NIST SP 800-63A-4](https://pages.nist.gov/800-63-4/sp800-63a/ial-general/): referência técnica de prova de identidade, não obrigação legal automaticamente aplicável ao projeto.
- [ANPD — perguntas frequentes](https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes) e [riscos biométricos](https://www.gov.br/anpd/pt-br/assuntos/noticias/coleta-de-dados-biometricos-pela-empresa-tools-for-humanity): sensibilidade dos dados e limites da coleta.

## Impacto e estado

Após fechamento, atualizar código, testes, integração, permissões, guias, whitepaper e materiais afetados. Preservar planilha e evidências históricas. As decisões confirmadas já contradizem calendário e entrada secundária atuais; os ADRs registram expressamente a adaptação pendente. Não houve execução de deploy, publicação ou demonstração nesta sessão de desenho.
