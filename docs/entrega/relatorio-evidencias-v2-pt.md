IBIToken

Deploy e evidências<br/>operacionais on-chain

Inteli | Módulo 6 | Grupo G01 | Entrega oficial v2

Revisão baseada em execução de 26/09/2026 (UTC). A revisão técnica interna é 4; a numeração oficial anterior permanece v1. O novo contrato de teste não implica, por si só, publicação formal da entrega.

1. Objetivo e alcance das evidências

Este relatório conecta regras econômicas, comportamento do contrato e registros observados. A entrega reúne o PDF e dois vídeos: a demonstração on-chain, de aproximadamente 6min32s, e a explicação do portal off-chain. O índice final identifica os nomes publicados. A implantação é pública; compras, royalties e recuperação desta coleta foram executados no Anvil.

Ambiente | Comprovado neste conjunto

Sepolia / 11155111 | Criação, emissão, parâmetros de implantação e correspondência exata no Sourcify. O preço configurado não comprova uma compra.

Anvil / 31337 | Cadastro, abertura fictícia, compras, restrições, apuração, dois saques e recuperação anunciada/cancelada. Testes de regressão adicionais na seção 7.

Portal off-chain | Vídeo complementar publicado: jornada de participante, supervisão e financeiro. Capturas e descrição preservadas da revisão da equipe; não são evidência de compra na Sepolia.

Modelo consolidado

Emissão única de 150 IBT indivisíveis; reserva inicial de 50 e teto de 20 por pessoa cadastrada, somando carteiras. Sem transferências ordinárias entre participantes. Oito semestres desde a abertura registrada, por quatro anos. A participação é proporcional a unidades vezes tempo de posse sobre um fundo de 15% do faturamento bruto informado. No modelo de hospedagem, uma cota corresponde a três noites; o consumo é controlado fora da blockchain.

<b>Moeda e identidades são de teste.</b> tBRL não é dinheiro real. O preço de demonstração é 34.874,14 tBRL/IBT. O ID opaco não comprova a identidade nem garante anonimato: depende do cadastro externo e pode ser correlacionado com outros dados.

2. Implantação pública verificada

O script <b>01_publicar.js</b> foi usado no Remix com confirmações humanas na MetaMask. Compilação: Solidity 0.8.34+commit.80d5c536, Osaka, otimizador 200, viaIR habilitado e OpenZeppelin 5.6.1 vendorizada.

IBIToken: 0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520

ADMIN / treasury: 0x549852CA58C2e843e29428a81Ab97D2d613BB749

tBRL: 0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE

Creation tx: 0x132a696441b2a2feae4e2ea4b233c90e2f4534afaff84c9d7064a8d84ac0ec4f

Campo | Resultado conferido

Bloco / inclusão | 11783256 / 2026-09-26 02:22:36 UTC

Status / gas utilizado | 1 (success) / 3,906,647

Preço efetivo do gas / taxa | 2.588339865 Gwei / 0.010111730168582655 SepoliaETH

Argumentos do construtor | admin = ADMIN; emissão total = 150; validFrom = 0; validUntil = 0; stablecoin = tBRL.

Verificação de fonte | Sourcify: creationMatch = exact_match; runtimeMatch = exact_match.

Os valores zero de validade indicam abertura ainda não registrada nesta implantação pública. ADMIN e tesouraria começam no mesmo endereço, mas o cargo e o estoque são separados. Nenhum USER1/USER2 público foi usado nas compras deste MP4.

Figura 1. Recibo público: status Success, contrato criado e emissão de 150 IBT. Fonte: Etherscan, captura desta execução.

Correspondência exata vincula compilação e bytecode. Não comprova que o memorando está correto, que não há vulnerabilidades, nem que os dados externos são verdadeiros. A taxa acima foi calculada por gasUsed × effectiveGasPrice; não representa custo futuro garantido.

3. Compras e restrições no Anvil

