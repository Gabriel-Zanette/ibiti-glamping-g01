# Interface por etapa — revisão de 25/09/2026

Pedido: reduzir informação excessiva e melhorar usabilidade e aparência em todas as telas públicas, do participante e da equipe. Aplicada a skill UI/UX Pro Max, com consulta ao gerador de sistema visual e às recomendações de formulários/acessibilidade. A recomendação genérica de minimalismo foi adaptada à identidade existente da IBITI: oliva, papel claro, fotografia do território, serifada nos títulos e fonte de sistema na interface. Não foram adicionadas bibliotecas, fontes remotas, depoimentos inventados ou animações que disputem atenção.

## Critério de organização

Mostrar primeiro a decisão atual. Quantidade, preço, direitos relevantes e ação disponível permanecem visíveis; histórico, explicações extensas e etapas futuras ficam acessíveis sob demanda. Reduzir exposição inicial não deve esconder termos da autorização nem remover evidência administrativa.

## O que mudou

| Área | Alteração e finalidade |
| --- | --- |
| Landing | Texto principal menor, navegação com quatro destinos, menos seções repetidas; simulação e cadastro como sequência clara. Removida a rolagem forçada por telas inteiras |
| Programa e transparência | Tópicos expansíveis, mantendo regras, limitações e fontes históricas. Link direto com fragmento abre o tópico correto |
| Perguntas | Mesmo sistema visual e navegação simplificada; leitura por questão |
| Login | Formulário único, instrução curta e ajuda recolhida |
| Cadastro | Três etapas: dados, escolhas, senha/termos. Voltar preserva os dados. Validação acompanha a etapa visível |
| Custódia | Três alternativas com linguagem cotidiana; benefício e responsabilidade da alternativa selecionada aparecem ao escolher. Mantida a possibilidade de mudar antes da compra |
| Waitlist | Situação, mensagem e prazo primeiro; dados, preferências e histórico como consulta complementar |
| Experiências | Cotas livres como informação principal; reservadas/usadas como apoio; formulário só abre ao solicitar hospedagem. Nenhum simulador na tela |
| Compra | Quantidade, total e próxima ação visíveis. Detalhes, sequência e cancelamento ficam em seção expansível. Autorizar valor permanece explícito |
| Conta | Dados essenciais, alteração de custódia e histórico separados. Login e hospedagem continuam sem pedido de carteira |
| Administração | Título do papel, abas permitidas, busca e fila enxuta; candidaturas e compras concluídas ficam em filtro próprio. Prazo e próximo responsável substituem textos repetidos |
| Ficha | Janela com resumo do cadastro, checklist, decisão fundamentada e mensagem ao candidato. Histórico recolhido |
| Financeiro | Uma fila de compras, com a etapa atual e seu responsável. O perfil continua impedido de acessar candidaturas e hospedagens no backend |
| Mobile e teclado | Botões e campos principais de pelo menos 44 px, foco visível, abas navegáveis por teclado, modal com rolagem própria, sem rolagem horizontal nos estados verificados |

O cancelamento permanece manual; não foram introduzidas novas regras econômicas. A simulação usa R$ 34.874,14/IBT. O script de publicação também foi alinhado a essa referência, com teste do preço gravado no registro.

## Verificação efetivamente realizada

- 28 testes do serviço off-chain aprovados; os dois projetos passaram em TypeScript.
- Dois testes dos scripts Remix aprovados, incluindo preço e formatos de artefatos.
- Jornada no Chrome automatizado, com base Anvil isolada: landing → cadastro em três etapas → aprovação pela supervisão → pedido de compra → preparação institucional → autorização do vínculo → preparação do pedido → consentimento do participante → pagamento de teste → liberação automática de duas cotas → solicitação de hospedagem.
- Financeiro sem acesso às APIs de candidaturas e hospedagens: respostas 403. Não se trata apenas de esconder abas.
- Navegação e imagens verificadas em desktop 1440 px e mobile 390 px: páginas públicas, cadastro, login, escolhas, experiências, compra, conta, fila, ficha e custódia direta. Busca sem resultado e filtro de candidaturas concluídas também verificados. Nenhum erro JavaScript observado nesses ensaios.
- Validação visual do guia PDF, com dez páginas renderizadas e conferidas.

Uma repetição intensiva inicial encontrou o limitador de requisições da demonstração compartilhada. A rodada completa final foi executada em ambiente isolado, sem remover o limitador. A base habitual na porta 3001 permanece disponível com seus perfis de demonstração; a porta 3002 serviu somente ao ensaio isolado.

Não foi repetida toda a suíte Solidity nesta rodada, pois as alterações ficaram na apresentação e no preço do script. A rodada final da entrega deve executar a suíte completa da fonte congelada. Também não se demonstrou operação comercial de custódia nem se confirmou o cursor de anotação do aplicativo Codex; esses limites continuam registrados nas pendências.

## Continuidade

Demo habitual: `http://localhost:3001/`; login: `/conta#entrar`. Uma atualização da página carrega os novos arquivos. Guia de credenciais e papéis em `smart-contract/docs/guia-v4.md`.

[Pendências consolidadas](2026-09-25-pendencias-para-retomada.md) · [Guia do novo artefato](../entrega/guia-deploy-e-evidencias-v2.md). A única versão oficial publicada continua sendo a v1; a revisão interna atual se destina à v2.
