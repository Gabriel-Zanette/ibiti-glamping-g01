# Inventário consolidado de mudanças — IBIToken e jornada integrada

25/09/2026 · Parte 2 acadêmica · fonte contratual técnica v4.

Este documento consolida o feedback do professor, Q1–Q17, as 12 anotações e os aceites posteriores desta conversa. Separa comportamento **implementado na fonte local**, decisões **aceitas ainda pendentes** e questões **em aberto**. Aprovação do desenho pelo grupo não significa homologação institucional, contratação de serviços nem auditoria de produção. As fontes e recibos históricos permanecem históricos; alterações locais não modificam contratos já publicados.

## 1. O que mudou na direção do projeto

| Tema | Ponto de partida / proposta intermediária | Decisão vigente e estado |
| --- | --- | --- |
| Participação econômica | Fotografia do saldo na apuração; alternativa intermediária de fotografia no fechamento. | **Implementado:** posição ponderada por quantidade × segundos dentro de cada semestre. |
| Vigência | Janeiro/2027–dezembro/2030, confundindo projeção financeira com operação. | **Implementado:** quatro anos e oito semestres desde a abertura informada. A data oficial não foi confirmada. |
| Pré-venda | Aquisição poderia anteceder a operação. | **Implementado:** cadastro antecipado é possível; compra antes da abertura é bloqueada. |
| Secundário | Transferências entre titulares e proposta de entrada de participantes aprovados via revenda. | **Implementado:** retirada integral de transferências ordinárias; compra primária e recuperação da mesma pessoa preservadas. Sem promessa de recompra. |
| Identificação | Teto efetivo por carteira; agregação pessoal só no acesso à hospedagem. | **Implementado:** identificação opaca e teto pessoal de 20 no contrato; identidade civil e autenticidade continuam externas. |
| Governo | Owner único operava tudo. | **Parcial:** tesouraria separada e acessos individuais no portal. Pilares, dupla aprovação crítica e administração conjunta de papéis ainda pendentes no contrato. |
| Recuperação | Transferência imediata, inclusive para administrador; saldo positivo obrigatório. | **Parcial:** destino restrito, anúncio, sete dias, cancelamento, preservação de recebíveis e tempo. Revisão independente e atendimento de recuperação integrado ainda pendentes. |
| Custódia | Apenas autocustódia assistida/direta. | **Implementado na jornada:** três opções, incluindo custódia IBITI por carteira externa dedicada; serviço real de guarda de chaves não integrado. |
| Entrada | Formulário/protótipo e APIs separadas, sem jornada completa. | **Implementado:** waitlist persistente, conta, análise, habilitação, compra conciliada e cotas sob a mesma identidade. |
| Cancelamento | Propostas de 7/14/30 dias; consulta ao regulamento IBITI; meia cota chegou a ser aceita. | **Última decisão, implementada:** análise manual provisória. O aceite de meia cota foi expressamente substituído. |

## 2. Mudanças diretamente no token — on-chain

Fontes: [IBIToken.sol](../../smart-contract/contracts/IBIToken.sol), [OpeningCalendar.sol](../../smart-contract/contracts/OpeningCalendar.sol), [testes temporais](../../smart-contract/tests/time-weighted.test.ts), [regressões do feedback](../../smart-contract/tests/feedback.test.ts).

### 2.1 Emissão, identidade, concentração e tesouraria

