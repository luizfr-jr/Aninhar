# Como editar o conteúdo do Aninhar

O conteúdo fica em `src/data/topics.ts`, separado do layout. Não há template bloqueado: edite os textos, títulos e a ordem dos objetos em `topics` diretamente. O primeiro tema é **Primeiros Dias** (`primeirosPassos` é seu identificador histórico).

## Estrutura de cada tema

- `id`: identificador estável usado na navegação; não altere para preservar links.
- `name`: nome curto no menu.
- `title`: título completo no conteúdo.
- `description`: apresentação do tema.
- `icon` e `color`: aparência no menu.
- `sections`: tópicos internos, cada um com `id`, `title`, `text` e `links`.

Use títulos claros e textos consistentes em português. Preserve os IDs das seções ao alterar o título. Ao inserir uma seção, escolha um ID único dentro do tema, sem espaços ou acentos.

## Imagens existentes do Napkin/sistema original

1. Exporte a imagem autorizada para `public/images/`.
2. Acrescente `image` à seção correspondente:

```ts
image: {
  src: '/images/nome-do-arquivo.png',
  alt: 'Descrição objetiva da informação mostrada na imagem.',
  caption: 'Legenda ou crédito, quando necessário.',
},
```

O campo `caption` é opcional. Evite imagens com texto pequeno; mantenha o conteúdo essencial também em texto para quem usa leitor de tela. Os arquivos atuais de `public/` são logos e não substituem ilustrações educativas.

## Vídeos do YouTube

Na seção correspondente, preencha `video` com o endereço real de um vídeo aprovado:

```ts
video: {
  url: 'URL_REAL_DO_VIDEO_NO_YOUTUBE',
  title: 'Título descritivo do vídeo',
},
```

O exemplo é apenas estrutural: não o inclua no conteúdo publicado. Não há URL verificada para o vídeo de banho do recém-nascido de aproximadamente 11 minutos no repositório. Sua identificação e os arquivos do Napkin dependem do material da responsável pelo projeto.

## Links e revisão

Referências adicionais podem ser inseridas em `links: [{ label: 'Título da fonte', url: 'URL_REAL_DA_FONTE' }]`.

A busca inclui nomes, títulos, descrições e textos; aceita termos sem acentos e independentemente de maiúsculas. Confira os pontos de revisão editorial/clínica em [CONTENT_REVIEW.md](CONTENT_REVIEW.md). A reorganização do conteúdo não significa validação clínica. Após editar, execute `npm run build` e valide navegação, busca e mídia em celular antes de publicar.