O console acadêmico assina apenas em uma instância local isolada, chain ID 31337. As contas abaixo são públicas de teste, não três contas selecionadas na MetaMask. Os cliques produziram recibos reais no Anvil; cortes e congelamentos no vídeo servem à leitura e dublagem.

ADMIN: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

USER1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

USER2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

Ação | Observado

Registrar USER1 e USER2 | WalletRegistered para IDs sintéticos distintos. Não prova KYC real.

Registrar abertura | 15/03/2027 00:00 UTC, fictícia. Fim do primeiro semestre: 15/09/2027 00:00 UTC.

USER1: approve + buyPrimary | Compra 2 IBT no começo. Custo: 69.748,28 tBRL.

USER2: approve + buyPrimary | Compra 2 IBT na metade exata. Mesmo custo. Só Anvil avança no tempo.

Compra não cadastrada | WalletNotRegistered

Transferência USER1 para USER2 | SecondaryTransfersDisabled

Apuração antecipada | PeriodNotClosed

Após ambas as compras | IBT | tBRL

ADMIN / treasury | 146 | 139,496.56

USER1 | 2 | 0

USER2 | 2 | 0

Interpretação operacional

Cada comprador recebeu exatamente o valor de teste necessário. A autorização de gasto é uma transação separada. No buyPrimary, pagamento em tBRL e entrega de IBT acontecem juntos: uma falha reverte ambos. A referência do pedido evita reaproveitar a mesma compra. Isso não torna atômico o livro externo de hospedagens nem comprova um pagamento por PIX.

As três rejeições acima foram verificadas por <b>eth_call</b>: não houve mineração, hash de transação ou gas pago por elas. A ausência de secundário bloqueia a transferência ordinária, mas não elimina a recuperação controlada. O teto por pessoa ainda depende de evitar que uma identidade real receba vários IDs diferentes no cadastro.

4. Royalties e recuperação: resultados medidos

O semestre do ensaio tem <b>15.897.600 segundos</b>. USER1 acumulou 31.795.200 tokens-segundo; USER2, 15.897.600. Receita fictícia G = 150.000 tBRL; fundo R = 22.500 tBRL.

R = floor(G × 1500 / 10000)<br/>W = Σ(unidades × segundos de posse no semestre)<br/>parcela = floor(R × W / (150 × duração))

Titular | Devido | Sacado | Pendente ao final

USER1 | 300 tBRL | 300 tBRL | 0

USER2 | 150 tBRL | 150 tBRL | 0

Tesouraria | 22,050 tBRL | 0 | 22,050 tBRL

O depósito foi de 22.500 tBRL, e o contrato ficou com 22.050 após os dois saques. A tesouraria participa pelo estoque e reserva e recebe 98% neste exemplo. Sua moeda após vendas e depósito é 116.996,56 tBRL. Os IBT dos participantes não foram consumidos nos saques.

<b>Arredondamento:</b> o contrato transfere a soma das parcelas individuais (<b>totalDue</b>), que pode ser inferior a R. Uma diferença de arredondamento não é depositada e permanece com o financiador. Neste ensaio a diferença foi zero. A regra econômica de destinação dessa diferença deve ser explicitada no memorando.

Recuperação | Resultado

requestRecovery | USER1 para carteira nova vazia da mesma pessoa; anúncio registrado.

reissue / eth_call | RecoveryNotReady; executeAfter = pedido + 604.800 segundos (7 dias).

cancelRecovery | RecoveryCancelled. USER1 mantém 2 IBT; nenhum saldo foi transferido.

A execução após sete dias não foi realizada no vídeo; ela foi validada nos testes adicionais da seção 7. O prazo cria uma janela para contestação, mas não integra automaticamente atendimento e contrato. O titular antigo ou owner pode cancelar no contrato; o fluxo externo completo e revisão independente continuam pendentes. O destino não pode ser tesouraria, owner, pendingOwner ou outra pessoa registrada, e precisa atender às demais restrições do código.