1. Mantidos 150 IBT indivisíveis, emissão única, 15% de faturamento bruto e oito períodos. Não existe emissão comercial adicional nem queima pelo uso da hospedagem.
2. Construtor recusa oferta divergente de 150. Recuperação recompõe o saldo mediante queima/emissão técnica na mesma transação, sem aumentar a oferta final.
3. `registerWallet` vincula uma carteira a um identificador opaco `bytes32`; esse vínculo não pode ser reatribuído a outra pessoa.
4. Identificador on-chain não contém nome, CPF, documento ou hash simples de CPF. A relação civil fica no serviço externo.
5. `personBalance` soma carteiras da mesma pessoa; compra que excede 20 IBT pessoais reverte mesmo que cada carteira isolada fique abaixo de 20.
6. O teto de 20 por carteira também permanece. A tesouraria é a exceção explícita; assumir administração não transforma carteira pessoal em tesouraria.
7. Carteiras sem vínculo, revogadas ou envolvidas em recuperação não recebem novas compras.
8. `treasury` é um endereço imutável distinto da autoridade `owner()`, embora o construtor use inicialmente o mesmo endereço para ambos. Estoque, reserva, recebimento de compras e exceção ao teto consultam a tesouraria.
9. Trocar administrador não desloca tokens, não quebra o estoque primário e não elimina a proteção da reserva.
10. Reserva inicial de 50; redução apenas decrescente libera estoque para futura venda, sem criar tokens, executar venda ou alterar a oferta. Não há piso permanente de 50 incompatível com o aceite comercial do usuário.
11. `saleableUnits` considera saldo efetivo menos reserva. A reserva não pode ser aumentada e recomprimir estoque prometido à venda.
12. O contrato pode conter 50 de reserva e mais estoque não vendido. A participação econômica da tesouraria considera sua posição temporal integral, não apenas as 50 unidades.

**Limite:** um identificador opaco não impede cadastrar fraudulentamente a mesma pessoa sob dois identificadores. A qualidade do cadastro continua sendo requisito externo. A tesouraria 2 de 3 e aprovação conjunta de sua governança não estão implantadas; reduzir reserva ainda é poder unilateral do owner.

### 2.2 Abertura, duração e semestres

13. O contrato admite `validFrom=0` e `validUntil=0`, deixando a abertura pendente. Cadastros podem ser preparados nessa fase; compra e apuração ficam bloqueadas.
14. `recordOpening(openedAt, evidenceRef)` registra o marco uma única vez, requer data já ocorrida e referência documental não vazia, e publica evento `OpeningRecorded`.
15. O marco é o atendimento comercial regular aceito no desenho. O contrato verifica forma, autorização e unicidade do registro; não verifica fisicamente a abertura do hotel nem a veracidade do dossiê.
16. Os encerramentos são os aniversários de 6, 12, 18, 24, 30, 36, 42 e 48 meses, sempre calculados da data original em UTC.
17. Fim de mês é ajustado ao último dia do mês de destino, sem propagar o ajuste ao aniversário seguinte. Exemplo: 31/08/2027 15h → 29/02/2028 15h → 31/08/2028 15h.
18. Ano bissexto segue calendário gregoriano, incluindo as exceções de século. A implementação limita a abertura a antes de 01/01/2101 para manter cálculo limitado.
19. `validUntil` é o último segundo antes do aniversário de 48 meses. O intervalo econômico é `[validFrom, validUntil + 1)`; o instante exato de fechamento pertence ao próximo semestre.
20. Compra antes da abertura ou após expiração reverte. `isMember` exige marco registrado e vigência em curso.
21. `periodStart` e `periodEnd` tornam os limites consultáveis. Apuração é sequencial, após o respectivo encerramento; não é possível gastar antecipadamente os oito semestres.
22. Atraso de reporte não muda datas nem reinicia a vigência. Recebíveis não desaparecem na expiração; reporte final, saque e recuperação continuam possíveis.
23. Scripts padrão passam a publicar com abertura pendente e oferecem ação explícita de registro. Datas de testes são simulações identificadas, não estimativas oficiais.
24. Para compatibilidade técnica, o construtor também aceita um marco conhecido e o fim correspondente. Se o marco informado anteceder a publicação, o estoque inicial é contabilizado para a tesouraria desde esse marco; compradores nunca recebem peso anterior à aquisição. Essa modalidade pressupõe atestação correta e não comprova operação histórica.

**Em aberto:** autoridade/revisores e evidências oficiais da abertura; significado operacional da verificação contínua solicitada em Q2; efeitos de eventual interrupção prolongada. O código não inventa suspensão automática, extensão, compensação ou nova data de início.

### 2.3 Royalties proporcionais ao tempo

