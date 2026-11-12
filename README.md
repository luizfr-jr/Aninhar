# Aninhar

Ambiente virtual para pais e cuidadores de crianças de 0 a 24 meses, com navegação por temas e prioridade ao uso pelo celular.

## Desenvolvimento

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite (por padrão, http://localhost:3000).

## Verificação

```sh
npm run build
npm run lint
npx playwright install chromium
npm run test:e2e
```

Os testes de navegação usam Chromium em desktop e emulação de celular e verificam larguras de 320 a 1280 px. Para um navegador já instalado, use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/caminho/do/chromium npm run test:e2e`.

## Conteúdo e navegação

- Os 11 temas e suas 79 seções ficam em [src/data/topics.ts](src/data/topics.ts). A ordem do array determina a ordem do menu, começando por **Primeiros Dias**.
- [Guia de edição](docs/CONTENT_EDITING.md): como editar textos e inserir imagens e vídeos, sem template bloqueado.
- [Pendências editoriais](docs/CONTENT_REVIEW.md): pontos para validação pela responsável antes de publicação. Os textos existentes foram preservados; esta mudança não representa revisão clínica.
- Links como `#topic/higiene/banho-do-bebe-preparacao-e-seguranca` abrem a seção diretamente e funcionam com recarregamento e histórico do navegador.
- A busca pesquisa títulos, descrições e textos, desconsiderando acentos e maiúsculas.
- O menu lateral fica fixo no desktop e abre em uma gaveta acessível no celular.

## Validação antes de publicar

Confirmar com a responsável a ordem e nomenclatura dos temas; revisar conteúdo clínico/jurídico; fornecer imagens originais e URLs dos vídeos aprovados. O repositório contém apenas logos, sem os arquivos Napkin ou o link do vídeo de banho. O renderizador de mídia está pronto para recebê-los.

O formulário antigo de contato não tinha integração de envio. A página agora informa que o canal ainda não está disponível, sem simular envio de mensagens.

O workflow atual publica a imagem Docker quando há push para `main`. Validar a branch de trabalho antes do merge e da publicação.

[Prévia visual e roteiro de validação](docs/VALIDATION.md).