5. Arquitetura, operação e análise crítica

Conta, custódia e hospedagens

A conta do portal reúne candidatura, aprovação, vínculo de carteira, pedido e cotas. Nome, contato e documentos ficam em sistemas externos; o contrato recebe IDs opacos. Aprovar a candidatura não concede token ou hospedagem. A compra reconhecida pelo indexador atualiza direitos no livro externo. Usar uma cota não queima IBT nem reduz, por si só, royalties. Cancelamentos seguem manuais e provisórios.

Há três modalidades de custódia previstas: IBITI, autocustódia assistida e direta. O caminho institucional automatizado usado na demonstração funciona apenas no adaptador Anvil. Não representa guarda de chaves de produção, pagamento real ou serviço contratado. A separação entre supervisão e financeiro no portal é uma autorização da aplicação; não equivale a múltiplas assinaturas exigidas pelo contrato.

Finalidade e persistência

Um recibo com status 1 comprova inclusão bem-sucedida, não finalidade por si só. Antes da finalização pode haver reorganização. O desenho do indexador usa estado finalizado antes de liberar cotas, criando uma espera entre compra e disponibilidade. A transação não é atômica com o banco off-chain; idempotência, tratamento de falhas e conciliação continuam necessários.

Verificabilidade e concentração de poder

Eventos registram abertura, cadastro, compra, apuração, saque e recuperação. Recibos e bytecode permitem verificação independente, desde que a rede correta seja indicada. As operações locais não aparecem no Etherscan. O owner continua único: informa receita, cadastra carteiras, registra abertura e pode pausar, inclusive saques. A troca em duas etapas não transfere automaticamente a tesouraria nem elimina o risco de uma chave comprometida.

Custo, limites e interpretação econômica

O custo público de implantação está medido na seção 2; custos de compras desta coleta são locais e não devem ser apresentados como taxas pagas na Sepolia. A apuração percorre participantes rastreados e seu custo depende do estado. Não se afirma aqui um benchmark público com 150 titulares. Quinze por cento da receita é a base do rateio, e não retorno garantido de 15% sobre o preço de aquisição.

O contrato não verifica a receita real, a inauguração física ou a autenticidade de um documento. Um hash permite comparar integridade com o arquivo preservado; não valida o seu conteúdo. A exposição de dados civis em rede pública permanente deve ser evitada.

6. Jornada do portal e fronteira on-chain

Esta seção preserva a contribuição do relatório publicado pela equipe em 26/09/2026 (commit 76b826fe). O vídeo complementar mostra um ambiente acadêmico local, sem cobrança real. As etapas abaixo não são transações da Sepolia; contas e dados são demonstrativos.

Etapa e responsável | Efeito e interpretação

Visitante: simular interesse | De 1 a 20 IBT, a R$ 34.874,14. A simulação não cria pedido nem saldo no contrato.

Ana: solicitar hospedagem | 3 cotas livres passam a 2 livres e 1 reservada. Concluir a estadia registra 1 utilizada, sem queimar IBT.

Beatriz: pedir 2 IBT | R$ 69.748,28, custódia IBITI. A candidata aprovada ainda precisa concluir a compra para receber cotas.

Supervisão: revisar e vincular | Analisa a candidatura e autoriza o vínculo de carteira e ID opaco. O cadastro no contrato usa registerWallet.

Financeiro e participante: comprar | Preparar carteira e pedido; obter aceite do valor; executar compra de teste. O recibo do portal pertence ao Anvil.

Indexador: reconhecer a compra | O portal reconhece o evento e mostra 2 IBT e 2 cotas. Digitar um hash, isoladamente, não concede direitos.

Figura 2. Pedido por etapas e preparação de carteira de teste. Fonte: capturas do relatório da equipe. Textos da interface permanecem em português.

