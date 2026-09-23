# Segunda entrega de implementação — evolução e justificativas

Revisão de 22/09/2026. **Parte 1 acadêmica = código técnico v2 publicado em 11/09. Parte 2 acadêmica = código técnico v3 desta revisão.** A alteração de numeração técnica evita atribuir ao endereço histórico funcionalidades que ele não possui. O contrato não é atualizável por proxy; os recibos antigos continuam preservados.

## Diagnóstico orientado pela avaliação

A nota 8,4/10 reconheceu execução reproduzível, adaptação ao projeto, organização, rateio e a separação de cotas. Os descontos se concentraram em proteção efetiva do participante e bordas de governança. O menor resultado foi maturidade técnica/analítica (0,95/1,25), seguido por coerência operacional e justificativas técnicas (1,00/1,25). Assim, a revisão reforça invariantes econômicas e operacionais e explica suas consequências, mantendo um único ERC-20.

| Feedback | Causa na Parte 1 | Decisão executada na Parte 2 | Evidência reproduzível |
| --- | --- | --- | --- |
| 1. Concentração por pessoa | `_update` conhecia só saldos de carteiras; backend bloqueava apenas hospedagem | `registerWallet`, vínculo opaco permanente e `personBalance`; teto 20 em compra, transfer e transferFrom, sem contar duas vezes movimento interno | `tests/feedback.test.ts`: compras e transferências com duas carteiras; `Token_test.sol` |
| 2. Recuperação como confisco | `reissue` imediato, inclusive para owner | Anúncio com hash, 48 horas, cancelamento pelo titular/owner, destino vazio da mesma pessoa, nunca tesouraria/admin atual ou pendente/endereço com código | Testes de confisco, espera, cancelamento, destino estrangeiro, destino contratual e congelamento |
| 3. Troca de administrador quebrava venda | Reserva, isenção e estoque consultavam owner enquanto o saldo não se movia | `treasury` imutável separada de owner; registro de cotas também usa tesouraria | Compra e proteção de reserva após aceite; integração preserva cotas de participante que assume administração |
| 4. Oito semestres antecipados | Contador sem datas mínimas | Oito encerramentos civis calculados de validFrom; ano bissexto; reporte sequencial só depois do fechamento | Um segundo antes e instante exato de cada encerramento; nono reporte bloqueado |
| 5. Royalties sem saldo irrecuperáveis | Exigia saldo positivo | Recuperação exige saldo **ou** recebível; move obrigações por período, preserva pagos, funciona após expiração | Venda de toda posição, recuperação e saque; integração com cotas e revogação |
| 6. Pagamento primário externo | Entrega pelo administrador sem recebimento atômico | `buyPrimary`: comprador registrado paga stablecoin e recebe IBT; preço fixado uma vez; transferência direta da tesouraria bloqueada | Compra paga, falta de saldo/allowance, limite excedido sem cobrança; scripts Remix |
| 7. Casos de borda sem testes | Suíte não exercitava esses comportamentos | Regressões em EVM real, integração e teste dos scripts; duas falhas adicionais da revisão independente corrigidas | Relatório e comandos de reprodução |

Antes da correção, cinco testes reproduziram: apuração precoce aceita; recuperação para admin aceita; venda quebrada após troca; múltiplas carteiras acima do teto; recuperação de recebível sem saldo rejeitada. A nova suíte exige os comportamentos corretos. O identificador por pessoa foi incorporado ao cenário de concentração depois de reproduzir o problema original, pois a versão antiga não possuía esse campo.

## Decisões e alternativas

**Identidade e privacidade.** `bytes32` deriva de UUID aleatório do cadastro, não de CPF. CPF pseudonimizado por HMAC permanece no serviço. O contrato impõe teto sobre o identificador cadastrado; criar fraudulentamente IDs distintos para a mesma pessoa continua risco do emissor/KYC. Vínculos entre carteiras do mesmo identificador ficam publicamente correlacionáveis. Assinatura prova controle de chave, não identidade civil. Reatribuir cadastro existente foi proibido para evitar contornar o teto.

**Governança e tesouraria.** Foi escolhida tesouraria imutável em vez de mover mais de cem unidades na aceitação de cada novo owner. A troca de governança passa a conservar estoque, reserva e obrigações. O custo é não haver rotação da tesouraria nesta implantação. Sua custódia merece carteira institucional; uma multisig poderia ser owner e/ou tesouraria desde o deploy, mas nenhuma multisig foi implantada nesta revisão. O backend de participantes continua limitado a autenticação EOA.