25. `_update` acumula o tempo antes de mudar saldos. Não é necessário executar uma transação por dia e não existe identificação individual por unidade fungível.
26. Cada semestre possui peso `soma(saldo anterior × segundos daquele saldo dentro do semestre)`.
27. `tokenSecondsOf(period, wallet)` permite consultar peso acumulado, incluindo o intervalo ainda não materializado. Nenhum tempo anterior à compra ou posterior ao encerramento entra no peso.
28. Fórmula: `totalRoyalties = floor(receitaBruta × 1500 / 10000)`; `devidoCarteira = floor(totalRoyalties × pesoCarteira / (150 × duraçãoSemestre))`.
29. A participação da pessoa é a soma das participações de suas carteiras. O arredondamento é por carteira; dividir uma posição entre carteiras pode acrescentar pequenas perdas de arredondamento, nunca ultrapassar o teto pessoal.
30. Exemplo de 180 dias: cinco unidades no semestre inteiro mais uma no último dia produzem 901 tokens-dia, posição média de aproximadamente 5,00556, e não seis. Os semestres reais têm sua duração de calendário, sem assumir 180 dias fixos.
31. A idade em semestres anteriores não cria bônus. A receita do semestre é ponderada pelo tempo; não se calcula faturamento diário correspondente a cada dia de posse.
32. Antes da venda, o peso da unidade pertence à tesouraria; após a venda, ao comprador. O denominador mantém toda a oferta, evitando premiar desproporcionalmente entradas tardias.
33. Tesouraria que vende todo o saldo continua incluída no reporte pelos pesos anteriores, mesmo fora da lista de detentores atuais.
34. Compra depois do fechamento não participa do semestre anterior, mesmo se o administrador ainda não o tiver reportado.
35. Recuperação acumula posições de origem/destino e move pesos de períodos ainda não apurados, inclusive os já fechados. Não reinicia tempo, duplica direito ou perde o semestre durante os sete dias de espera.
36. Pesos e pagamentos de períodos já apurados mantêm a história na origem; somente os recebíveis não pagos migram. Eventos distinguem recuperação de tempo e de recebíveis.
37. Uso de hospedagem não altera IBT, peso temporal nem royalty.
38. Multiplicação/divisão usa `Math.mulDiv` da mesma versão OpenZeppelin para evitar overflow intermediário quando o resultado cabe em `uint256`.
39. O reporte consulta apenas o período necessário. A revisão encontrou e corrigiu gravações desnecessárias dos oito períodos por titular, que tornavam um reporte tardio com 150 titulares caro demais. Há regressão de gas abaixo de `2^24` por transação.
40. O número de beneficiários é limitado pela emissão; recuperação não acumula uma lista infinita de carteiras antigas. A tesouraria zerada é incluída separadamente quando necessário.
41. Mantido pagamento pull: com stablecoin, depósito de **`totalDue`**, soma das obrigações arredondadas, e registro ocorrem na mesma transação. Saque individual protegido contra reentrada.
42. O resíduo `royaltyAmount - totalDue` não é automaticamente depositado. Não afirmar que todo resíduo fica no contrato. A destinação econômica do resíduo ainda precisa de regra externa.
43. Recebimento exato é conferido tanto em compra quanto em financiamento do royalty. Moedas com taxa de transferência não são aceitas como se entregassem o valor integral.
44. Modo sem stablecoin conserva liquidação externa e seu registro; uma vez configurada a moeda, períodos anteriores conservam seu modo original. A configuração é única.
45. O relatório financeiro tem um campo de referência pública (a fonte atual ainda aceita valor zero), mas a receita real, conciliação, revisão, retificação e prazo de disponibilização continuam externos. O prazo sugerido de 30 dias não foi aprovado.

### 2.4 Circulação e compra primária