A separação de acessos facilita a atribuição de responsabilidade no portal, mas não comprova segregação de chaves de produção nem substitui multisig no contrato. O adaptador de custódia demonstrado é exclusivo do Anvil.

6. Jornada do portal: compra e utilização

Figura 3. Supervisão autoriza o vínculo; participante confere e aceita o valor do pedido.

Figura 4. Financeiro executa a compra de teste; o portal mostra o recibo local e o valor de R$ 69.748,28.

Figura 5. Hospedagem utilizada sem redução do saldo IBT; outra participante recebe cotas após a compra.

A conta reúne cadastro, aprovação, compra e experiências. A carteira mantém os tokens; o livro externo controla cotas livres, reservadas e utilizadas. O consumo não muda o peso dos royalties. O contrato não observa a hospedagem física, e a confiabilidade dessa camada depende do sistema externo e dos responsáveis. Cancelamentos continuam manuais e provisórios.

7. Feedback da v1: evidência de regressão

Foram reexecutadas as suítes feedback.test.ts e time-weighted.test.ts em 26/09/2026, usando Anvil 31337 e a fonte atual. Esta seção é evidência de testes automatizados adicionais, não cenas dos vídeos nem transações da Sepolia. Os comandos e identificadores de fonte estão na página seguinte.

Falha da v1 / correção | Procedimento e resultado observado

Concentração por pessoa | Duas carteiras recebem o mesmo ID. Após 20 IBT na primeira, comprar 1 na segunda reverte PersonCapExceeded; o agregado permanece 20.

Recuperação para administrador | Tentativas de recuperar 20 IBT para owner, pendingOwner e tesouraria são rejeitadas com InvalidAddress. A posição do titular permanece intacta.

Troca de administrador | Após aceite do novo owner, a compra de 1 IBT funciona; tesouraria original mantém 149, e estoque vendável é 99. Vendas até a reserva terminam em 50; venda adicional reverte ReserveProtected.

Oito períodos antecipados | Para cada semestre, apurar antes do encerramento reverte PeriodNotClosed; após o encerramento funciona. A nona apuração reverte AllPeriodsReported.

Recebíveis sem saldo | Fixture de posição legada simula saldo zero após duas apurações. Recuperação após expiração migra 5.000 unidades mínimas da moeda; pagamento histórico permanece intacto e saque duplicado é rejeitado.

Anúncio e espera efetiva | Execução um segundo antes do prazo reverte RecoveryNotReady. Após sete dias locais, 20 IBT migram sem alterar o supply de 150; origem é revogada e o ID permanece o mesmo.

Pagamento e entrega | Compra com approve transfere a moeda à tesouraria e entrega IBT. Sem saldo ou allowance, a entrega e o agregado pessoal são revertidos.

Limite do teste de saldo zero: LegacyPositionFixture cria um estado herdado que não depende de habilitar mercado secundário na versão atual. Ele exercita a rotina de recuperação, não comprova uma venda secundária permitida. Avançar o relógio é um recurso exclusivo do ensaio local.

7. Reprodução e alcance dos testes

Resultado desta execução: <b>31/31</b> testes aprovados; zero falhas.

Executar a partir da pasta do artefato de implementação, com Node.js 24 e dependências instaladas pelo lockfile. O comando recompila contratos e inicia instâncias isoladas do Anvil; não usa fundos nem chaves privadas de usuários.

cd smart-contract<br/>npm ci<br/>node --test --test-concurrency=1 --test-reporter=tap tests/feedback.test.ts tests/time-weighted.test.ts

SHA-256 | contracts/IBIToken.sol<br/>445c041752cf7081cf2ab82f1e4953249bcd65babb1eb31c0a945169dca84960

SHA-256 | tests/feedback.test.ts<br/>ba644fd556daf733d2e03ae5a99a768439a38925ad80e0e37fb1072cac02c5b3

SHA-256 | tests/time-weighted.test.ts<br/>235bb72e44334e793408bdb744710728d5d02ae6280d5bd05266af5c88307b29

