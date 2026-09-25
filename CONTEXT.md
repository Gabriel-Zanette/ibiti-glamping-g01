> Preparação oficial separada em `entrega/v2/`: espelho das três pastas de artefatos, apoio, fontes Remix, ZIPs e manifestos. Regenerar com `npm run package:delivery --prefix smart-contract`; as cópias fora de `v2/` são históricas. O espelho local ainda não é envio ao GitLab.

> Próxima retomada pedida por Gabriel em 25/09/2026: além das pendências anteriores, remodelar os pilares administrativos e aprimorar a custódia. São novas frentes de desenho, ainda sem definição detalhada; não tratar a atual divisão de papéis como solução final ratificada.

> Revisão adicional de interface em 25/09/2026: cadastro em três etapas, compra centrada na ação atual, formulários e detalhes sob demanda, filas por estado e páginas públicas simplificadas. Registro: `docs/decisoes/2026-09-25-interface-progressiva.md`. Guia para o responsável pelo artefato on-chain e roteiro mínimo em inglês: `docs/entrega/`. Pendências detalhadas por prioridade no documento de retomada; não houve novo deploy público.

> Atualização de UX em 25/09/2026: landing em `/`, conta em `/conta`; referência R$ 34.874,14/IBT do memorando v2. Financeiro só acessa Compras; assistência institucional integra essa fila. Titular entra em Experiências, sem simulador; conta e compra ficam separadas. Fluxo institucional local sem extensão, com solicitação, vínculo, consentimento e pagamento. Ver `docs/decisoes/2026-09-25-portal-por-etapa-e-responsavel.md`. Pendências em `AGENTS.md` e `docs/decisoes/2026-09-25-pendencias-para-retomada.md`.

> **Estado consolidado em 25/09/2026:** [inventário integral](docs/decisoes/2026-09-25-inventario-completo-token.md) e [feedback do memorando v2 recebido](docs/decisoes/2026-09-25-feedback-memorando-v2.md). Versão oficial publicada: v1; próxima entrega: v2. “v4” é revisão interna de testes. Implementados nessa revisão: royalties por tempo, abertura relativa, bloqueio de transferências ordinárias e recuperação com sete dias. Jornada/waitlist e cancelamento manual funcionam localmente. Governança conjunta, pausa seletiva e integrações externas ainda pendentes. Os registros datados abaixo preservam propostas/estados anteriores e não substituem esta consolidação.

# IBITI Glamping

Vocabulário do programa que associa participação em royalties e experiências de hospedagem ao IBIToken. Decisões ficam em `docs/adr/`; propostas e perguntas, em `docs/decisoes/`.

## Language

**Participante**:
Pessoa cuja participação no programa é reconhecida; uma pessoa pode controlar várias carteiras.
_Avoid_: Carteira, endereço ou conta como sinônimos de pessoa.

**Candidato**:
Pessoa que solicita ingresso no programa e aguarda a decisão de seleção, mantendo o mesmo cadastro quando aprovada.
_Avoid_: Titular de tokens, participante já habilitado a usar hospedagens.

**Waitlist**:
Fila de candidaturas acompanhadas até a decisão administrativa de ingresso no programa.
_Avoid_: Pré-venda, reserva de tokens, garantia de aprovação por ordem de chegada.

**Aprovação de ingresso**:
Decisão que reconhece a elegibilidade da pessoa para avançar na aquisição.
_Avoid_: Compra concluída, token entregue, cota concedida.

**Conta do Passaporte**:
Acesso pessoal à candidatura e, após aquisição, aos direitos e histórico do programa no mesmo cadastro.
_Avoid_: Carteira digital, nova pessoa para cada etapa.

**Abertura do Glamping**:
Início do atendimento comercial regular oficialmente reconhecido, que inicia os quatro anos do programa.
_Avoid_: Emissão, início da oferta, início de janeiro.

**Vigência do programa**:
Quatro anos contados da abertura do Glamping.
_Avoid_: Quatro anos desde cada compra, 2027–2030 como datas confirmadas.

**Semestre do programa**:
Cada intervalo de seis meses contado da abertura e dos aniversários semestrais seguintes.
_Avoid_: Semestre civil, 180 dias como equivalentes automáticos.

