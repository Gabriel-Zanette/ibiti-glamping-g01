# Segunda entrega de implementação — preparação local

A Parte 2 utiliza a versão técnica 3 corrigida após o feedback de 8,4/10. Está em [Implementação do Contrato Inteligente ERC-20 - versão 2](<Implementação do Contrato Inteligente ERC-20 - versão 2/README.md>), pronta para inclusão na sprint de destino definida pela turma. Ainda não houve envio remoto nem deploy público desta revisão.

Principais correções: teto por pessoa, tesouraria separada, calendário semestral, recuperação com anúncio de 48h e recebíveis sem saldo, compra stablecoin atômica e integração de cadastro/cotas. Código, testes, roteiro, whitepaper e matriz dos oito critérios estão no pacote.

---

## Conteúdo histórico da entrega anterior

O conteúdo abaixo documenta exclusivamente a Parte 1 e o deploy técnico v2 de 11/09. Não descreve as novas salvaguardas.

# IBIToken — IBITI Glamping

Projeto acadêmico de tokenização desenvolvido no Inteli pelo Grupo G01, no módulo ADMD7, com foco no IBITI Glamping. O programa combina pertencimento ao ecossistema, experiências de hospedagem e participação em royalties.

**Estado atual:** IBIToken v2 publicado e verificado na rede de testes Sepolia, com serviço off-chain de cotas por pessoa e demonstração funcional. Não há emissão comercial na Mainnet, oferta pública ou operação hoteleira e financeira real integrada.

**Equipe:** Adriana Policia, Erik Vieira, Gabriel Leon, Gabriel Zanette, Lavínia Mendonça e Thomas Brand.

## Sobre o projeto

O programa propõe antecipar recursos associados a 15% do faturamento bruto do Glamping durante o horizonte econômico de 2027 a 2030. Esses recursos destinam-se à IBITI e ao seu ecossistema. O modelo pressupõe investimento no empreendimento por um terceiro; não apresenta a venda dos tokens como financiamento da construção do hotel.

O IBT não representa participação societária ou propriedade imobiliária. Os direitos econômicos dependem da cessão de recebíveis e dos instrumentos da operação. O código organiza saldos, circulação e pagamentos, mas não comprova receita real ou prestação de hospedagem.

## Documentos e entregas atuais

- **[Whitepaper atualizado — Sprint 3](Sprint%203/Whitepaper%20T%C3%A9cnico%20do%20Ativo%20Digital/whitepaper_ibiti_revisado.pdf):** finalidade, regras, arquitetura do IBIToken v2 e projeções do arquivo Modelo Glamping.xlsx. Substitui a edição histórica da Sprint 2 como referência do modelo atual.
- **[Implementação do Contrato Inteligente ERC-20 - versão 1](Sprint%203/Implementa%C3%A7%C3%A3o%20do%20Contrato%20Inteligente%20ERC-20%20-%20vers%C3%A3o%201/README.md):** contratos, scripts Remix, testes, serviço off-chain e evidências da publicação. “Versão 1” é o nome do artefato acadêmico; o contrato de referência é o IBIToken v2.
- **[Estrutura Jurídica](Sprint%203/Estrutura%20Jur%C3%ADdica):** instrumentos e enquadramento da operação.
- **[Memorando de oferta - versão 1](Sprint%203/Memorando%20de%20oferta%20-%20vers%C3%A3o%201):** condições propostas de aquisição e distribuição.
- **[Gestão de Projeto](Sprint%203/Gest%C3%A3o%20de%20Projeto):** acompanhamento, riscos e responsabilidades.

O guia de comunicação integra o conjunto de artefatos do grupo e orienta as jornadas do Passaporte. Documentos históricos devem ser lidos considerando a evolução registrada no whitepaper atual; a publicação de código não atualiza automaticamente minutas ou outros arquivos.

## Organização do repositório

```text
README.md
Sprint 1/                          Diagnóstico e contexto
Sprint 2/                          Documentação histórica
  Gestão de Projeto/
  Riscos éticos e impacto/
  Whitepaper Técnico do Ativo Digital/
Sprint 3/
  Estrutura Jurídica/
  Gestão de Projeto/
  Implementação do Contrato Inteligente ERC-20 - versão 1/
    contracts/
    scripts/
    tests/
    offchain/
    tools/
    docs/
    deployments/
  Memorando de oferta - versão 1/
  Whitepaper Técnico do Ativo Digital/
    whitepaper_ibiti_revisado.pdf
```

A versão anterior do whitepaper permanece na Sprint 2 para preservar o histórico. A edição atual da Sprint 3 incorpora a modelagem tecnológica e os números financeiros fornecidos pelo grupo.

## Regras atuais do token