O arquivo de fonte, os testes e o package-lock.json estão no artefato de implementação publicado ao lado desta pasta. A fonte e os dois arquivos de teste foram comparados com o GitLab e têm SHA-256 idêntico. Os hashes identificam os arquivos usados nesta revisão; não certificam autoria, segurança ou ausência de falhas. A saída TAP desta execução está incorporada ao PDF como anexo de apoio.

Regra econômica adicional | Teste e interpretação

Compra tardia | Cinco tokens por mais tempo e um token no último dia acumulam pesos separados. Reportar com atraso não muda o corte do semestre.

Recuperação e tempo | Migração preserva pesos ainda não apurados, recebíveis e pagamentos históricos sem contar o mesmo tempo duas vezes.

Calendário real | Testes cobrem aniversário de 29 de fevereiro e bloqueio de compras após quatro anos. Datas de teste não anunciam abertura real do Glamping.

A evolução corrige casos de borda observados na v1 e transforma proteções econômicas em regras executáveis. Ainda assim, o ID depende do cadastro externo; receita e abertura dependem de informações administrativas. Estes testes não são auditoria independente nem substituem evidência de uso na rede pública.

8. Evolução, evidências e pendências

Mudança em relação à v1 | Justificativa e comprovação

Entrega manual → compra paga | Pagamento e entrega juntos; recibos locais e eventos PrimaryPayment/PrimaryPurchase.

Teto por carteira → pessoa | Fecha concentração entre carteiras vinculadas; código verificado. Caso de duas carteiras da mesma pessoa não exercitado neste vídeo.

Fotografia do saldo → tempo | Evita semestre integral para entrada tardia; valores 300/150 medidos.

Datas fixas → abertura | Calendário ligado à operação; apuração antecipada rejeitada localmente.

Secundário → desabilitado | Decisão consolidada do projeto; rejeição local mesmo entre cadastrados.

Recuperação imediata → 7 dias | Anúncio e cancelamento rastreáveis; execução antecipada rejeitada.

<b>Distinção entre testes e vídeo:</b> múltiplas carteiras da mesma pessoa, troca de owner e recuperação concluída foram comprovadas nos testes da seção 7; não foram gravadas na demonstração on-chain. Compras e ciclo completo na Sepolia continuam sem evidência nesta coleta.

<b>Pendências de implementação:</b> governança conjunta por pilares, tesouraria 2 de 3, pausa seletiva e contestação integrada; KYC e custódia de produção; comprovação externa de receita e abertura. O memorando publicado ainda precisa ser conciliado com as regras atuais. Em especial, compras antes da abertura são bloqueadas pelo código, apesar da proposta de captação antecipada.

Como complementar a evidência pública

Cadastro e compra não exigem esperar seis meses: em uma instância pública de demonstração, registrar participantes sintéticos, registrar uma abertura de teste claramente identificada, obter tBRL de teste, executar approve e buyPrimary e preservar recibos, eventos e saldos antes/depois. Isso exige novas transações assinadas, não uma alteração de redação. Não registrar uma abertura física fictícia como verdadeira. Na implantação atual, a abertura ainda não estava registrada na coleta.

Apuração e recuperação executada respeitam tempo real em rede pública. Os testes locais com avanço de tempo permitem demonstrar essas regras agora, sem afirmar que o prazo decorreu na Sepolia. Uma chamada rejeitada por eth_call é simulação, não transação minerada.

9. Arquivos e índice verificável

Índice verificável

Local de entrega: <b>Sprint 4 / Deploy e Evidências Operacionais On-Chain</b>. Este PDF em português é a versão de entrega definida pela equipe. Os vídeos publicados na mesma pasta são os listados abaixo. A versão publicada deve corresponder a este relatório revisado.

Arquivo publicado | Alcance

IBIToken-v2-demonstracao-sem-voz.mp4 | Aproximadamente 6min32s. Implantação pública e demonstração operacional local. Substitui o corte antigo de 2min40s.

