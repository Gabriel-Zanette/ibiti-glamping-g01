# Pendências para retomada — IBITI

Atualizado em 25/09/2026. Pedido de Gabriel: lembrar nas novas conversas deste repositório e em 26/09 às 09h. Esta lista não autoriza mudanças de condições econômicas ainda abertas. Validar o estado da fonte antes de repetir uma pendência.

## Novas frentes solicitadas para a próxima retomada

Registrado por pedido expresso de Gabriel em 25/09/2026, durante a organização da entrega v2 e do commit:

- **Remodelar os pilares da administração:** rever o desenho dos pilares, a divisão de responsabilidades e a relação entre permissões do portal e poderes on-chain. Não se limita a codificar automaticamente a distribuição sugerida anteriormente; o usuário quer melhorar o desenho antes de considerá-lo definitivo.
- **Aprimorar a custódia:** revisar o funcionamento e a assistência nas modalidades já aceitas, tornando o processo mais bem definido e executável. O alcance concreto das melhorias será esclarecido na retomada; não presumir retirada de uma das três modalidades.

Essas frentes somam-se às pendências antigas, sem encerrá-las. A solicitação atual foi memorizar para retomar em breve, não efetuar essas mudanças durante o empacotamento.

## Aceito, mas ainda não concluído

- Governança do contrato por pilares, aprovação independente nos atos críticos e administração conjunta dos próprios papéis. Hoje o contrato ainda usa owner único; acessos individuais do portal não substituem essa proteção.
- Pausas separadas por atividade, com critérios de retomada. Hoje a pausa do contrato ainda é global.
- Recuperação e contestação integradas: protocolo privado, validação da nova carteira, contatos anteriores, segundo aprovador e contestação que efetivamente impeça a execução on-chain. Restrições de destino, anúncio, sete dias e preservação dos recebíveis/tempo já existem.
- Controle institucional da tesouraria por duas de três assinaturas. Endereço separado da administração já existe; os três responsáveis e a operação conjunta ainda não estão estabelecidos.
- Coerência entre eventual suspensão/revogação cadastral e permissões no contrato.

## Definições abertas

- Evidência e responsáveis pela abertura oficial do Glamping; acompanhamento da operação durante a vigência. Não foi encontrada data oficial. Projeções 2027–2030 não são uma data de abertura. O calendário de oito semestres e quatro anos desde a abertura já está implementado.
- Pares de aprovadores, substitutos, quóruns e restrições adicionais para liberação da reserva.
- Receita bruta detalhada, prazo de reporte/depósito, revisão do faturamento, retificações e destinação dos arredondamentos.
- Referência de R$ 34.874,14 do memorando v2 já adotada nas simulações e na nova demonstração, por solicitação de Gabriel. Falta conciliar o material financeiro antigo e explicar a precisão/arredondamento da captação; a escolha entre os preços históricos já foi resolvida.
- Moeda, prestador de pagamento/conversão, câmbio e taxas. A compra de teste em stablecoin é atômica no contrato; PIX não está integrado.
- Política definitiva de cancelamento/ausência e atendimento perto do fim da vigência. Por decisão mais recente, cancelamentos permanecem manuais. Não implementar crédito automático de meia cota.
- Sucessão e exceções institucionais: recuperação atual é restrita à mesma pessoa; não constitui sucessão entre titulares.

## Integrações para operação real

Verificação híbrida de identidade; criação/guarda segura das carteiras institucionais; comunicação e avisos; MFA e recuperação da conta; inventário/disponibilidade hoteleira; pagamentos comerciais; proteção, retenção e continuidade dos dados. São limites reais do protótipo, não condições para testar a jornada acadêmica.

## Documentação

O feedback do memorando v2 permanece separado em `2026-09-25-feedback-memorando-v2.md`. O PDF original não foi alterado. Conciliar o memorando com o colega e atualizar o whitepaper/material final. A landing foi alinhada ao comportamento atual; a cópia antiga do whitepaper está explicitamente identificada como histórica.

## Já resolvido — não reapresentar como pendente

Royalties por quantidade × tempo; calendário desde a abertura; ausência de mercado secundário; cadastro/waitlist com prazo de cinco dias úteis; compra após aprovação; conta integrada às cotas; três opções de custódia explicadas; simulação e quantidade editável; fila por prazo com badges; fichas em janela; abas por função, com hospedagens separadas e assistência institucional dentro da única fila de compras; atualização automática de confirmação com a página aberta; cancelamento manual.

Complemento: [jornada por etapa e responsável](2026-09-25-portal-por-etapa-e-responsavel.md). Custódia sem extensão já funciona em Anvil local; infraestrutura real continua pendente.

## Retomada integral e ordem recomendada

Revisão adicional em 25/09/2026, após inspeção da fonte e da jornada. Os itens abaixo detalham a lista anterior e distinguem correções da entrega de infraestrutura para uma operação comercial. Não equivalem a autorização para mudar preços, direitos ou a política provisória de cancelamento.

### Prioridade 1 — fechar a distância entre os aceites e o contrato

