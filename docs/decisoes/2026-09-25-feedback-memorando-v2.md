# Feedback para revisão do memorando de oferta v2

25/09/2026 · Revisão de coerência com a implementação local em preparação para a versão oficial v2 do IBIToken e com as decisões desta conversa.

**Destinatário:** integrante responsável pelo memorando. **Formato:** comentários pontuais, com indicação de página, motivo e texto substituto sugerido. Nenhuma alteração foi feita no PDF original. Os textos podem ser adaptados pelo autor, preservando as distinções entre implementação existente, desenho aprovado e condições ainda abertas.

**Fonte revisada:** `Memorando_de_Oferta_IBIToken_Corrigido.pdf`, 14 páginas, capa setembro/2026. SHA-256: `959d48a3d2894fc676b51fed65ba4a9143859a559dca2d59afb1fe5b43178a42`.

A numeração abaixo é a página impressa do PDF. A revisão é técnica e operacional: não constitui validação jurídica da oferta, da taxa de desconto ou das projeções. Alterações de valuation continuam sob responsabilidade do autor financeiro; não substituí números automaticamente.

Referências de implementação: [contrato](../../smart-contract/contracts/IBIToken.sol), [calendário](../../smart-contract/contracts/OpeningCalendar.sol), [portal e limitações](../../offchain/PORTAL.md), [inventário completo de mudanças](2026-09-25-inventario-completo-token.md).

## 1. Validade não é o mesmo que horizonte da planilha

**Onde:** p.3, Termos de Oferta, linha “Horizonte de projeção do royalty / validade do token”; p.6, “Validade e encerramento”; p.8, projeções 2027–2030.

**Ponto em desacordo:** o PDF funde 2027–2030 e validade de quatro anos. O modelo aprovado conta quatro anos a partir da abertura comercial regular, sem exigir janeiro.

**Por quê:** `recordOpening`, `validFrom`, `validUntil` e `periodEnd` usam o marco de abertura. A projeção financeira não comprova que o empreendimento abre em 2027, nem fixa o dia.

**Texto sugerido para substituir a linha da tabela:**

> Horizonte financeiro da projeção: 2027–2030, como premissa do modelo apresentado. Vigência operacional do IBIToken: quatro anos contados da abertura comercial regular do Glamping, registrada como marco único no contrato. A data efetiva de abertura deverá ser confirmada pela operação; não decorre automaticamente do horizonte da planilha.

**Complemento sugerido para p.6:**

> Os oito semestres acompanham os aniversários de seis meses da abertura. O último período termina no aniversário de 48 meses. Para datas inexistentes no mês de destino, utiliza-se seu último dia, sempre preservando como referência a data original da abertura.

