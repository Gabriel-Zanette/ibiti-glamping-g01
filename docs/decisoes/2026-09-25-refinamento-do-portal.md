# Refinamento da jornada e administração — 25/09/2026

Registro da primeira rodada de refinamento. A rodada seguinte substitui a simulação atrelada ao RPC e as quatro abas administrativas pelo [fluxo por etapa e responsável](2026-09-25-portal-por-etapa-e-responsavel.md).

Complemento ao inventário completo do token. Estas mudanças são off-chain; não alteram supply, alíquota, royalties por tempo, preço comercial nem regras de circulação do contrato.

## Entrada e compra

A raiz do portal agora serve a landing existente. A página apresenta benefícios e simulação, levando à lista de interesse ou ao login. A conta fica em `/conta`; `/conta#entrar` abre o login. `/adquirir.html` encaminha ao portal.

O cadastro informa quantidade, total estimado e cotas. A simulação pública consulta o preço configurado no contrato, sem reservar tokens nem autorizar pagamento. Indisponibilidade da rede não impede cadastro: o valor fica explicitamente indisponível. O ambiente local usa moeda fictícia tBRL, sem tratar o preço de teste como preço comercial.

A quantidade é uma intenção editável, inclusive depois da aprovação. Não reinicia prazo nem invalida a aprovação. Entre 1 e 20 IBT, respeitando o agregado já adquirido. Um pedido preparado, em assinatura ou enviado impede alterar a intenção: desfazer a preparação é permitido antes do envio; uma transação enviada deve primeiro ser conciliada. O pedido definitivo sempre reconfere preço, estoque e limite no contrato. Uma nova compra não altera o histórico das anteriores.

A compra só fica disponível após aprovação cadastral e autorização da carteira. O usuário não precisa preencher carteira para login ou hospedagem. Na custódia IBITI, a equipe prepara o pedido e o participante confere/autoriza pela própria conta antes da execução financeira.

## Escolha de custódia

As opções explicam quem guarda o acesso, para quem servem, responsabilidades e esforço: “A IBITI cuida para mim”, “Eu cuido, com orientação” e “Eu cuido por conta própria”. A escolha permanece editável antes do pagamento; após compra concluída, o painel mostra a preferência vigente sem exibir uma seleção inoperante. A interface não solicita chaves privadas nem frases de recuperação.

## Confirmação e autorizações

Removido “Conferir confirmação” das compras: pedidos enviados são consultados automaticamente a cada 15 segundos enquanto a página estiver aberta e visível. A consulta não assina nem envia pagamentos. Pedidos já concluídos não apresentam botão redundante. A atualização da posição também ocorre sem ação manual. O estado é preservado no servidor, permitindo retomar o acompanhamento ao voltar ao portal; não se afirma existir trabalhador de reconciliação em segundo plano com todas as páginas fechadas.

“Habilitar” foi substituído por “Autorizar carteira para compra”, com contexto próprio na aba de compras. Essa operação registra no contrato a carteira já vinculada a uma pessoa aprovada, sem comprar ou cobrar. Só aparece enquanto o vínculo autorizado ainda não foi reconhecido; a permissão administrativa e a assinatura do contrato continuam exigidas.

## Administração

Quatro abas: candidaturas, hospedagens, compras e assistência IBITI. A assistência reúne o fluxo ainda manual de carteira dedicada, preparação pelo financeiro, aceite pelo participante e pagamento pela carteira responsável. Não cria ou guarda chaves automaticamente.

Candidaturas ativas ordenadas pelo menor prazo, incluindo atrasadas primeiro; pausadas e encerradas ao final. Badges distinguem dias úteis restantes, vencimento hoje, atraso, pausa e conclusão. Consideram fuso de Brasília e feriados configurados. O prazo não expira a conta nem aprova/reprova automaticamente.

“Abrir ficha” abre um diálogo com contato, dados pertinentes ao perfil, checklist, decisão e histórico. Hospedagens e operações financeiras têm telas próprias no diálogo, acessadas por suas abas. A navegação tem suporte a teclado, foco visível, fechamento por Escape e retorno à lista.

## Continuidade

`AGENTS.md` registra o pedido de retomada das pendências nas novas conversas do projeto. A lista viva fica em `2026-09-25-pendencias-para-retomada.md`. Lembrete único agendado para 26/09/2026 às 09h de Brasília.

## Verificação e acesso desta rodada

- 27 testes do serviço e verificação de tipos nos dois projetos concluídos.
- Integração com contrato em Anvil: preço de simulação, compra nas duas modalidades, bloqueio de mudança durante pedido pendente e cancelamento de preparação institucional pelo próprio participante.
- Navegador: landing e simulação com quantidade levada ao cadastro; compra indisponível antes de aprovação; decisão em diálogo; ajuste de quantidade aprovado; abas; uso e devolução manual de cota; layout móvel e ausência de erros de JavaScript.
- Confirmação automática testada com transação EVM realmente pendente, seguida de mineração: o painel passou de zero para cinco cotas sem botão de conferência. A conta Ana de demonstração continua com três cotas livres.
- Ambiente desta sessão: `http://localhost:3001/`; login `/conta#entrar`. O processo anterior e seu banco foram preservados. A porta pode ser escolhida com `DEMO_PORT=3001 npm --prefix offchain run demo:portal`. Cada execução cria banco de demonstração isolado.

As experiências aparecem antes das opções de nova compra para quem já possui tokens. As permissões de cada papel continuam conferidas no servidor; reorganização das telas não concede autoridade adicional de assinatura.