46. `transfer` e `transferFrom` ordinários são bloqueados: entre titulares, para novo participante, entre carteiras da mesma pessoa, autoenvio e devolução informal à tesouraria.
47. `approve` continua disponível por compatibilidade ERC-20; a allowance não desbloqueia uma transferência proibida e permanece intacta quando a operação reverte.
48. Compra primária usa caminho interno específico a partir da tesouraria. Transferência direta da tesouraria também não substitui compra primária.
49. A recuperação autorizada usa caminho próprio e não constitui mercado secundário ou troca de titularidade civil. Não existe função genérica de venda, presente, recompra ou transferência por sucessão.
50. `buyPrimary` cobra a moeda configurada e entrega IBT na mesma transação. Falta de saldo, autorização, cadastro, estoque, limite ou pagamento exato reverte a operação inteira.
51. Preço unitário configura-se uma única vez; o checkout lê o contrato. Referência econômica em reais não equivale a implementar câmbio, emissão de stablecoin ou PIX.
52. `primarySaleUsed[buyer][saleRef]` impede liquidar duas vezes o mesmo pedido. A marca também reverte se o pagamento falhar.
53. `approve` da moeda e `buyPrimary` são duas transações distintas. A atomicidade da segunda não abrange conversão prévia, taxas, aprovação anterior, banco off-chain ou atendimento.

**Limite:** bloquear transferências do token não impede compartilhamento/venda informal de chaves ou contas. A operação cadastral e o vínculo civil continuam relevantes.

### 2.5 Recuperação e administração

54. Recuperação exige saldo positivo **ou** royalty pendente; não exige saldo para preservar recebíveis legados. Há teste específico com fixture exclusivamente de regressão para esse caso, sem acrescentar venda ao contrato de produção.
55. Destino não pode ser tesouraria, administrador atual, administrador pendente, origem, zero, carteira revogada, ocupada, reservada ou vinculada a outra pessoa. O fluxo atual de participante admite destinos EOA, não carteiras com código.
56. Anúncio público inclui origem, destino, referência opaca e instante de execução; prazo ampliado de 48 horas para **sete dias corridos**.
57. Durante a espera, origem/destino ficam indisponíveis para movimentações aplicáveis e saque da origem; valores continuam pertencendo à mesma pessoa e o tempo de posse não é apagado.
58. Titular ou owner pode cancelar na cadeia, inclusive durante pausa. Um chamado externo sozinho não bloqueia o contrato; integração operacional para executar essa contestação permanece pendente.
59. Troca de administração invalida anúncio antigo. A geração administrativa impede que um ex-owner volte e reutilize a autorização anterior.
60. Ao executar, origem é revogada; vínculo pessoal, saldo, recebíveis e pesos ainda não apurados continuam na nova carteira sem inflação. Valores já pagos não são transformados novamente em dívida.
61. Recuperação pode acontecer após expiração para preservar obrigações. Sucessão entre pessoas não foi disfarçada de recuperação de chave.
62. `Ownable2Step` exige aceite do novo administrador; renúncia permanece desabilitada para evitar contrato sem responsável.

**Ainda pendente, apesar de aceito:** segundo aprovador obrigatório, prova da nova carteira dentro do processo de recuperação, notificação por contatos anteriores, protocolo/contestação integrado, substitutos e regras de exceção. O owner ainda pode anunciar e executar sozinho após a espera. O prazo e as restrições reduzem abuso, mas não representam a salvaguarda completa aprovada pelo usuário.

## 3. Mudanças indiretas — serviço, jornada, cotas e segurança off-chain

Fontes: [Portal](../../offchain/src/portal.ts), [API](../../offchain/src/portal-api.ts), [compra](../../offchain/src/purchase.ts), [livro de cotas](../../offchain/src/ledger.ts), [indexador](../../offchain/src/chain.ts), [interface](../../offchain/public/portal.js) e [instruções](../../offchain/PORTAL.md).

### 3.1 Conta única, waitlist e atendimento

