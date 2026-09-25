# Jornada de compra por etapa e responsável

Revisão de 25/09/2026, destinada à versão oficial v2. A v1 é a única entrega oficial já publicada; “v4” nos arquivos técnicos identifica uma revisão interna de desenvolvimento/testes. Este documento complementa o inventário de mudanças, sem alterar o PDF do memorando.

## Problemas corrigidos

O portal misturava cadastro, aquisição e uso de experiências. Os mesmos menus apareciam para perfis diferentes, duas filas repetiam participantes e a custódia institucional exigia operar uma carteira sem apresentar um percurso claro. A quantidade de interesse era confundida com pedido de compra. A simulação usava um preço de ensaio sem relação com o memorando.

Aplicou-se a skill UI/UX Pro Max: telas organizadas pela tarefa atual, uma ação principal por etapa, informações secundárias recolhidas, mensagens com próximo responsável, controles acessíveis por teclado e layout móvel. A busca temática da skill não trouxe correspondência específica suficiente; as decisões foram baseadas nas regras gerais da skill e no fluxo do projeto, com conferência no navegador.

## Participante

- Landing e cadastro mostram simulação indicativa. Não cobram, reservam tokens nem criam pedidos.
- O cadastro aprovado permite solicitar uma quantidade. O pedido fica separado da intenção declarada na waitlist.
- Quem já tem tokens entra em **Experiências**, contendo cotas e hospedagens. Não há simulador nessa tela.
- **Minhas compras** mostra o pedido em andamento e o histórico. Quem já comprou só vê a simulação novamente após escolher **Comprar mais IBT**.
- **Minha conta** concentra dados e preferência de custódia. A mudança de modalidade, antes do envio/compra, desfaz solicitações/preparações anteriores; não desfaz transação enviada.
- Cotas são liberadas exclusivamente pela conciliação de eventos da compra. Aprovação e consentimento não geram saldo.

## Permissões e filas

| Perfil | Interface e ações |
| --- | --- |
| Cadastro | Candidaturas e autorizações de vínculo. Não executa pagamentos institucionais. |
| Financeiro | Compras, carteiras institucionais e pagamento autorizado. Não acessa a fila cadastral, CPF ou hospedagens; não aprova candidaturas nem vínculos. |
| Atendimento | Hospedagens e cancelamentos manuais; sem pedidos financeiros ou CPF. |
| Supervisão | Candidaturas, vínculos e acompanhamento de compras/hospedagens. A execução institucional pertence ao financeiro. |

As restrições são verificadas no servidor, não somente por ocultação de botões. O controle de acesso do portal não substitui a governança do contrato, que continua pendente de segregação on-chain.

**Compras** substitui a duplicação de Compras/Assistência IBITI. A fila contém solicitações efetivas; pessoas apenas aprovadas não aparecem como se houvesse compra pendente. Cada linha apresenta quantidade solicitada, modalidade, etapa e próximo responsável. Compras concluídas ficam em filtro próprio. A ficha abre em diálogo e permanece separada de hospedagens. A fila cadastral mantém prioridade por prazo e badges.

## Custódia IBITI: percurso para testar

1. Participante aprovado entra em **Minhas compras**, escolhe quantidade e solicita.
2. Financeiro abre **Compras → Abrir pedido → Preparar carteira de teste**. Uma carteira individual é vinculada mediante assinatura.
3. Cadastro/supervisão abre o pedido e escolhe **Autorizar vínculo para compra**.
4. Financeiro escolhe **Preparar pedido de N IBT**; preço, estoque e teto são conferidos no contrato.
5. Participante confere quantidade/valor e escolhe **Autorizar pedido** na própria conta.
6. Financeiro escolhe **Concluir compra de teste**.
7. Após recibo e eventos confirmados, a mesma conta recebe as cotas e permite solicitar hospedagem sem endereço de carteira.

A modalidade direta/assistida mantém assinatura pelo participante em sua carteira. O atendimento pode orientar, sem tomar posse da chave. A etapa específica de consentimento na conta é necessária para a custódia IBITI; na autocustódia, o participante autoriza o pagamento na carteira.

## Preço

A referência autorizada passa a ser **R$ 34.874,14 por IBT**, conforme o memorando v2. Duas unidades: **R$ 69.748,28**; três: **R$ 104.622,42**. A simulação usa centavos inteiros e não depende de RPC. A preparação do pedido continua lendo o preço efetivo do contrato.

A nova instância local configura 34.874,14 unidades de tBRL por IBT para representar numericamente essa referência, sem valor financeiro real. Isso não integra PIX ou conversão cambial. O contrato só aceita definir o preço uma vez; a instância anterior de 100 tBRL não foi reprecificada por uma exceção à regra. Foi criada outra demonstração local, preservando os arquivos e o backup da anterior. Compras históricas não foram reescritas.

A diferença entre `100 × R$ 34.874,14` e a captação da planilha com precisão integral continua apontada no feedback do memorando, para revisão financeira/editorial.

## Implementação e limites

Novas solicitações persistentes registram pessoa, modalidade, quantidade e estado. Preparações são vinculadas à solicitação. Cancelamento ou mudança de modalidade durante uma operação assíncrona impede que o resultado antigo seja vinculado ao pedido novo. Consentimento pertence ao pedido específico; envio duplicado não executa nova compra.

O adaptador em `offchain/scripts/local-custody.ts` é exclusivo da demonstração: exige RPC local, rede 31337 e cliente Anvil. Gera carteiras sintéticas, fundos fictícios, assinaturas e transações de teste. O servidor normal não importa nem ativa esse adaptador. Não representa custódia comercial, integração de cofre de chaves ou financiamento real.

Para retomar uma instância ainda ativa, `resume-demo.ts` lê um arquivo privado gerado pela demo; não cria nova emissão nem altera o preço imutável. O arquivo fica fora do versionamento e contém segredo de ambiente sintético. Não usar esse mecanismo para chaves ou fundos reais.

O acompanhamento de transações enviadas é automático com a página aberta. Falha com resultado incerto preserva o pedido pendente para conciliação; não autoriza repetir pagamento indiscriminadamente. Sem serviço permanente de conciliação, reabrir o portal retoma o acompanhamento.

## Verificação

28 testes off-chain, verificação de tipos nos dois projetos e duas integrações reais com Anvil passaram nesta rodada. Cobrem isolamento de papéis, proibição de compra antes da aprovação/solicitação, cancelamento concorrente, consentimento, execução institucional sem extensão e rejeição de repetição. A interface é conferida em desktop e 390px; o teste percorre cadastro, decisão administrativa, compra, confirmação automática sem recarregar a página e solicitação de hospedagem. Foram comparadas as políticas antiga e nova de estilos no navegador, mantendo scripts inline bloqueados.

A leitura do código local do navegador Codex identificou estilos de anotação injetados em elementos `style`, inclusive no shadow DOM. A política anterior do portal bloqueava esse mecanismo; o bloqueio foi reproduzido em navegador. A demonstração local Anvil agora admite esses estilos por `style-src-elem`, preservando o bloqueio de scripts inline. O servidor normal continua com a política estrita. A automação do próprio aplicativo foi bloqueada: a confirmação visual do cursor dentro do Codex permanece dependente do teste de Gabriel.
