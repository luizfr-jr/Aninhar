# Design centrado nas pessoas

Esta revisão parte das necessidades descritas para o Aninhar e de uma auditoria dos fluxos existentes. As decisões abaixo são hipóteses de usabilidade verificadas tecnicamente; não substituem observar famílias e equipe editorial utilizando o produto.

## Pessoas e tarefas

- **Famílias e cuidadores:** encontrar uma orientação pelo celular, ler no próprio ritmo e voltar ao ponto desejado, inclusive com pouco tempo ou usando apenas uma mão.
- **Equipe editorial:** localizar um conteúdo, editar com segurança, corrigir campos incompletos e distinguir edição, rascunho salvo e versão publicada.

## Decisões da interface

- Preservar a família tipográfica original e a identidade violeta. Usar superfícies claras, contraste, espaçamento e hierarquia para organizar a informação.
- Priorizar acesso aos temas e à busca na página inicial. No celular, identificar o menu com texto além do ícone.
- Manter o conteúdo completo acessível, com índice por tema, links diretos e tamanho de leitura ajustável. O ajuste de leitura não altera os textos.
- Exibir o título completo cadastrado pela equipe no tema correspondente.
- Agrupar campos relacionados e apresentar recursos opcionais conforme a necessidade. Associar ajuda e erros aos campos para leitores de tela.
- Ajudar a encontrar e corrigir o problema ao salvar; preservar as alterações quando a operação falha.
- Explicar o alcance de salvar e publicar. O estado mostrado deve refletir alterações locais, rascunhos e publicação.
- Confirmar ações junto ao controle acionado quando ele estiver distante do topo, como a cópia de um link.
- Oferecer saída e recuperação nos estados de carregamento, erro, conteúdo vazio e prévia sem autenticação.

## Critérios de verificação

1. Navegar por teclado com foco visível e ordem coerente; abrir e fechar menus e diálogos sem perder o contexto.
2. Conferir leitura, quebra de linhas e ausência de rolagem horizontal em larguras de 320, 375, 390, 768 e 1280 px.
3. Verificar contraste e semântica com axe, além de inspeção visual das páginas públicas e administrativas.
4. Exercitar busca, preferência de leitura, correção de campos, salvamento, prévia, publicação, recuperação de sessão e conflito de versões.
5. Confirmar que a edição não altera a versão pública antes da publicação e que falhas não apagam o trabalho.

## Validação participativa a realizar

Com famílias e equipe editorial, observar tarefas concretas: encontrar um cuidado, aumentar o texto, compartilhar um tópico, editar uma orientação com mídia e publicar uma revisão. Registrar onde hesitam, erros, necessidade de ajuda e compreensão do resultado. Repetir após ajustar os problemas encontrados.

Essa etapa e a revisão clínica dos textos continuam necessárias. Testes automatizados e emulação de celular não comprovam facilidade de uso para todas as pessoas, nem substituem testes em aparelhos reais e com tecnologias assistivas.