**Apuração da data:** não encontrei anúncio oficial que confirme dia/mês de abertura deste empreendimento. O [site da IBITI, publicação de 07/01/2026](https://ibiti.com/pt-br/descubra-o-ibiti-e-viva-a-natureza-como-voce-nunca-imaginou/), menciona Glamping entre modalidades de hospedagem, mas não identifica a data de inauguração do projeto objeto deste token. O PDF p.8 fornece uma projeção, não uma estimativa operacional confirmada. Não substituir essa lacuna por 1º de janeiro.

## 2. Narrativa de captação antes da abertura

**Onde:** pp.3–4, justificativa de antecipação de recursos; p.10, parágrafo final do quadro dos fluxos, que situa o início dos royalties “anos depois” da compra.

**Ponto em desacordo:** a redação sugere compra anterior ao início da operação. A pré-venda foi retirada nas decisões posteriores.

**Por quê:** o contrato agora bloqueia aquisição antes da abertura. Inscrição em waitlist pode antecedê-la, mas não gera cobrança, tokens ou cotas.

**Texto sugerido:**

> O cadastro de interessados e a análise de elegibilidade podem ocorrer antes da abertura, sem aquisição de tokens ou cobrança. A compra primária é disponibilizada após o marco de abertura comercial. A captação antecipa o valor de fluxos de royalties ainda futuros dentro dos quatro anos de vigência, sem destinar os recursos à construção do Glamping.

**Observação para o autor financeiro:** retirar a pré-venda pode exigir rever o instante de captação adotado no fluxo descontado. Isso deve ser avaliado na modelagem, sem simples troca de datas ou alteração automática dos números neste feedback.

## 3. Retirada integral do mercado secundário

**Onde:** p.3, termos de transferência; p.5, “Transferência”; p.6, ciclo de vida, parágrafo sobre circulação e linha “Transferibilidade”; p.7, regras de circulação e direitos que acompanham a unidade; p.13, risco de liquidez.

**Ponto em desacordo:** o documento permite transferências entre carteiras aprovadas e trata um eventual secundário como algo a validar. A decisão vigente retirou esse mercado.

**Por quê:** `transfer` e `transferFrom` comuns estão bloqueados, inclusive entre titulares já aprovados. Aprovar a carteira não concede permissão de revenda. Compra primária e recuperação da mesma pessoa são exceções específicas.

**Texto substituto para circulação:**

> O modelo não oferece mercado secundário nem permite transferências ordinárias do IBIToken, mesmo entre participantes aprovados. A movimentação admitida compreende a entrega na compra primária e a recuperação autorizada de acesso da mesma pessoa, com preservação de seus direitos e histórico. Não há promessa de recompra ou de liquidez de saída pela IBITI.

**Substituição da linha “Transferibilidade”, nas duas colunas da p.6:**

> Transferência ordinária indisponível. Recuperação da mesma pessoa sujeita a procedimento específico.

**Ciclo sugerido:**

> Cadastro e aprovação → compra primária após abertura → posse e participação temporal → solicitação/uso de experiência no sistema externo → manutenção dos demais direitos até o fim da vigência → liquidação dos recebíveis remanescentes.

**Substituição do risco de liquidez, p.13:**

> A aquisição não dispõe de canal de revenda ou transferência ordinária. O participante deve avaliar sua permanência no modelo durante a vigência, sem expectativa de saída por mercado secundário ou recompra. A mitigação é informação clara anterior à compra; não pressupõe um mercado que o projeto decidiu não implementar.

## 4. Hospedagem é uma cota no sistema externo, não marca de resgate de um ERC-20

**Onde:** pp.5–7, afirmações sobre smart contract registrar token resgatado, identificar unidades utilizadas e transferir direitos remanescentes.

**Ponto em desacordo:** o PDF descreve um controle individual de resgate por token no contrato. O IBIToken é fungível e não possui `markRedeemed` nem ID individual de unidade.

**Por quê:** a compra conciliada atribui cotas à pessoa. Solicitação compromete cotas, confirmação conserva compromisso e conclusão registra consumo no livro off-chain. Saldo de IBT e royalty não são reduzidos pela hospedagem.

**Texto sugerido:**

> O direito de hospedagem é controlado em um livro externo associado à pessoa verificada. Cada IBT adquirido corresponde a uma experiência durante a emissão, sem renovação automática. A solicitação compromete uma cota disponível e a conclusão registra seu uso. O contrato não marca unidades individuais como resgatadas nem queima IBT por hospedagem. O saldo do token e a participação econômica permanecem sujeitos às suas próprias regras.

**Ajuste de terminologia:** na tabela da p.6, descrever “cota de experiência consumida” em lugar de “token resgatado”. Remover cenários sobre uma utilidade que acompanha revenda, pois ela foi retirada.

## 5. Limite agregado por pessoa também é imposto on-chain

**Onde:** p.3, “Limite de titularidade por carteira”; p.7, dois parágrafos que dizem que o agregado depende inteiramente do backend.

**Ponto em desacordo:** isso descreve a versão anterior à correção do professor.

**Por quê:** `personOf` liga carteiras a identificador opaco e `personBalance` aplica 20 IBT sobre a soma, além do teto por carteira. A verificação civil continua externa.

**Texto sugerido:**

> O limite de titularidade é de 20 IBT por pessoa, considerando conjuntamente todas as suas carteiras vinculadas, e também de 20 por carteira. O contrato aplica esse limite por meio de um identificador opaco registrado após verificação externa. Nome, CPF e documentos permanecem fora da blockchain. A tesouraria institucional é a exceção prevista para manter estoque e reserva. A eficácia do vínculo depende da identificação correta e da prevenção de cadastros duplicados pela operação.

Evitar a afirmação de que o contrato comprova identidade ou elimina fraude documental por si só.

## 6. Royalty por quantidade e tempo, não por fotografia do saldo

**Onde:** p.5, elegibilidade no momento da distribuição; p.10, Fluxo B, linhas 4 e 5 e descrição do cálculo; p.11, continuação e quadro sobre quem recebe e como recebe.

**Ponto em desacordo:** a v2 repete saldo no corte, saldo corrente e saldo no momento da apuração. Todos foram substituídos pela regra aceita de tempo de posse.

**Por quê:** o contrato registra peso por semestre; atraso administrativo e compra no último dia não fazem o comprador receber como se tivesse mantido o saldo desde o início.

**Texto principal sugerido:**

> O royalty total de cada semestre corresponde a 15% da receita bruta elegível informada para o período. A parcela de cada carteira considera a quantidade de IBT e o tempo durante o qual essa quantidade foi mantida dentro do semestre, com precisão em segundos. O denominador corresponde aos 150 IBT multiplicados pela duração integral do semestre. Compras posteriores ao fechamento não participam do período encerrado, mesmo que sua apuração ocorra depois.

**Fórmula sugerida, se couber no documento executivo:**

> Parcela = royalty do semestre × soma(quantidade de IBT × tempo de posse no semestre) ÷ (150 × duração do semestre), com arredondamento por carteira na unidade da moeda de pagamento.

**Exemplo opcional:**

> Em um semestre hipotético de 180 dias, cinco IBT mantidos durante todo o período e um adicional adquirido no último dia produzem participação equivalente a 5 + 1/180 IBT médios. O sexto token não recebe o semestre inteiro.

**Limite que deve permanecer claro:** o cálculo pondera a receita total do semestre pelo tempo de posse; não apura a receita produzida em cada dia. As parcelas de uma pessoa são somadas entre suas carteiras, com arredondamento por carteira.

## 7. Calendário semestral é uma trava do contrato

**Onde:** p.10, Fluxo B, linha 5; p.11, “Qual a periodicidade da distribuição?”.

**Ponto em desacordo:** o texto diz que apenas o limite de oito períodos é on-chain e que o espaçamento semestral não é imposto pelo código.

**Por quê:** cada período tem encerramento calculado da abertura. Reporte antecipado reverte sem consumir um semestre.

**Texto sugerido:**

> A vigência possui oito períodos consecutivos de seis meses, calculados a partir da abertura registrada. O contrato impede apuração antes do encerramento do respectivo período e exige sequência. Encerramento do semestre, preparação/revisão do relatório, depósito e saque são etapas distintas. A apuração continua exigindo iniciativa da operação; a passagem da data não executa uma transação automaticamente.

**Manter em aberto:** prazo máximo para entregar relatório e disponibilizar recursos. Não incluir 30 dias como compromisso aprovado.

## 8. Reserva, estoque ainda não vendido e participação da tesouraria

**Onde:** pp.3, 6–7, oferta 100/reserva 50; pp.10–11, referência à reserva participante no royalty.

**Ponto a complementar:** é correto apresentar reserva inicial de 50 e oferta inicial de 100, mas isso não descreve todo o saldo da tesouraria nem a possibilidade aceita de liberar reserva para venda.

**Por quê:** a tesouraria começa com 150, conserva estoque ainda não vendido e participa pelo tempo em que o mantém. A reserva pode ser reduzida, sem nova emissão; se todo estoque for vendido, pesos anteriores continuam devidos.

**Texto sugerido:**

> A emissão contém 150 IBT, com 100 inicialmente disponíveis para aquisição e 50 inicialmente protegidos como reserva. A IBITI pode deliberar pela liberação de unidades da reserva para venda primária, sem criar novos tokens. A tesouraria participa dos royalties conforme seu saldo ponderado pelo tempo, incluindo o estoque não vendido. A liberação de reserva não representa venda automática nem altera a oferta total.

**Ressalva de implementação:** a fonte atual permite redução pelo owner. A aprovação conjunta pretendida precisa ser implementada antes de o memorando a apresentar como controle efetivo.

## 9. Administrador e tesouraria são funções distintas

**Onde:** p.10, Fluxo A, linha 3; p.11, quem recebe recursos da emissão.

**Ponto em desacordo:** “carteira administrativa” pode dar a entender que trocar administrador muda automaticamente o estoque ou o recebedor.

**Por quê:** `treasury` é estável e separado de `owner()`. O endereço inicial é o mesmo no construtor, mas suas funções e efeitos da substituição são diferentes.

**Texto sugerido:**

> O pagamento da compra primária é destinado à tesouraria definida no contrato. O endereço que exerce a administração do smart contract pode ser substituído pelo procedimento próprio, sem deslocar automaticamente estoque, reserva ou recursos da tesouraria. O desenho aprovado prevê controle institucional da tesouraria por duas de três assinaturas; essa configuração operacional ainda precisa ser implantada.

## 10. Compra primária com pagamento e entrega na mesma transação

**Onde:** p.10, Fluxo A, linhas 2 e 3; complementar requisitos de aquisição nas pp.3 e 7.

**Ponto em desacordo:** o quadro sugere que o investidor paga e a carteira administrativa registra manualmente a entrega como fluxo geral.

**Por quê:** com moeda configurada, `buyPrimary` cobra a carteira compradora e entrega IBT atomicamente; a aprovação administrativa é etapa cadastral anterior. No modo de custódia IBITI, o operador assina com a carteira dedicada mediante consentimento do participante.

**Texto sugerido:**

> Após aprovação cadastral e habilitação da carteira, a compra primária com moeda configurada exige autorização do valor e execução de uma transação que transfere o pagamento à tesouraria e entrega os IBT ao comprador. Se essa transação falhar, cobrança e entrega são revertidas conjuntamente. Cada pedido possui referência protegida contra liquidação duplicada. O reconhecimento das cotas ocorre após confirmação e conciliação dos eventos pelo serviço externo.

**Complemento sobre limites:**

> A aquisição prévia da moeda de pagamento, conversão de reais, taxas de rede e aprovação de gasto não são abrangidas por essa atomicidade. PIX e conversão automática não estão integrados ao portal. A moeda e os prestadores para uma operação real continuam sujeitos à definição do projeto.

Não remover a distinção entre captação e royalty: são fluxos diferentes e essa separação do memorando permanece correta.

## 11. Arredondamento e destino do resíduo

**Onde:** pp.10–11, “sem casas decimais fracionárias em blockchain”, resíduo de “poucos centavos” e afirmação de que permanece no contrato.

**Ponto em desacordo:** indivisibilidade do IBT não elimina casas decimais da stablecoin. Além disso, o contrato recebe a soma das obrigações, não necessariamente o royalty total antes do rateio.

**Por quê:** `royaltyAmount` é o total de 15% arredondado; `totalDue` soma parcelas arredondadas por carteira. O depósito exige `totalDue`. A diferença não é automaticamente transferida para o contrato.

**Texto sugerido:**

> Os cálculos são arredondados para baixo na menor unidade da moeda configurada. Os IBT são indivisíveis, mas a moeda de pagamento pode possuir casas decimais. O depósito corresponde à soma dos valores efetivamente registrados para as carteiras. A diferença entre o royalty calculado e essa soma não é depositada automaticamente, devendo receber tratamento contábil e destinação expressamente definidos pela operação.

Não estimar o resíduo em centavos de real antes de fixar moeda e regra de conversão.

## 12. Fim da vigência não apaga valores a receber

**Onde:** p.6, parágrafos sobre encerramento dos direitos; referências similares na descrição da economia do participante.

**Ponto a precisar:** encerramento indiscriminado pode ser lido como perda de royalty já devido ou impossibilidade de apurar o último semestre.

**Por quê:** o contrato permite reporte de semestre encerrado, saque e recuperação de recebíveis após a expiração. A acumulação temporal para no término da vigência.

**Texto sugerido:**

> O encerramento da vigência impede novas aquisições e encerra o período de geração de participação econômica e de utilização ordinária dos benefícios. Não elimina valores de royalties já devidos relativos a períodos vigentes, inclusive aqueles cuja apuração ocorra posteriormente. Esses recebíveis permanecem sujeitos à liquidação e, quando necessário, à recuperação de acesso.

Condições de atendimento a reservas e indisponibilidade próximas ao encerramento devem continuar identificadas como regras operacionais a consolidar, sem extensão automática presumida.

## 13. Recuperação da mesma pessoa e seu estado real de implementação

**Onde:** inserir na descrição operacional, pp.5–7, e em controles/riscos, pp.11–13.

**Lacuna:** o documento não explica como preservar direitos diante de perda de chave, nem distingue recuperação de sucessão.

**Por quê:** a implementação impede destino administrativo/tesouraria, exige anúncio de sete dias e conserva saldo, recebíveis e tempo ainda não apurado. Ainda não obriga segundo aprovador nem integra todo o atendimento externo.

**Texto sugerido:**

> A recuperação de acesso é restrita à mesma pessoa e não constitui transferência por venda ou sucessão. A fonte atual exige anúncio público com referência ao processo, espera de sete dias corridos e destino permitido, preservando saldo, recebíveis não pagos e contribuição temporal ainda não apurada. A carteira antiga é revogada. O procedimento aprovado para a operação acrescenta revalidação de identidade, prova da nova carteira, contato pelos canais anteriores, revisão independente e contestação capaz de impedir a execução na cadeia; essas etapas ainda precisam ser integradas e exigidas integralmente pelo sistema.

**Complemento de transparência:**

> Um protocolo externo de contestação não suspende sozinho uma transação. Na fonte atual, cancelamento on-chain pode ser feito pelo titular ou administrador; a automação da ponte entre atendimento e bloqueio continua pendente. Documentos pessoais ficam fora da blockchain, com referência verificável ao dossiê.

Não prometer herança automatizada ou afirmar que `Ownable2Step` já obriga dois aprovadores de recuperação.

## 14. Governança por pilares: desenho aprovado versus controle existente

**Onde:** p.11, mecanismos de controle; pp.12–13, operação, transparência e riscos.

**Ponto a atualizar:** proprietário único ainda é uma limitação real. Porém, o desenho aprovado já prevê responsabilidades separadas; “sem timelock” também precisa ser qualificado porque há espera específica para recuperação.

**Texto sugerido:**

> O desenho aprovado separa cadastro/atendimento, financeiro, segurança e supervisão, com revisão independente de atos críticos e controle conjunto sobre mudanças dos próprios responsáveis. A implementação local já possui contas individuais e permissões no portal, tesouraria distinta da administração e espera específica para recuperação. O contrato ainda concentra poderes no owner e não implementa integralmente as aprovações conjuntas, a pausa por atividade ou a tesouraria 2 de 3. Esses controles devem ser tratados como pendências de implementação, não como mecanismos já operacionais.

**Sobre pausa:** a fonte ainda tem pausa global, inclusive sobre saques. A proposta aceita é conter apenas atividades afetadas e preservar saque quando pagamentos não estiverem comprometidos. Não apresentar essa seleção como já disponível.

## 15. Três modalidades de custódia

**Onde:** p.11, afirmação de que a referência suporta apenas autocustódia e que inexiste custódia institucional.

**Ponto em desacordo:** o portal atual já representa os três percursos aceitos. EOA é tipo técnico de conta, não sinônimo de autocustódia pelo participante.

**Texto sugerido:**

> A jornada oferece custódia IBITI, autocustódia assistida e autocustódia direta. Na primeira, um operador controla uma carteira dedicada ao participante, que consente no pedido por sua conta e utiliza o portal sem operar a carteira diretamente. Nas outras duas, as chaves permanecem com o participante, com ou sem orientação da equipe. A preferência pode mudar antes do envio da compra; transações já enviadas precisam ser conciliadas. O servidor de operação não integra a guarda institucional das chaves. Um adaptador separado permite ensaiar o fluxo completo com carteiras e fundos sintéticos na rede local; isso não representa infraestrutura real de custódia, backup ou recuperação institucional contratada.

**Complemento útil:** login de conta e controle de carteira são camadas diferentes. Solicitar hospedagem não exige nova assinatura de carteira. O multisig da tesouraria não substitui o serviço de custódia de cada participante.

## 16. Jornada de cadastro e waitlist funcional

**Onde:** complementar acesso/elegibilidade, pp.3 e 7, e jornada de aquisição, p.10.

**Lacuna:** não aparece o processo integrado implementado nem o prazo de resposta aprovado.

**Texto sugerido:**

> O interessado cria uma conta e ingressa em uma lista de análise. A equipe avalia informações pertinentes à identidade, contato, ciência dos direitos e limite pessoal, usando checklist provisório. O prazo operacional adotado é de cinco dias úteis a partir do cadastro completo, com suspensão durante a espera por complementação. A decisão registra responsável, motivo e resposta ao candidato. Aprovação não entrega tokens ou cotas: habilitação de carteira, pagamento e confirmação da compra são etapas posteriores ligadas à mesma pessoa.

**Complemento de limite:**

> O modelo pretendido de identificação combina verificação independente e seleção pela IBITI. A versão acadêmica não possui fornecedor de KYC integrado nem comprova autenticidade documental apenas por validação de CPF ou aprovação de checklist. Resultado é acompanhado no portal; comunicação por e-mail e MFA ainda não estão integrados.

## 17. Cancelamento manual provisório e continuidade da conta

**Onde:** descrição da experiência nas pp.5–7 e condições/risco operacional na p.12.

**Lacuna:** faltam a política vigente de cancelamento e a continuidade de atendimento após a aquisição.

**Texto sugerido:**

> O participante utiliza a mesma conta para acompanhar sua aprovação, compra e cotas, sem fornecer novamente a carteira ao solicitar hospedagem. O cancelamento de uma reserva é analisado manualmente pela equipe. Enquanto houver análise, a cota permanece comprometida; a decisão fundamentada pode autorizar sua devolução integral, retenção ou negar o pedido. Não há crédito fracionário automático. Cancelar hospedagem não cancela a compra do IBT nem seus royalties, e devolver cota não prorroga a vigência.

**Cuidado editorial:** não aplicar automaticamente percentuais de uma política hoteleira em dinheiro a cotas indivisíveis. A última decisão do grupo substituiu expressamente a proposta de meia cota acumulável.

## 18. Origem e revisão do faturamento

**Onde:** p.10, Fluxo B, etapas 1–3; p.11, controles; p.13, transparência.

**Ponto a complementar:** contrato calcula 15% e exige financiamento atômico, mas isso não comprova receita verdadeira ou revisão independente.

**Texto sugerido:**

> A receita bruta é apurada fora da blockchain com documentação verificável. O desenho operacional prevê preparação, conciliação e revisão por outra pessoa antes do registro. O contrato aplica a alíquota de 15%, registra a referência do relatório e, no modo on-chain, exige o depósito das obrigações na mesma transação. A integridade de uma referência documental não comprova a veracidade da receita. Base detalhada, prazo de entrega e procedimento de retificação devem ser formalizados; o fluxo de dupla aprovação ainda precisa ser implementado.

A implementação atual também aceita referência de relatório vazia (`bytes32(0)`); o processo de revisão deve exigir documentação efetiva, e o endurecimento dessa validação contratual permanece um ajuste possível.

Manter como questões abertas caixa/competência, impostos, descontos, estornos, receitas de terceiros, retificações e destinação de resíduos. Não escolher um tratamento contábil por inferência técnica.

## 19. Preço e valuation: divergência entre versões, sem substituição automática

**Onde:** pp.3, 8–10, 12 e 14; p.3 também menciona R$ 53.008,93 de uma versão antiga do whitepaper.

**Constatação:** o memorando usa R$ 34.874,14 por IBT, taxa de 20,46% e VP de R$ 5.231.121,38. O whitepaper revisado disponível e exemplos técnicos anteriores usam R$ 37.055,19 e taxa de 17,8609%. A implementação de checkout lê o preço configurado no contrato; não recalcula CAPM/WACC.

**Atualização de implementação:** por decisão expressa de Gabriel, a simulação e a nova demonstração local adotam a referência de R$ 34.874,14. O preço anterior de 100 tBRL era uma configuração de ensaio e deixou de ser a referência da demonstração atual. Não se recalculou o valuation nem se alteraram compras históricas.

**Por que isso precisa ser revisado:** descrever duas referências como se fossem o mesmo modelo consolidado confunde preço indicativo, preço efetivo e fonte financeira. O novo valor do PDF não é, por si, um bug de código ou número a corrigir para a versão antiga.

**Texto sugerido:**

> O preço indicativo deste memorando decorre do modelo financeiro e da taxa de desconto aqui identificados. A simulação e o novo ambiente local de testes já utilizam a referência unitária de R$ 34.874,14; o whitepaper histórico e a configuração de uma eventual operação real ainda precisam ser conciliados. Exemplos locais em moeda fictícia não constituem preço comercial. A compra utiliza o preço unitário efetivamente configurado no contrato, que não atualiza automaticamente suas premissas a partir do memorando.

**Ajustes pontuais para o autor:**

- Identificar a versão/data da planilha que sustenta R$ 34.874,14 e 20,46%, e atualizar a referência ao whitepaper antigo na p.3.
- Explicar que `100 × R$ 34.874,14 = R$ 3.487.414,00`, enquanto a captação indicativa de R$ 3.487.414,25 resulta aparentemente de preço com precisão integral antes do arredondamento. Confirmar a planilha e distinguir projeção integral de cobrança a centavos fixos.
- Reavaliar premissas de aquisição na abertura, compras posteriores com participação temporal e eventual redução de reserva. Não apresentar o retorno integral de quatro anos como se toda compra em qualquer data o recebesse.
- Não converter automaticamente R$ 34.874,14 em quantidade de uma moeda referenciada ao dólar; faltam regra cambial, cotação e prestador.

Não alterei o valuation, a planilha, os preços históricos nem o PDF.

## 20. Exemplo de retorno ao investidor deve declarar a data de entrada

**Onde:** pp.11–12, “Economia do investidor: retorno projetado por token ao longo de 4 anos”, e síntese da p.14.

**Ponto a precisar:** a projeção de um token durante quatro anos não é o direito de quem compra perto de um fechamento ou após parte da vigência.

**Texto sugerido junto da tabela:**

> O exemplo considera aquisição no início da vigência e manutenção durante todo o horizonte apresentado. Aquisições posteriores participam somente pelo tempo efetivo restante, conforme o rateio temporal de cada semestre, sem recuperar receitas anteriores nem prorrogar a validade do token. Os valores continuam condicionados à receita efetiva e às premissas explicitadas na projeção.

Isso ajusta a interpretação do exemplo sem recalcular os números do autor.

## 21. Privacidade e trilha de auditoria

**Onde:** p.13, “Privacidade e sigilo comercial”; complementar governança/cadastro.

**Ponto a precisar:** “anonimizados” pode exagerar a proteção, pois carteiras e identificadores opacos continuam correlacionáveis.

**Texto sugerido:**

> Dados civis e documentos de verificação permanecem fora da blockchain, com acesso restrito por função. A cadeia registra endereços, identificadores opacos, valores e referências necessárias à operação. Essa separação reduz exposição direta, mas não assegura anonimato das transações. O portal registra acessos e decisões identificados; sua trilha local em banco de dados não é, por si só, um registro público imutável.

Não prometer armazenamento seguro completo, retenção legal definida ou integração de fornecedor que ainda não existe.

## 22. Referência técnica e remissão editorial

**Onde:** pp.10–11, referências à implementação “v2”; p.14, remissão a “perguntas em aberto (Seção 13)”.

**Identificação de versão:** a referência à implementação **v2** está correta como nome da próxima versão oficial e da segunda entrega. Até esta revisão, somente a v1 foi publicada. “v4” identifica uma revisão interna de desenvolvimento e testes, que será consolidada na v2 oficial ao final da validação; não representa uma quarta publicação. Não é necessário substituir “v2” por “v4” no memorando.

**Ponto editorial em desacordo:** a seção 13 do documento é a conclusão, não uma lista de perguntas.

**Texto sugerido de identificação:**

> Este memorando descreve o modelo da versão oficial v2 do IBIToken, em preparação para a segunda entrega acadêmica. As revisões internas de desenvolvimento e testes serão consolidadas nessa versão ao término da validação. Até então, a única versão publicada é a v1; suas transações e evidências não comprovam as funcionalidades adicionadas à v2, e alterações no código local não modificam o contrato já publicado.

**Ação editorial:** corrigir a remissão da p.14 para a seção efetiva de pendências ou inserir a lista correspondente. Evitar atribuir funcionalidades novas às transações históricas usadas em evidências.

## O que pode ser preservado

Continuam coerentes: caráter acadêmico e condições de validação externa; distinção entre captação e royalty; 150 unidades indivisíveis; oferta e reserva **iniciais** de 100/50; 15% de receita bruta; experiência sem queima do saldo por hospedagem; ausência de participação societária; dependência da receita efetiva; transparência sobre hipóteses econômicas.

## Ordem prática para o colega revisar

1. Corrigir as afirmações executáveis: tempo de posse, calendário, ausência de secundário, cotas off-chain e teto pessoal.
2. Ajustar aquisição após abertura, exemplo econômico, tesouraria e fluxo de compra.
3. Acrescentar jornada, três custódias, cancelamento manual e recuperação com sete dias.
4. Separar salvaguardas existentes de governança ainda pendente; qualificar resíduos, privacidade e receita.
5. Conciliar versões financeiras/referências e corrigir a remissão editorial. Preservar a decisão do autor sobre os números após conferência da planilha.