1. Formulário real persistente reúne nome, e-mail, telefone, CPF, interesse de 1–20 IBT, custódia e ciência do modelo. O antigo formulário estático de aquisição encaminha para essa jornada.
2. Uma identidade interna relaciona candidatura, conta, carteira, compra, cotas e estadias. Usuário não precisa digitar UUID, repetir cadastro ou reconectar carteira para pedir experiência.
3. Nome e dados pessoais ficam no sistema privado; o token permanece associado ao endereço e ao identificador opaco.
4. Login por e-mail/senha antes e depois da compra; senha mínima de 15 caracteres, scrypt com sal individual, sessão aleatória armazenada por hash, cookie HttpOnly/SameSite, expiração e logout.
5. Senha do portal não é chave de carteira. A equipe não pede frase de recuperação nem chave privada; recuperação de login não pode mudar titularidade on-chain por si só.
6. CPF passa por validação sintática e HMAC para deduplicação. Cadastro público não pode reivindicar identidade já existente em outro cadastro. Isso não comprova identidade real.
7. CPF recuperável para análise é cifrado com AES-GCM; apenas cadastro/supervisão recebe o campo. Chaves, senhas e frases de recuperação não integram a ficha.
8. Conta pública não escolhe papel privilegiado. Criação de funcionários exige CLI local restrita e senha lida sem eco; novo servidor não aceita segredo administrativo compartilhado como identidade de funcionário.
9. Papéis locais: cadastro, financeiro, atendimento e supervisão. Eles delimitam endpoints e dados; não equivalem aos papéis aprovadores on-chain ainda ausentes.
10. Waitlist oferece recebido, em análise, complemento, aprovado e reprovado; decisão tem autor, data, justificativa interna, mensagem pública e versão.
11. Prazo aceito de cinco dias úteis desde cadastro completo; cálculo no fuso brasileiro, fins de semana excluídos e feriados configuráveis. Sem configurar feriados, não presumir que o calendário os conhece.
12. Complemento suspende o prazo pelo tempo pendente, sem conceder cinco novos dias a cada resposta. Atraso é sinalizado, sem aprovação automática.
13. Fila com busca por nome/e-mail/estado; ficha com contatos, interesse, custódia, checklist, histórico, carteiras, pedidos, cotas, estadias e cancelamentos pertinentes.
14. Checklist provisório exige identidade/unicidade, contato, completude, ciência dos direitos, limite e revisão. Marcar caixas não executa KYC nem coleta evidência independente automaticamente.
15. Motivo interno é separado da resposta visível ao participante. Consultas à lista/ficha também deixam trilha com funcionário identificado.
16. Controle de versão impede duas decisões concorrentes de se sobrescreverem silenciosamente.
17. Uma aprovação não concede IBT/cotas; reprovação não queima tokens. Revogar aprovação já concedida exige regra coerente nas duas camadas, ainda pendente.
18. Cadastro, login e análise funcionam sem rede blockchain configurada. Compra/cotas exigem validação da rede; falha de RPC não desfaz o cadastro.
19. Formulários e painéis persistem após recarga, exibem estados/erros e foram conferidos em largura de 390 px sem rolagem horizontal. Entrada direta `#entrar` abre o login.
20. Textos distinguem prazo original de candidatura já decidida e compra conciliada de compra ainda aguardando operação financeira.

### 3.2 Três formas de custódia e habilitação

21. **IBITI:** carteira externa dedicada à pessoa, controlada pelo operador; participante utiliza conta no portal. Complexidade menor para participante, dependência maior da operação.
22. **Assistida:** participante mantém as chaves e confirma operações, com orientação. Atendimento não recebe chaves.
23. **Direta:** participante conecta carteira e executa vínculo/pagamento com autonomia. Responsabilidade por rede, taxas e backup permanece com ele.
24. Interface apresenta controle, complexidade, vantagens e limites das três opções.
25. Preferência pode mudar antes de compra enviada/concluída. Alteração invalida preparações; transação enviada precisa ser conciliada e não pode ser desfeita por mudança de formulário.
26. Vínculo usa desafio assinado com validade e identidade da sessão; prova durável fica separada do desafio descartável, impedindo perda do vínculo após limpeza de desafios.
27. No modo IBITI, financeiro prova controle da carteira dedicada, participante consente no pedido concreto em sua conta e financeiro assina externamente. Não há carteira coletiva nem chaves guardadas pelo backend.
28. Cadastro/supervisão prepara habilitação on-chain; somente a autoridade contratual pode assinar. Login administrativo não substitui poder de assinatura do contrato.
29. Habilitação exige vínculo opaco coerente em ambas as camadas; divergência bloqueia elegibilidade.
30. Autenticação/vínculo atuais usam EOAs. Carteiras programáveis/assinatura ERC-1271 e migração de modalidade após compra não estão integradas.