**Recuperação.** Prazo fixo de 48 horas dá uma janela observável para contestação; não é política jurídica presumida da IBITI. Durante a espera, origem/destino não movem IBT e não se paga à origem. O titular ou owner pode cancelar mesmo na pausa. A geração administrativa (`ownershipEpoch`) invalida anúncios após qualquer aceite, inclusive A → B → A. A execução admite saldo zero e mantém pagamentos já realizados no endereço histórico. O destino não pode ter código de contrato no anúncio nem na execução. Esse fluxo recompõe acesso da mesma pessoa; sucessão para outra pessoa exige procedimento separado, não implementado como uma brecha de transferência forçada.

**Calendário e corte.** Semestres civis em UTC, com validFrom no início do ano e validUntil no último segundo do quarto ano. Foi descartada a divisão por 182/183 dias constantes, que erra anos bissextos e fechamentos. A trava impede consumir períodos futuros, mas não obriga reporte pontual. Fotografar no reporte foi preservado; um checkpoint no encerramento reduziria o poder sobre a data de corte, ao custo de histórico de saldos e outra definição econômica. Atrasos podem alterar os beneficiários em relação ao fim contábil. Isso consta do whitepaper; não se promete fotografia retroativa.

**Compra.** Stablecoin configurada habilita somente compra pelo próprio comprador a preço unitário fixo, com aprovação ERC-20 prévia e entrega/cobrança atômicas. O contrato exige o recebimento exato na tesouraria; não suporta moeda com taxa/rebasing. Sem stablecoin, a modalidade externa permanece explicitamente dependente do pagamento e da entrega administrativos; configurar stablecoin desativa essa entrega. A atomicidade elimina o risco de pagamento on-chain sem IBT, mas não comprova qualidade de KYC, receita ou hospedagem.

**Preço e modelo consolidado.** O exemplo usa 37.055,19 tBRL/IBT, ou 37.055.190.000 unidades de seis decimais. A planilha conserva precisão integral: sua referência de 100 IBT é R$ 3.705.518,67, enquanto 100 compras ao preço arredondado somam 3.705.519,00 tBRL. Não houve revisão de valuation nem promessa comercial. O memorando jurídico consolidado não foi fornecido com este feedback nem localizado no repositório; não foram inventadas cláusulas de sucessão, custódia, oferta ou aprovação regulatória. A coerência jurídica final deve ser conferida contra esse documento pelo grupo.

## Relação com os oito critérios

| Critério / nota da Parte 1 | Melhoria e forma de conferir |
| --- | --- |
| 1. Coerência operacional — 1,00/1,25 | Teto pessoal economicamente efetivo, calendário e compra atômica; testes de movimentação e reporte |
| 2. Alinhamento documental — 1,05/1,25 | Whitepaper atualizado em cadastro, compra, governança, circulação e apuração; distinção entre código local e deploy histórico |
| 3. Compreensão operacional — 1,15/1,25 | Guia reproduz cadastro → assinatura → vínculo on-chain → compra → cotas → recuperação → royalties |
| 4. Decisões técnicas — 1,00/1,25 | Alternativas e custos explicitados acima, inclusive tesouraria imutável, corte e espera |
| 5. Adaptação ao projeto — 1,15/1,25 | 150 IBT indivisíveis, reserva 50, teto 20 por pessoa, 15%, oito semestres e unused-first-v1 preservados |
| 6. Clareza e consistência — 1,05/1,25 | Núcleo de transferência comum, erros/eventos explícitos, segregação de papéis, testes e scripts atualizados |
| 7. Arquitetura e economia — 1,05/1,25 | Limite de posição limita participação futura; royalties pendentes não dependem de saldo; cotas não são recriadas |
| 8. Maturidade — 0,95/1,25 | Regressões primeiro, revisão independente, teste temporal, limites residuais e migração/deploy declarados |

Esta matriz explica o que mudou e por quê; não presume a nota da nova avaliação.

## Limites remanescentes e publicação

O administrador ainda atesta identidade e receita, pode pausar e reduzir reserva. Recuperação com anúncio não elimina abuso coordenado do cadastro nem dispensa acompanhar eventos. Não há oracle de faturamento, execução automática de apuração, hotel real, KYC real, sucessão entre pessoas ou auditoria formal de produção. Não há mudança de supply nem queima por hospedagem.

A versão técnica 3 requer nova publicação e banco de integração próprios. Não apontar o frontend/backend de produção para outro endereço sem conciliar pessoas, saldos, cotas e obrigações. As fontes v1/v2 e seus recibos foram preservados. O pacote local da Parte 2 foi preparado para revisão e envio; nenhum push ou deploy público foi realizado nesta tarefa.
