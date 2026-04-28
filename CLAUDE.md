# Projeto Aninhar — Convenções para o Claude

## Padrões obrigatórios em qualquer alteração

- **Favicon**: sempre manter `public/favicon.svg` atualizado e referenciado em `index.html`. Criar o favicon sem precisar ser solicitado.
- **Build limpo**: rodar `npm run build` antes de todo commit e garantir zero erros TypeScript.
- **Branch de trabalho**: desenvolver em branch dedicada e fazer merge para `main`.

## Identidade visual

- Paleta principal: **violet/purple** (NinMa Hub)
- Gradientes: `from-violet-* to-purple-*`
- Logos em `public/`: `ninmahub-logo.svg`, `oryum-logo.svg`, `favicon.svg`

## Créditos (sempre manter no footer)

- Luiz Fernando Rodrigues Junior
- Kalleby Evangelho Mota
- NinMa Hub · Universidade Franciscana (UFN)
- Oryum Tech

## Estrutura do conteúdo

- Navegação apenas por **temas** (sem navegação por idade na home)
- Temas em `src/App.tsx` → array `themes` + objeto `themeContent`
