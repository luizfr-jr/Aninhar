# Prévia para validação — site público e administração

A revisão de design centrado nas pessoas preserva a família de fontes original em todas as telas. Textos principais e campos usam 16 px; no leitor é possível escolher 18 ou 20 px. O menu por temas continua lateral, com **Primeiros Dias** como primeiro tema inicial. As decisões, critérios e validação participativa pendente estão em [Design centrado nas pessoas](DESIGN_CENTRADO_NAS_PESSOAS.md).

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

## Fluxos disponíveis

- Público: início com acesso direto aos temas, busca com consulta preservada na URL, links diretos, índice recolhível no celular, preferência de tamanho do texto e confirmação de cópia junto ao tópico.
- Admin: painel orientado a tarefas, criação/edição/remoção/reordenação de temas e tópicos, recursos opcionais recolhíveis, seleção de imagem diretamente para o tópico, páginas institucionais e e-mail de contato.
- Recuperação: ajuda e erros associados aos campos; salvamento leva ao campo a corrigir, inclusive em outra página; retorno da biblioteca preserva a seção em edição.
- Editorial: salvar rascunho, abrir prévia autenticada, confirmar publicação, recuperar sessão e tratar conflito de versão.
- Armazenamento: SQLite e imagens no servidor, com volume persistente no Docker.

## Verificação técnica

Build de produção e ESLint passaram. Foram aprovados **11 testes da API e 83 testes de navegador**; 5 casos de navegador foram ignorados por aplicabilidade entre os projetos desktop e celular. A suíte cobre Chromium desktop e emulação de celular, incluindo os novos fluxos de preferência de leitura, falha de cópia, campos incompletos, validação entre páginas e retorno da biblioteca. Também cobre autenticação, origem de requisição, limite de tentativas, sessão, persistência após reabrir banco, gravação/publicação, conflito de versão, limites de arquivos, upload real, prévia, estado vazio, navegação, busca, tipografia e acessibilidade com axe.

As larguras verificadas incluem 320, 375, 390, 768 e 1280 px no público e no admin. Emulação não substitui validação em aparelhos reais e Safari/iOS.

## Antes da publicação

- Validar layout e organização com a responsável.
- Revisar os textos clínicos e jurídicos em [CONTENT_REVIEW.md](CONTENT_REVIEW.md).
- Fornecer imagens do Napkin e links dos vídeos aprovados, principalmente o banho do recém-nascido de aproximadamente 11 minutos.
- Configurar senha, segredo, origem HTTPS e volume persistente, conforme [ADMIN.md](ADMIN.md). Não há senha padrão.

A área administrativa foi criada neste repositório. Os projetos relacionados encontrados durante a pesquisa não foram alterados. A versão exige Node/API e armazenamento persistente; hospedagem apenas estática não suporta o CMS.

O workflow publica a imagem Docker após push em `main`; isso não atualiza, por si só, o servidor UFN. A instalação completa continua dependendo de acesso à infraestrutura, configuração do painel e verificação do armazenamento persistente. O Vercel estático mantém a versão pública e informa que o admin requer a instalação Node/Docker.
