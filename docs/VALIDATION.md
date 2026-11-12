# Prévia para validação — site público e administração

A versão usa a família de fontes original em todas as telas. Textos principais e campos usam 16 px, com ações e navegação legíveis, contraste e foco visível. O menu por temas continua lateral, com **Primeiros Dias** como primeiro tema inicial.

## Capturas

| Página | Prévia |
| --- | --- |
| Início público | [Desktop](previews/desktop.png) · [Celular](previews/mobile.png) |
| Navegação pública | [Menu móvel](previews/mobile-menu.png) · [Primeiros Dias](previews/mobile-topic.png) |
| Acesso administrativo | [Login](previews/admin-login.png) |
| Painel inicial | [Desktop](previews/admin-desktop.png) · [Celular](previews/admin-mobile.png) |
| Conteúdo | [Lista de temas](previews/admin-topics.png) · [Editor móvel](previews/admin-editor-mobile.png) |
| Páginas institucionais | [Editor](previews/admin-pages.png) |

## Fluxos disponíveis

- Público: navegação, busca com consulta preservada na URL, links diretos, índice recolhível no celular, retorno ao índice e cópia de links.
- Admin: login real, estatísticas do conteúdo, criação/edição/remoção/reordenação de temas e tópicos, textos e referências, imagens e vídeos, páginas institucionais e e-mail de contato.
- Editorial: salvar rascunho, abrir prévia autenticada, confirmar publicação, recuperar sessão e tratar conflito de versão.
- Armazenamento: SQLite e imagens no servidor, com volume persistente no Docker.

## Verificação técnica

Build de produção e ESLint passaram. Passaram 8 testes da API e 69 testes de navegador em Chromium desktop e emulação de celular (5 casos ignorados por aplicabilidade entre projetos). A imagem Docker também compilou e iniciou com sucesso: site, `/admin`, API, bloqueio de rascunho e login com cookie seguro foram verificados. Cobertura: autenticação, origem de requisição, limite de tentativas, sessão, persistência após reabrir banco, gravação/publicação, conflito de versão, limites de arquivos, upload real, prévia, estado vazio, navegação, busca, tipografia e verificação de acessibilidade axe.

As larguras verificadas incluem 320, 375, 390, 768 e 1280 px no público e no admin. Emulação não substitui validação em aparelhos reais e Safari/iOS.

## Antes da publicação

- Validar layout e organização com a responsável.
- Revisar os textos clínicos e jurídicos em [CONTENT_REVIEW.md](CONTENT_REVIEW.md).
- Fornecer imagens do Napkin e links dos vídeos aprovados, principalmente o banho do recém-nascido de aproximadamente 11 minutos.
- Configurar senha, segredo, origem HTTPS e volume persistente, conforme [ADMIN.md](ADMIN.md). Não há senha padrão.

A área administrativa foi criada neste repositório. Os projetos relacionados encontrados durante a pesquisa não foram alterados. A versão exige Node/API e armazenamento persistente; hospedagem apenas estática não suporta o CMS.

O PR permanece em rascunho. O workflow existente publica imagem Docker após push em `main`; nenhum merge ou deploy foi feito nesta revisão.
