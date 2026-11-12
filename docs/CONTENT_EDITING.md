# Edição de conteúdo

A edição diária acontece em **/admin**, sem alterar código nem depender de template bloqueado. Consulte [o guia do painel](ADMIN.md).

## O que pode ser editado

- Nome, título e descrição dos temas.
- Ordem de temas e tópicos.
- Texto integral dos tópicos.
- Imagem com texto alternativo e legenda.
- Vídeo aprovado do YouTube com título.
- Referências HTTPS.
- Título, apresentação e blocos de Sobre e Contato; e-mail de contato opcional.

Salvar cria/atualiza um rascunho. Abrir a prévia permite conferir texto, imagem e vídeo antes de publicar. A publicação promove a versão salva inteira para o site público.

## Arquivos iniciais e dados persistentes

`content/seed.json` contém os 11 temas e 79 seções originais e inicializa apenas bancos novos. Os identificadores são estáveis e usados em links como `#topic/higiene/banho-do-bebe-preparacao-e-seguranca`. Editar o título não deve mudar o identificador.

O contrato serializável está em `src/types/content.ts`. O servidor valida campos, tamanhos, identificadores únicos e URLs. Os dados em uso ficam em SQLite e os uploads na pasta `media` de `DATA_DIR`. Modificar o seed ou os arrays de referência não sobrescreve conteúdo já salvo pelo painel.

## Material ainda necessário

O repositório original continha apenas logotipos. Ainda faltam as imagens educativas do Napkin e os links exatos dos vídeos aprovados, incluindo o banho do recém-nascido de aproximadamente 11 minutos. Envie os arquivos pela biblioteca e associe-os aos tópicos; não use links presumidos.

Mantenha as orientações clínicas em texto também, para acessibilidade. Antes de publicar, confira a leitura no celular e a lista de [pontos de revisão clínica e editorial](CONTENT_REVIEW.md). A criação do painel e a reorganização visual não equivalem a validação médica.