| Item | O que falta concretamente | Critério para considerar concluído |
| --- | --- | --- |
| Governança por pilares | Separar cadastro, financeiro, segurança e supervisão no contrato; exigir revisão independente em atos críticos e na troca dos próprios responsáveis | Nenhuma conta isolada consegue executar e remover sua própria salvaguarda; testes de permissões e quórum |
| Pausas seletivas | Separar circulação/compra, apuração e saques; definir quem pode conter e quem autoriza retomada | Incidente de cadastro não bloqueia automaticamente recebíveis já financiados; testes de cada escopo |
| Recuperação e contestação | Unir caso privado, evidências, contato anterior, assinatura da nova carteira, dupla aprovação e cancelamento efetivo on-chain | Contestação aceita impede a execução; cadastro, cotas, saldo e royalties preservados; autoria auditável |
| Carteiras institucionais | Definir responsáveis e implantar tesouraria 2 de 3; validar troca de signatários e perda de chave | Controle real com pessoas/chaves independentes, não apenas três nomes no portal |
| Situação civil versus chain | Definir efeito da suspensão/revogação do cadastro em compras, experiências e direitos já adquiridos; implementar propagação coerente | Estados externos e permissões on-chain conciliados sem apagar recebíveis |
| Destino de recuperação | A fonte rejeita destino com bytecode. Compatibilizar isso com eventual carteira inteligente de participante/custódia | Modalidades prometidas têm caminho de recuperação suportado e testado |

### Prioridade 2 — decisões operacionais a ratificar

- **Abertura:** confirmar documento, data e autoridade para registrar o marco. Registrar acompanhamento da operação ao longo dos quatro anos. O calendário do contrato já funciona; falta o fato externo oficial.
- **Identificação:** periodicidade, gatilhos de nova verificação, exceções e efeito de expiração/suspensão. Escolher fornecedor/processo híbrido; o checklist provisório atual não comprova KYC real.
- **Responsabilidades:** nomes, suplentes, quóruns e prazos de atuação; controles para redução da reserva. A reserva pode ser liberada para venda, conforme decisão aceita.
- **Faturamento:** componentes da receita elegível, fontes e conciliação, prazo de reporte/depósito, revisão independente, tratamento de erro e retificação sem apagar registros anteriores. Definir destinação dos arredondamentos.
- **Moeda e pagamento:** moeda de liquidação, provedor, conversão, validade de cotação, taxas e responsável pelo risco cambial. Não implementar PIX como se fosse atomicamente verificável pelo contrato.
- **Preço/documentação financeira:** R$ 34.874,14 já escolhido; alinhar projeções antigas, precisão e total de captação. Não reabrir a escolha do preço sem novo pedido.
- **Hospedagens:** política definitiva de cancelamento/no-show, força maior, cancelamento pelo operador e falta de disponibilidade perto do fim da vigência. Até lá, análise manual com registro da decisão, sem crédito automático de meia cota.
- **Sucessão e exceções:** definir procedimento externo e compatibilidade com o memorando. A recuperação atual mantém a pessoa e não transfere a herdeiros.

### Prioridade 3 — integrações e robustez para operação real

- Autenticação: confirmar e-mail/telefone, MFA dos operadores e fluxos seguros de recuperação de conta. A senha do portal é distinta da chave da carteira.
- KYC: coleta autenticada, evidência externa, origem dos resultados, acesso por pessoa responsável, retenção e tratamento de exceções; não apenas marcar caixas.
- Custódia: provedor/cofre, geração e guarda de chaves, autorização de gasto, recuperação e continuidade. O adaptador sem extensão é exclusivo do Anvil local.
- Pagamento: financiamento real da carteira/saque, conciliação e integração comercial. tBRL é moeda fictícia de ensaio.
- Operação contínua: notificações, avisos de prazo, acompanhamento de compra sem depender de uma página aberta, monitoramento/reconciliação de eventos e recuperação após indisponibilidade.
- Hospedagens: integrar disponibilidade e confirmação com o inventário real; capacidade, conflito de datas e comunicação com a equipe.
- Dados e continuidade: backup/restauração testados, proteção de evidências e banco, retenção, trilha de acesso, tratamento de incidentes e avaliação de carga/concorrência do ambiente escolhido. Há persistência e travas transacionais locais, mas isso não comprova a operação completa desses controles.

Esses itens não têm a mesma exigência para um protótipo acadêmico e para um produto em operação. Para esta entrega, o essencial é não prometer integração inexistente e demonstrar com precisão o escopo implementado.

### Prioridade 4 — fechar os materiais e a validação da v2

- Revisar com o colega o feedback do memorando; manter o PDF original e consolidar as reposições na versão editorial dele.
- Conciliar whitepaper, textos financeiros e material de entrega com o contrato final; preservar documentos históricos claramente identificados.
- Congelar a fonte final, executar toda a suíte apropriada e regenerar o pacote de entrega. ZIPs anteriores não passam a refletir alterações locais automaticamente.
- Produzir novo deploy/evidências da versão escolhida e o relatório em inglês. O guia entregue nesta rodada é preparação, não operação pública executada.
- Tratar publicamente o tempo: semestre e sete dias não podem ser acelerados em Sepolia; declarar a cobertura local/pública separadamente.
- Confirmar visualmente com Gabriel a nova interface. A rodada automatizada verifica funcionamento e responsividade; a aceitação estética depende do uso dele.
- Conferir o cursor de anotações no navegador do Codex. A incompatibilidade de estilos foi mitigada apenas na demo local na rodada anterior; o funcionamento da ferramenta do aplicativo ainda não foi confirmado pelo usuário.

### Concluído nesta revisão de interface

Cadastro distribuído em três etapas; explicações de custódia sob demanda; experiência sem simulador ou formulário sempre aberto; compra concentrada na próxima ação; filas administrativas com concluídos separados e ficha em janela; navegação pública menor e regras em tópicos expansíveis; preço do script de publicação alinhado ao memorando. Ver [registro da revisão](2026-09-25-interface-progressiva.md).

O guia e o roteiro do artefato estão em [Deploy e Evidências](../entrega/guia-deploy-e-evidencias-v2.md). A ordem recomendada de retomada é governança → pausas → recuperação/cadastro → conciliação final dos documentos e evidências. Integrações comerciais ficam em trilha própria, com seus limites declarados na entrega acadêmica.