**Data de corte**:
Limite temporal que encerra a contribuição da posse para o rateio de um semestre.
_Avoid_: Fotografia única do saldo, data do pagamento ou reporte posterior.

**Posição ponderada por tempo**:
Quantidade média de IBT mantida pela pessoa durante um semestre, considerando quanto tempo cada saldo permaneceu com ela.
_Avoid_: Saldo apenas no último dia, bônus por idade do token antes do semestre.

**Apuração de royalties**:
Determinação da receita elegível de um período e do royalty correspondente.
_Avoid_: Saque, recebimento.

**Disponibilização de royalties**:
Momento em que o valor devido fica disponível para o participante receber.
_Avoid_: Recebimento simultâneo por todos.

**Recuperação de acesso**:
Restabelecimento do controle da posição e dos recebíveis da mesma pessoa após perda ou comprometimento da carteira.
_Avoid_: Sucessão, transferência de titularidade entre pessoas.

**Sucessão**:
Alteração da pessoa titular dos direitos mediante procedimento aplicável à sucessão.
_Avoid_: Simples troca de carteira.

**Reserva de IBT**:
Quantidade de unidades da emissão preservada na tesouraria e indisponível para venda enquanto reservada.
_Avoid_: Reserva de caixa, lastro da stablecoin, novos tokens.

**Estoque disponível**:
Unidades mantidas na tesouraria que podem ser destinadas à compra primária, excluída a reserva.
_Avoid_: Oferta total, reserva.

**Liberação da reserva de IBT**:
Destinação autorizada de unidades antes reservadas ao estoque disponível para venda.
_Avoid_: Emissão adicional, venda concluída, transferência automática.

**Elegibilidade para o programa**:
Atendimento aos critérios de participação estabelecidos pela IBITI.
_Avoid_: Identidade comprovada como sinônimo de elegibilidade.

**Identidade comprovada**:
Conclusão de um processo que avalia autenticidade das evidências e seu vínculo com a pessoa que as apresenta.
_Avoid_: CPF com dígitos válidos, reputação ou controle de carteira como provas suficientes isoladamente.

**Compra secundária**:
Aquisição de IBT de outro participante; modalidade retirada do desenho atual do programa.
_Avoid_: Compra primária, recuperação de acesso da mesma pessoa.

**Cota de hospedagem**:
Direito a uma experiência de três noites para até cinco pessoas, sujeito às condições do programa; uma unidade pode originar uma cota ao longo da emissão, sem renovação periódica.
_Avoid_: Novo token, cota renovada após transferência.

**Reserva de hospedagem**:
Compromisso relativo a uma estadia solicitada ou confirmada, associado às cotas correspondentes.
_Avoid_: Reserva de IBT.

**Cota comprometida**:
Direito de hospedagem separado para uma estadia e indisponível para uma nova solicitação enquanto permanecer comprometido.
_Avoid_: Token bloqueado, cota já consumida.

**Cota consumida**:
Direito de hospedagem já utilizado, que não gera uma nova experiência pela transferência do token.
_Avoid_: Token queimado, redução da participação em royalties.

**Cancelamento de hospedagem**:
Desistência ou encerramento de uma reserva, cujo efeito sobre a cota segue a política aplicável àquela reserva.
_Avoid_: Cancelamento da compra do token, recompra de IBT, remarcação.

**Custódia IBITI**:
Guarda e operação institucional da carteira dedicada ao participante, que acessa o programa por sua conta.
_Avoid_: Carteira coletiva, mera orientação, controle direto das chaves pelo participante.

**Autocustódia assistida**:
Controle da carteira pelo próprio participante, com orientação da equipe nas etapas de uso.
_Avoid_: Compartilhamento de chave privada ou frase de recuperação.

**Autocustódia direta**:
Controle e operação da carteira pelo participante sem acompanhamento necessário da equipe.
_Avoid_: Cadastro separado, dispensa de aprovação de ingresso.

**Cancelamento em análise**:
Solicitação pendente de decisão do atendimento sobre uma hospedagem e o destino da cota comprometida.
_Avoid_: Devolução automática, meia cota já disponível, cancelamento da compra do token.