| Parâmetro | Definição |
| --- | --- |
| Ativo | IBIToken, símbolo IBT, ERC-20 fungível |
| Oferta total | 150 IBT, indivisíveis, zero casas decimais |
| Reserva inicial | 50 IBT; um terço da emissão |
| Estoque para colocação | 100 IBT |
| Limite | 20 IBT por carteira de participante; o serviço de cotas também verifica o agregado das carteiras de uma pessoa |
| Royalties | 15% do faturamento bruto elegível, incluindo hospedagem e consumo |
| Rateio | Saldo na transação de apuração, dividido pela oferta de 150 IBT, incluindo reserva e estoque administrativo |
| Calendário econômico | 2027 a 2030; oito apurações semestrais. O contrato limita a quantidade de períodos, mas não impõe o intervalo semestral |
| Experiências | Uma cota por IBT para toda a emissão, sem renovação periódica |
| Hospedagem por cota | 3 noites consecutivas, até 5 pessoas no total e serviços comuns do local escolhido, mediante disponibilidade |
| Cancelamento | Quando elegível, devolve a mesma cota após conciliação, sem ampliar direitos ou prazo de vigência |
| Governança | Administração com troca de proprietário em duas etapas, pausa e recuperação de carteira |
| Emissão adicional | Sem função pública para criar novos IBT; recuperação mantém a oferta por queima e emissão compensatórias |

Reserva de 50 IBT equivale a 5 dos 15 pontos percentuais do faturamento tokenizado. O limite de 20 IBT equivale a 2 dos 15 pontos. Essas proporções não significam reserva de 5% dos tokens ou limite de 2% dos tokens.

## Hospedagem por pessoa: fluxo off-chain

1. O cadastro da pessoa é aprovado e suas carteiras são vinculadas mediante assinatura. Assinar comprova controle da carteira, não identidade civil.
2. O serviço consulta posições e eventos finalizados da blockchain e concilia o livro de cotas. A pessoa tem um histórico único mesmo utilizando várias carteiras.
3. O pedido separa cotas disponíveis. A operação confirma a disponibilidade da hospedagem e, depois, registra sua realização.
4. A conclusão transforma a cota reservada em utilizada. O cancelamento elegível passa por devolução pendente até a conciliação liberar a mesma cota.

Pedido e uso de hospedagem **não queimam, bloqueiam nem marcam tokens como resgatados no contrato**. Não existem IDs individuais para as unidades de IBT, NFTs auxiliares ou estados on-chain `active`/`redeemed`. Membership e participação nos royalties podem continuar após o consumo da experiência.

Ao transferir IBT, acompanham a movimentação somente cotas livres, limitadas à quantidade transferida. Cotas utilizadas não reaparecem e trocar de carteira não zera o consumo. Por isso, ter um IBT não assegura que ainda exista uma hospedagem disponível: o saldo de cotas e o histórico devem ser consultados separadamente.

A reserva de hospedagem não bloqueia transferências de IBT. Etapas de confirmação e conclusão revalidam a posição elegível. O livro distingue cotas livres, comprometidas, utilizadas e em devolução; não usa apenas “saldo atual menos hospedagens utilizadas”.

## Compra, circulação e royalties

A compra primária é operacionalizada pelo administrador após identificação, vínculo e confirmação do pagamento externo. `primaryPurchase` transfere estoque e registra referência, sem processar PIX, reais ou documentos pessoais.

Entre participantes, a transferência secundária exige destinatário que já possua IBT, ressalvado o retorno à administração. A aprovação cadastral off-chain, por si só, não autoriza receber uma transferência secundária em carteira nova. `approve` do ERC-20 é autorização de gasto, não aprovação cadastral. Limites, pausa, reserva, revogação e expiração se aplicam conforme o contrato.

O administrador informa a receita bruta e sua referência documental. Com stablecoin configurada, a apuração calcula as parcelas e exige o depósito correspondente na mesma transação. Cada titular solicita o recebimento por `claimRoyalty`; não existe envio espontâneo a todas as carteiras. Obrigações já apuradas permanecem com a carteira considerada na apuração, salvo tratamento de recuperação.

Sem stablecoin configurada, o contrato pode registrar liquidação externa já realizada. Essa função não executa transferência bancária. Após a configuração inicial de uma stablecoin, o endereço não pode ser trocado ou removido; a modalidade de pagamento é definida por período.

## Projeção financeira atual

Referência: **Modelo Glamping.xlsx**, abas “Valor do token”, “Wacc” e “Sensibilidade”, fornecido pelo grupo em 11/09/2026 e consultado sem alterações.

| Indicador | Cenário-base da planilha |
| --- | --- |
| Ocupação em 2027 / 2028 / 2029 / 2030 | 35% / 20% / 25% / 30% |
| Unidades operacionais | 6 / 20 / 20 / 20 |
| Diária inicial / crescimento anual | R$ 7.333,00 / 10% |
| Consumo inicial por hospedagem / crescimento anual | R$ 2.000,00 / 4,5% |
| Taxa de desconto anual | 17,8609%; cenário sem dívida |
| Royalties nominais projetados nos quatro anos | R$ 8.923.259,16 |
| Valor presente dos royalties | R$ 5.558.278,01 |
| Referência por IBT | R$ 37.055,19 |
| Referência para colocação de 100 IBT | R$ 3.705.518,67 |

