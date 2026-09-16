# Whitepaper IBITI

Edição de setembro de 2026, com redação institucional voltada ao leitor externo. Apresenta finalidade, direitos, regras econômicas, experiências, governança e funcionamento tecnológico do IBIToken v2. O documento-base whitepaper_ibiti_4.pdf fornecido pelo grupo foi preservado.

- Fonte editável: [whitepaper_ibiti_revisado.md](whitepaper_ibiti_revisado.md).
- PDF: [whitepaper_ibiti_revisado.pdf](../output/pdf/whitepaper_ibiti_revisado.pdf).
- Gerador: [render_whitepaper.py](render_whitepaper.py).
- Conferência da edição: [validacao.json](validacao.json).

## Diretriz editorial

O whitepaper explica o programa; não é relatório de trabalho ou alinhamento estratégico. Foram retirados decisões numeradas, comparação entre rascunhos, recomendações à equipe, roadmap, árvore de pastas, relato de correções e instruções de demonstração. As regras tecnológicas continuam detalhadas.

O capítulo 12 trata de transparência e prestação de contas. O capítulo 13 delimita a implementação acadêmica, os serviços disponíveis e condições comerciais ainda não estabelecidas. O Apêndice C identifica a implantação Sepolia; o Apêndice D reúne documentação de referência e fontes. A redação institucional não representa chancela da IBITI, oferta aprovada ou contratação de serviços.

A revisão financeira de 11/09/2026 incorporou as abas “Valor do token”, “Wacc” e “Sensibilidade” do arquivo Modelo Glamping.xlsx fornecido pelo grupo, sem alterar o arquivo. Foram atualizados os itens 4.3 e 4.4, o Apêndice B e a referência financeira em D.1. A arquitetura, as regras do token, o contrato e o backend foram preservados. A skill de contexto mantém a exigência de alerta quando uma mudança afetar o modelo descrito no whitepaper.

## Decisões de trabalho mantidas fora do whitepaper

- Política confirmada: uma experiência por IBT durante toda a emissão, sem renovação; somente cotas livres acompanham transferências.
- Experiência confirmada: 3 noites consecutivas, até 5 pessoas e serviços comuns da hospedagem.
- Prazo de cancelamento e tratamento de cancelamento tardio/ausência ainda dependem do usuário. A recomendação de 7 dias não foi aprovada.
- Autocustódia assistida foi recomendada, mas a jornada comercial não foi decidida. O whitepaper descreve apenas o suporte atual a carteira própria e a ausência de custódia institucional.
- Valuation atualizado com a planilha do responsável financeiro: R$ 37.055,19 por token, WACC de 17,8609% a.a., valor presente de R$ 5.558.278,01 e referência de R$ 3.705.518,67 para 100 IBT. Ocupação: 35% / 20% / 25% / 30%. A avaliação desconta fluxos anuais, sem inventar calendário de recebimentos semestrais.
- O backend ainda não impõe 3 noites, máximo de 5 hóspedes ou prazo de cancelamento. O texto diferencia definição comercial de automação disponível.

Histórico técnico, tarefas e evidências detalhadas permanecem em documentacao/, smart-contract/docs/ e offchain/README.md. A publicação v2 está registrada em smart-contract/deployments/sepolia-remix-v2-2026-09-11.json.

## Conferência

O PDF possui 28 páginas e sumário navegável. Todas as páginas foram renderizadas e inspecionadas visualmente, sem texto fora das margens. A conferência verificou preço, taxa, valores presentes, royalties, colocação e células centrais das sensibilidades contra a planilha.

O arquivo Excel foi preservado byte a byte. A projeção anual, as premissas, os valores presentes e as sensibilidades foram transcritos com arredondamento de apresentação. Todo o texto fora das seções financeiras e de sua referência permaneceu idêntico à edição anterior, incluindo endereço, transação, bloco, administrador, stablecoin e vigência.

Esta edição é exclusivamente documental. Não houve nova execução de testes dos contratos ou backend. O relatório de testes existente descreve a cobertura e seus limites.

## Gerar novamente

Executar render_whitepaper.py com Python que tenha ReportLab instalado. O gerador utiliza fontes Arial, Georgia e Courier New do macOS. Após alteração de conteúdo, renderizar e conferir novamente paginação e referências antes de distribuir.