### 3.3 Compra, confirmação e resistência a duplicações

31. Checkout integrado prepara quantidade/custo a partir do contrato, com aritmética inteira e casas decimais da moeda, sem contas monetárias em ponto flutuante.
32. Mostra necessidade de moeda de pagamento e moeda nativa para taxas. Conversão, recebimento PIX e abastecimento real da carteira não foram implementados.
33. Pedido persiste identificação, pessoa, carteira, quantidade, modalidade, estado, referência e hash. Só o participante/operador autorizado pode atuar conforme modalidade.
34. Verificação confere rede, contrato, remetente, destino, calldata, recibo, eventos de pagamento/entrega e confirmação do bloco. Informar hash arbitrário não concede compra ou cota.
35. Hash é salvo antes de consultas externas; falha de RPC mantém pedido pendente e permite reconciliação, sem sugerir compra duplicada.
36. Retomada do mesmo pedido/evento é idempotente, reforçada por `primarySaleUsed` no contrato. Endpoint de atualização não aceita substituir o hash por corpo arbitrário.
37. Rejeição explícita de assinatura pela carteira (`4001`) volta à preparação e permite nova escolha. Timeout/erro de comunicação conserva estado pendente, pois a transação pode ter sido enviada.
38. Consentimento institucional é ligado ao pedido, não é uma autorização irrestrita de movimentação da conta.
39. Operações financeiras são serializadas no serviço e a autorização é reconferida após chamadas RPC, reduzindo corridas com mudança de custódia/estado.
40. Indexador é a origem de tokens/cotas reconhecidos. Aprovação, preparação e transação ainda não confirmada não substituem evento conciliado.
41. Sepolia usa blocos finalizados; Anvil local usa blocos locais. Fonte incorreta, rede divergente, início após emissão, reorganização ou resgate legado sem migração são recusados.
42. Banco registra escopo e vínculo de rede/contrato/bloco inicial; não reutiliza silenciosamente a waitlist em emissão diferente.
43. Identidades, consumo e compromissos persistem em SQLite; recuperação e sincronização repetida não recriam experiências.
44. Extrato preserva unidade/mode de períodos antigos liquidados em BRL após configuração posterior de stablecoin.

### 3.4 Experiências e cancelamento manual provisório

45. Uma experiência por IBT em toda a emissão; não há renovação semestral, anual ou emissão automática de novas cotas ao recuperar carteira.
46. Solicitação compromete a cota disponível imediatamente; confirmação mantém o compromisso; conclusão registra consumo. Uso não reduz tokens nem royalties.
47. Interface propõe estadia de três noites e informa até cinco pessoas por experiência e dependência de disponibilidade/confirmação. A lista de hóspedes e inventário real do hotel não são integrados.
48. A conta aprovada que comprou solicita experiência pelo mesmo login. Carteira é conferida pelo sistema, não exigida novamente como passo do usuário.
49. Confirmação e conclusão são atos de atendimento/supervisão; participante não pode concluir a própria estadia para manipular cotas.
50. Remarcação conserva histórico e cotas. Permissões/estado são reconferidos depois de sincronização para evitar corrida com conclusão ou mudança da reserva.
51. Cancelamento solicita análise; a cota continua comprometida até decisão. Atendimento/supervisão registra fundamento e decisão de devolver integralmente, reter ou negar o pedido.
52. Devolução integral é registrada uma vez, aguarda conciliação e não cria uma cota extra. Retenção não recria disponibilidade. Operações concorrentes não podem duplicar liberação.
53. A reserva conserva versão de política `manual-review-v1`, responsável e data; mudança de regra não deve reescrever silenciosamente o histórico.
54. **Não existem meias cotas acumuláveis, multas automáticas de 50%, antecedência automática de 14 dias ou tabela de cancelamento aplicada pelo software.** A decisão manual posterior prevalece.
55. Cancelar hospedagem não cancela compra, não vende IBT, não promete reembolso do preço do token nem elimina royalties. Devolução de cota não prorroga os quatro anos.
56. A retirada do secundário elimina a necessidade de bloqueio on-chain de tokens para garantir estadias durante revenda. O compromisso segue no livro off-chain.
57. Cancelamento do operador, força maior, no-show, contestação e indisponibilidade perto do fim continuam casos de atendimento dentro da política provisória; regras automáticas definitivas não foram inventadas.

