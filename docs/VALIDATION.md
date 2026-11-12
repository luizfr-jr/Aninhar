# Prévia para validação — site público e administração

A revisão de design centrado nas pessoas preserva a família de fontes original em todas as telas. Textos principais e campos usam 16 px; no leitor é possível escolher 18 ou 20 px. O menu por temas continua lateral, com **Primeiros Dias** como primeiro tema inicial. As decisões, critérios e validação participativa pendente estão em [Design centrado nas pessoas](DESIGN_CENTRADO_NAS_PESSOAS.md).

A página inicial e o painel foram reorganizados para colocar temas e tarefas no primeiro campo de visão, com apresentação e status compactos. Veja a [comparação visual antes e depois](COMPARACAO_LAYOUT.md).

## Capturas

| Página | Prévia |
| --- | --- |
| Início público | [Desktop](previews/desktop.png) · [Celular](previews/mobile.png) |
| Navegação pública | [Menu móvel](previews/mobile-menu.png) · [Primeiros Dias](previews/mobile-topic.png) |
| Busca | [Resultados no celular](previews/mobile-search.png) |
| Acesso administrativo | [Login](previews/admin-login.png) |
| Painel inicial | [Desktop](previews/admin-desktop.png) · [Celular](previews/admin-mobile.png) |
| Conteúdo | [Lista de temas](previews/admin-topics.png) · [Editor móvel](previews/admin-editor-mobile.png) |
| Páginas institucionais | [Editor](previews/admin-pages.png) |
| Imagens | [Biblioteca](previews/admin-media.png) |
| Busca por conteúdo | [Público](previews/public-search-refined.png) · [Admin](previews/admin-search-refined.png) |
| Índice e prévia contextual | [Filtro do índice](previews/public-index-filter.png) · [Prévia de Contato](previews/admin-page-preview.png) |

## Fluxos disponíveis

- Público: início com acesso direto aos temas, busca com consulta preservada na URL e correspondências destacadas, links diretos, índice filtrável por título/texto sem ocultar os artigos, preferência de tamanho do texto e confirmação de cópia junto ao tópico.
- Admin: busca nos textos com abertura da seção correspondente, filtro nos tópicos do editor, criação/edição/remoção/reordenação com foco preservado, recursos opcionais recolhíveis, seleção de imagem diretamente para o tópico, prévia de Sobre/Contato e atalho de salvamento Ctrl+S/⌘S.
- Recuperação: ajuda e erros associados aos campos; salvamento leva ao campo a corrigir, inclusive em outra página; retorno da biblioteca preserva a seção em edição.
- Editorial: salvar rascunho, abrir prévia autenticada, confirmar publicação, recuperar sessão e tratar conflito de versão.
- Armazenamento: SQLite e imagens no servidor, com volume persistente no Docker.

## Verificação técnica

Build de produção e ESLint passaram, assim como os **11 testes da API**. A suíte de navegador contém 104 cenários em Chromium desktop e emulação de celular, dos quais 5 não se aplicam ao projeto correspondente. Cobre o acesso aos temas e tarefas na primeira tela do celular, busca textual, índice filtrado, prévia institucional, atalho de salvamento, foco após remoção e validação de campos escondidos pelo filtro. Também verifica autenticação, sessão, persistência, gravação/publicação, conflito de versão, upload real, estado vazio, navegação, preferência de leitura, tipografia e acessibilidade com axe.

As larguras verificadas incluem 320, 375, 390, 768 e 1280 px no público e no admin. Emulação não substitui validação em aparelhos reais e Safari/iOS.

## Antes da publicação

- Validar layout e organização com a responsável.
- Revisar os textos clínicos e jurídicos em [CONTENT_REVIEW.md](CONTENT_REVIEW.md).
- Fornecer imagens do Napkin e links dos vídeos aprovados, principalmente o banho do recém-nascido de aproximadamente 11 minutos.
- Configurar senha, segredo, origem HTTPS e volume persistente, conforme [ADMIN.md](ADMIN.md). Não há senha padrão.

A área administrativa foi criada neste repositório. Os projetos relacionados encontrados durante a pesquisa não foram alterados. A versão exige Node/API e armazenamento persistente; hospedagem apenas estática não suporta o CMS.

O workflow publica a imagem Docker após push em `main`; isso não atualiza, por si só, o servidor UFN. A instalação completa continua dependendo de acesso à infraestrutura, configuração do painel e verificação do armazenamento persistente. O Vercel estático mantém a versão pública e informa que o admin requer a instalação Node/Docker.
