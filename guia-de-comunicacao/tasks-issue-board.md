# Tasks para o issue board do GitLab — Sprint 3

Formato: título (imperativo) + descrição em parágrafo único. Copiar cada bloco como uma issue.

## Artefato: Implementação do Contrato Inteligente ERC-20 (v1)

**1. Ratificar as decisões da v1 do IBIToken e harmonizar o whitepaper**
A implementação v1 do contrato fixou quatro pontos que o whitepaper deixava em aberto ou descrevia de duas formas: transferência apenas para carteiras que já têm saldo (sem lista de aprovados), royalty registrado no reporte e pago por saque em stablecoin (pull) em vez de envio automático, pausa de emergência incluída e parâmetros econômicos imutáveis após o deploy. Levar esses quatro pontos à reunião do grupo, registrar a decisão em ata e atualizar as seções 3.1, 4.3, 6.2, 9.1, 10.1, 10.3 e 10.5 do whitepaper para uma única versão, corrigindo também a reserva descrita como "5%" (é 1/3 do supply) nas seções 9.1 e 12.1 e o teto descrito como "2%" (é 2/15) na seção 12.3 e no artefato de Riscos Éticos 2.3. Referência: `smart-contract/docs/premissas-e-pendencias.md`, seções 2 e 3.

**2. Fazer o deploy do IBIToken na Sepolia com a carteira administrativa e registrar a entrega**
Seguir `smart-contract/docs/guia-de-execucao.md` (seções 6 e 7): configurar o keystore com RPC e chave de uma carteira de teste com ETH Sepolia, executar `npm run deploy:sepolia` (módulo de demonstração com stablecoin de teste), verificar o código no Etherscan/Sourcify, executar pelo script `operate-sepolia.ts` uma compra primária para duas carteiras, uma transferência entre elas pela MetaMask, um resgate e um reporte de receita, e preencher a tabela "Registro da entrega" com endereços e hashes das transações. Versionar `ignition/deployments/chain-11155111`.

**3. Revisar a suíte de testes do IBIToken contra a tabela de travas do whitepaper**
Ler `smart-contract/test/IBIToken.ts` (50 casos) ao lado da seção 9.2 do whitepaper e da tabela "regra de negócio → regra computacional" do README, conferindo que cada trava (teto de emissão, validade, resgate único, transferência só para portadores, limite por carteira, permissões) tem ao menos um teste positivo e um negativo, e propor casos faltantes — por exemplo, transferência de exatamente o teto, reemissão para a carteira administrativa, reporte com faturamento que gere arredondamento — abrindo um merge request com os testes adicionais e a saída atualizada em `docs/relatorio-de-testes.md`.

**4. Definir a stablecoin e o procedimento operacional do pagamento do royalty (D9)**
O contrato aceita qualquer ERC-20 como meio de pagamento e, nos testes, usa uma stablecoin de teste com seis casas decimais. Com a direção financeira da IBITI (Mariana Reis), escolher a stablecoin real (em reais ou em dólar, emissor, rede), descrever o fluxo semestral completo — recebimento do royalty do Glamping, conversão, aprovação do contrato, chamada de `reportRevenue` com o hash do relatório e comunicação aos portadores — e registrar quem executa cada etapa, com que evidência e em que prazo. Resultado: uma seção "Procedimento de apuração e pagamento" para o whitepaper e o roteiro do financeiro.

**5. Executar análise de segurança do contrato (estática e revisão de casos extremos)**
Rodar uma análise estática (Slither ou ferramenta equivalente) sobre `contracts/IBIToken.sol`, revisar manualmente reentrância em `claimRoyalty` e `reportRevenue`, o custo do laço de reporte com 150 carteiras, o comportamento da pausa em cada função e a rotação da carteira administrativa em dois passos, e documentar achados e correções em `smart-contract/docs/seguranca.md`. Este é o item 3 do roadmap de validação (seção 13 do whitepaper) e pré-requisito para a versão 2.

**6. Publicar o artefato no GitLab e preparar a demonstração da Sprint 3**
Copiar a pasta `smart-contract/` para a raiz do repositório do grupo, criar `Sprint 3/Implementacao_Smart_Contract_v1.md` com o resumo do artefato e links para README, docs e registro da entrega na Sepolia, conferir que `npm install && npm test` funciona em uma máquina limpa, e preparar a demonstração de dez minutos seguindo o roteiro da seção 9 do guia de execução (status do contrato, compra primária, transferência entre membros, tentativa rejeitada, resgate, reporte e saque).

## Artefato: Guia de Comunicação

**7. Recriar no Figma as telas do fluxo compra → recebimento → resgate a partir do board**
Importar no Figma os SVGs de `guia-de-comunicacao/mockups/svg/` (uma tela por arquivo, textos editáveis; a landing por seção em desktop e celular, as páginas de detalhe inteiras) ou o HTML (`board/index.html`, `landing/index.html`) pelo plugin html.to.design, recriar a animação de rolagem descrita na seção 12 do README como protótipo, criando os estilos de cor e tipografia listados no README do guia, organizando as telas por etapa da jornada (verificação, compra, recebimento, Passaporte, resgate, extrato, transferência, recuperação de acesso, parceiro, painel de transparência) e mantendo os textos exatamente como estão no catálogo de mensagens; registrar no arquivo Figma as anotações de comunicação de cada tela.

**8. Validar o catálogo de mensagens do sistema com a operação da IBITI**
Apresentar ao ponto focal da IBITI (Matheus Granato, com apoio de Joaquim Monteiro para o resgate e Mariana Reis para o extrato de royalty) as mensagens de erro, confirmação e feedback do `guia-de-comunicacao/README.md` (seção 7) e a terminologia adotada (seção 5), coletando ajustes de vocabulário, prazos citados nas mensagens (verificação, voucher, pagamento) e canais reais de atendimento (concierge, e-mail, telefone), e atualizando o guia e o board com o resultado.

**9. Diagramar o Guia de Comunicação e publicar no GitLab da Sprint 3**
Revisar o texto do `guia-de-comunicacao/README.md`, incluir o link do arquivo Figma (após a task 7) e das telas exportadas, exportar do Figma o formato final pedido pela disciplina (PDF ou board) e publicar em `Sprint 3/Guia_de_Comunicacao.md`, garantindo que o documento apresenta explicitamente princípios, tom de voz, padrões de microcopy, mensagens do sistema e estratégia de comunicação de dados, cada um com exemplos ligados aos fluxos reais da solução.