### 3.5 Segurança, execução local e limites

58. Verificação de origem em operações de sessão e cookies SameSite; limitação de tentativas de autenticação e de requisições; campos HTML escapados e verificações de papel/pessoa no servidor.
59. Operações críticas no livro/portal usam transações de banco e identificação do ator; dados privados não entram em eventos públicos.
60. Servidor escuta em loopback; arquivos/bancos são criados com permissões restritas. Exemplos de configuração não contêm segredo de produção. Dados locais e chaves não devem ser versionados.
61. Integração antiga de demonstração foi preservada como legado, mas não habilitada por padrão no novo servidor; não confundir a API antiga com o login individual novo.
62. Novo `npm run demo:portal` cria Anvil e banco isolados, identidades sintéticas, candidatura aprovada, compra real de moeda fictícia na EVM local, três cotas disponíveis e duas candidaturas pendentes. Não apaga bancos existentes.
63. Demo informa explicitamente preço didático, abertura simulada e ausência de oferta/KYC real. Credenciais públicas da demo só se destinam a esse ambiente local.
64. Testes cobrem candidatura/autorizações, dados privados, prazo/feriados/complemento, compra direta e institucional, rejeição de assinatura, timeout, repetição, uso de cotas e cancelamento concorrente. Compilação usa Solidity 0.8.34, Osaka, otimizador 200 e `viaIR`; componentes OpenZeppelin 5.6.1 permanecem originais.
65. **Não integrados:** MFA, e-mail transacional, reset automático de senha, upload/dossiê documental, fornecedor de KYC, biometria, armazenamento institucional de chaves, conversor PIX, disponibilidade/PMS do hotel, rotina de backup/restauração homologada ou infraestrutura comercial. Login funcional não comprova esses serviços.

## 4. Documento de governança aprovado, ainda não integralmente executado

| Pilar | Responsabilidade aprovada | Estado e falta concreta |
| --- | --- | --- |
| Cadastro/atendimento | Identificar, vincular, selecionar, atender e abrir protocolos. | Papéis/ficha locais implementados; KYC híbrido real e protocolo de recuperação faltam. |
| Financeiro | Preparar/conferir faturamento, conciliar e financiar distribuições. | Compra e conciliação técnica existem; relatório revisado por outra pessoa e retificação ainda não possuem fluxo completo. |
| Segurança | Conter incidentes e propor retomada. | Contrato conserva pausa global; faltam pausa seletiva e separação de autoridade de contenção/retomada. |
| Supervisão | Recuperações, exceções e mudanças dos responsáveis. | Papel local existe; contrato ainda concentra atos no owner. Faltam segunda aprovação e administração conjunta de papéis. |
| Tesouraria | Guardar estoque/reserva e receber recursos em endereço estável. | Separação de owner existe. Controle 2 de 3 foi aceito, mas requer implantação e signatários independentes. |

A mesma pessoa ou chave não deve conseguir alterar os próprios papéis para contornar os controles conjuntos. `Ownable2Step` protege a troca de proprietário; não exige duas aprovações para cada operação. O desenho aceito de recuperação prevê protocolo privado, documento validado, cadastro anterior, declaração do incidente, canal anterior, prova da nova carteira, revisores identificados, anúncio, sete dias e contestação eficaz na cadeia. Hash de dossiê permite verificar integridade, não veracidade.