O valor por token decorre do desconto dos fluxos no fim de cada ano, com base em 2026. A planilha não detalha recebimentos por semestre. O cálculo das 100 unidades usa a precisão integral do valor unitário; os números acima são apresentados em centavos. Projeção de receita e taxa de desconto não são promessa de retorno. Condições comerciais pertencem ao memorando da oferta. A memória de cálculo e as sensibilidades estão no capítulo 4 e no Apêndice B do whitepaper atualizado.

## Implementação, testes e rede

O contrato de negócio é o **IBIToken v2**. O **MockStablecoin/tBRL** é um contrato separado para simular pagamentos; não representa dinheiro real e não aumenta a oferta de IBT. As bibliotecas da OpenZeppelin são dependências do código compilado, não novos produtos ou emissões do projeto.

| Evidência | Identificação |
| --- | --- |
| Rede de referência | Ethereum Sepolia, chain ID 11155111 |
| IBIToken v2 | `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030` |
| Bloco de publicação | 11684811 |
| Transação | [Publicação na Sepolia](https://sepolia.etherscan.io/tx/0x415a6618a50981407552e4297c48ab0e66c724d03d846cc3f9c165b5a114fb5c) |
| Verificação | [Sourcify — correspondência exata](https://repo.sourcify.dev/11155111/0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030/) |
| Publicação | Remix e MetaMask |
| Compilação | Solidity 0.8.34, EVM Osaka, otimizador 200, OpenZeppelin 5.6.1 |
| Validação local | 60 casos efetivos aprovados e verificação de tipos dos dois módulos |

O workspace utiliza **Remix**, com `contracts/`, `scripts/` e `tests/`. A alternativa de validação local usa solc, Anvil, ethers e Node.js 24+. **Não utiliza Hardhat.** O serviço off-chain utiliza API Node.js, SQLite, autenticação por assinatura, indexação de eventos finalizados e livro de cotas por pessoa.

Os procedimentos de execução estão no [guia técnico](Sprint%203/Implementa%C3%A7%C3%A3o%20do%20Contrato%20Inteligente%20ERC-20%20-%20vers%C3%A3o%201/docs/guia-de-execucao.md). Os testes são evidência funcional local, não auditoria independente ou comprovação de execução de toda a suíte no plugin do Remix.

A v2 não usa proxy. Alterar arquivos não modifica o contrato publicado; nova implantação exige novo endereço e tratamento explícito de saldos e histórico. A v1 permanece histórica, sem migração automática e sem aumentar a oferta da emissão v2. A janela de teste de 11/09/2026 a 10/09/2030 é distinta do horizonte econômico projetado de 2027 a 2030.

## Operação prevista e limites atuais

Ethereum Mainnet, ERC-20 e BRZ compõem a arquitetura comercial prevista, com Transfero como referência de integração financeira. Não há contratação apresentada de VASP/PSAV, integração real de conversão BRL/BRZ ou publicação comercial. O backend de referência opera nas redes local e Sepolia.

A demonstração utiliza carteira própria e aprovação cadastral pelo operador; não possui KYC civil real, custodiante institucional ou integração com inventário e reservas da IBITI. Custódia comercial ainda depende de definição. A administração do contrato é única, sem DAO, votação de titulares ou carteira de múltiplas assinaturas configurada.

O software registra cotas, pedidos, confirmação, conclusão e devolução, mas ainda não impõe automaticamente 3 noites, máximo de 5 hóspedes ou prazo comercial de cancelamento. Prazo de antecedência para cancelar, penalidades e no-show dependem do regulamento. A prestação efetiva da hospedagem e a veracidade da receita continuam externas à blockchain.

As próximas validações abrangem condições do parceiro, instrumentos jurídicos, política de hospedagem e custódia, integração de pagamentos, auditoria independente, segurança e continuidade da infraestrutura. O enquadramento do ativo não é determinado pelo padrão ERC-20.

## Equipe e gestão

| Integrante | Responsabilidade principal na Sprint 3 |
| --- | --- |
| Lavínia Mendonça | Gestão de Projeto e Memorando da Oferta |
| Thomas Brand | Estrutura Jurídica e Gestão de Projeto |
| Adriana Policia | Guia de Comunicação e Gestão de Projeto |
| Gabriel Zanette | Smart Contract e atualização tecnológica do whitepaper |
| Gabriel Leon | Memorando da Oferta |
| Erik Vieira | Estrutura Jurídica e Guia de Comunicação |

A gestão acompanha riscos, responsabilidades, revisão cruzada e coerência dos artefatos. Uma mudança no modelo deve ser refletida no whitepaper e nos documentos afetados; evidências de implantação e testes devem identificar a versão a que se referem.

## Histórico

| Sprint | Foco | Resultado |
| --- | --- | --- |
| Sprint 1 | Diagnóstico | Contexto e problema do parceiro |
| Sprint 2 | Estruturação | Whitepaper inicial, riscos e premissas do programa |
| Sprint 3 | Validação | Contrato v2 na Sepolia, cotas off-chain por pessoa e whitepaper com projeções financeiras atualizadas |

Este repositório contém material acadêmico e de prototipação. Não constitui oferta pública, recomendação de investimento, aprovação regulatória ou garantia de rentabilidade. Não há distribuição automática de tokens a colaboradores ou produtores locais, nem certificação de impacto ambiental decorrente da emissão.