IBIToken-v2-explicacao-do-sistema-off-chain.mp4 | Portal, papéis e hospedagens. Identificado como vídeo 1 no relatório anterior da equipe. Complementar; não comprova compra pública.

Os registros locais e a saída dos testes acompanham este PDF como anexos incorporados, acessíveis pelo painel de anexos de um leitor PDF. Não dependem de uma pasta output publicada no GitLab. Leitores web podem exigir download para exibir anexos.

buyPrimary USER1 | Anvil | block 11 | gas 314737<br/>0xb1ff3a0fa3e04bfa28a736439e7977c90c2b5c4e2d7cd5a69a3c4027ce24532a

buyPrimary USER2 | Anvil | block 14 | gas 320927<br/>0xdfb961ffb0f6ea9f0cb012498a06cf6499097b655ba09c9b6312dc410c4ded7b

reportRevenue | Anvil | block 17 | gas 344717<br/>0x5c55d3c71d200bf87dafeed1914534ac368620e5c203a525b18ee4de96b90268

claimRoyalty USER1 | Anvil | block 18 | gas 92949<br/>0xbce186b1b9e77f4c287aef67a444bb93f873406ad7e14be23872debb5265e46a

claimRoyalty USER2 | Anvil | block 19 | gas 92949<br/>0x5ba6d23669af16fd55069f2439bcf2a60753242fb9bc431f9771d595bb6cb343

cancelRecovery | Anvil | block 21 | gas 41586<br/>0x4839d0894b51b8d2ab0b6261b9289400e06d02e3cef0d94d44991f37e87b5b18

<link href="https://sepolia.etherscan.io/tx/0x132a696441b2a2feae4e2ea4b233c90e2f4534afaff84c9d7064a8d84ac0ec4f" color="#245b45">Etherscan: public deployment receipt</link> | <link href="https://repo.sourcify.dev/11155111/0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520" color="#245b45">Sourcify: exact_match and source</link>

Conclusão: a implantação e a verificação são públicas; compras, rateio, saques e regressões foram demonstrados localmente. Os resultados sustentam correções específicas do feedback da v1, sem comprovar operação comercial ou ciclo completo na Sepolia.

10. Como auditar os registros locais

Hash local não é link para o Etherscan. Ele identifica uma transação de uma execução específica do Anvil, cujo chain ID 31337 pode ser reutilizado em outras instâncias. O número da rede sozinho não identifica a execução; conferir também contrato, bloco, eventos e contexto.

Anexo incorporado | Conteúdo e limite

anvil-records.json | Coleta original com contratos, contas de teste, calendário, saldos e eventos decodificados por operação. Preserva os hashes do vídeo; não é um dump completo da blockchain nem recibo RPC bruto de toda operação.

sepolia-deployment-receipt.json | Recibo RPC de implantação pública, incluindo logs brutos. Pode ser comparado com Etherscan e um RPC Sepolia.

regression-tests.tap | Saída integral dos 31 testes reexecutados, com nomes, resultados e duração. Deve ser lida com os arquivos de teste e hashes da seção 7.

evidence-manifest.json | SHA-256 dos anexos, fonte e testes; liga esta revisão aos arquivos preservados. Hash garante comparação de integridade, não verdade do conteúdo.

Para reproduzir, executar os testes da seção 7. Endereços, blocos, hashes e tempos podem mudar em uma nova execução; comparar as invariantes: oferta 150, reserva protegida, teto agregado 20, estados antes/depois, rejeições esperadas e pagamentos sem duplicidade. Não exigir que uma nova execução gere os hashes históricos.

Os anexos são dados declarados pelo coletor da equipe. Reexecutar a fonte permite verificar o comportamento, mas não transforma a cadeia local histórica em registro público independente. Para esse nível de verificabilidade, são necessárias operações e recibos em uma rede pública.