## 5. Pendências reais — não se limitam a calendário, tempo e secundário

**Implementação ainda necessária sobre decisões já aceitas:** governança por pilares e aprovação independente; administração conjunta dos papéis; pausa seletiva; processo integrado de recuperação/contestação; tesouraria 2 de 3; coerência de suspensão cadastral entre portal e contrato.

**Definições ainda abertas:** marco documental/revisores da abertura e monitoramento da operação; pares/quóruns por ato e substitutos; limites adicionais para liberar reserva; prazo de reporte/depósito, critérios detalhados de receita bruta e retificações; destinação de arredondamentos; moeda/prestador/conversão/taxas; conciliação do novo preço do memorando com valuation e material anterior; política definitiva de cancelamento e atendimento no fim da vigência; sucessão, que não está implementada como transferência entre pessoas.

**Integrações externas pretendidas:** verificação híbrida de identidade, custódia real, pagamentos/conversão, comunicação/MFA, inventário hoteleiro e operação segura dos dados. Não são exigências inventadas para impedir o teste acadêmico; são limites do que esse código prova.

**Coerência documental:** o memorando v2 recebido foi revisado em [feedback separado](2026-09-25-feedback-memorando-v2.md), sem editar o PDF. Whitepaper, materiais públicos e pacotes antigos também precisam acompanhar o estado final aprovado. A ausência de secundário e o tempo de posse alteram a descrição econômica e operacional; não recalcular automaticamente o valuation de outro integrante.

## 6. Relação com os critérios do professor

| Critério | Resposta concreta desta revisão |
| --- | --- |
| Coerência operacional | Teto pessoal, compra paga, tempo de posse, abertura e restrição de circulação executáveis. |
| Alinhamento entre artefatos | Inventário separa vigente, histórico e pendente; feedback por página para o memorando. |
| Compreensão operacional | Jornada única explica o que aprovação, assinatura, pagamento, finalização, cota e saque realmente fazem. |
| Justificativa técnica | Explica semestre de calendário, denominador 150, tempo em segundos, tesouraria, EOA e custos de apuração. |
| Adaptação ao contexto | 150 indivisíveis, reserva 50, teto pessoal 20, 15%, quatro anos desde abertura, experiências externas e ausência deliberada de revenda. |
| Organização/consistência | Contrato, calendário, portal, compra e livro separados; erros, eventos, permissões e regressões para casos de borda. |
| Arquitetura e economia | Compra atômica e cotas conciliadas; uso não diminui royalty; recuperação preserva direitos; estoque conserva peso. |
| Maturidade | Limites e pendências explícitos, decisões supersedidas preservadas como trajetória, revisão independente e teste extremo de gas. |

Não se promete nota. O objetivo é demonstrar evolução deliberada, verificável e coerente, sem chamar uma proposta de funcionalidade concluída.

## 7. Evidências de validação

[Relatório da v4](../../smart-contract/docs/validacao-v4.md): 56 testes de contrato/integração e 24 do serviço, typecheck dos dois projetos, verificação no navegador e revisão do caso extremo de gas. [Guia de teste e acessos](../../smart-contract/docs/guia-v4.md).

## Complemento posterior — refinamento do portal

A solicitação seguinte refinou landing, simulador, quantidade editável, linguagem da custódia, atualização automática da confirmação, fila por prazo e painel em abas com fichas em diálogo. Ver [descrição e validação do refinamento](2026-09-25-refinamento-do-portal.md). As pendências deste inventário estão mantidas na [lista de retomada](2026-09-25-pendencias-para-retomada.md), referenciada por `AGENTS.md`.

## Complemento: portal por etapa e responsável

O [registro por etapa e responsável](2026-09-25-portal-por-etapa-e-responsavel.md) detalha a segregação de permissões, fila única de compras, solicitação expressa, execução institucional local sem extensão, retirada da simulação da área de cotas, preço de R$ 34.874,14, salvaguardas de concorrência e limites. A versão oficial em preparação é a v2; v4 é apenas revisão interna de testes.
