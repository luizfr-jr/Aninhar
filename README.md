# Aninhar

Guia para famílias com crianças de 0 a 24 meses, com site público e administração de conteúdo. A interface mantém a família de fontes original (Inter/system-ui/Avenir/Helvetica/Arial), com leitura e controles adaptados ao celular.

## Executar localmente

Requer **Node.js 24 ou superior**.

```sh
npm ci
cp .env.example .env
```

Em `.env`, defina `ADMIN_PASSWORD` com pelo menos 12 caracteres e `SESSION_SECRET` com pelo menos 32 caracteres aleatórios. Gere o segredo com `openssl rand -hex 32`. Não publique esses valores. `APP_ORIGIN` deve corresponder exatamente à origem usada no navegador (por padrão, `http://localhost:3000`).

```sh
npm run dev
```

O comando inicia a API na porta 3001 e o site na porta 3000. Acesse **http://localhost:3000** e **http://localhost:3000/admin**. Sem credenciais configuradas, o site público continua disponível e o painel informa que o acesso precisa ser configurado; não existe senha padrão.

## Administração

- **Visão geral:** quantidade real de temas e tópicos, versão e datas de salvamento/publicação.
- **Temas e conteúdos:** criar, editar, remover e reordenar temas e seus tópicos; editar texto, imagem, vídeo do YouTube e referências.
- **Biblioteca de imagens:** enviar PNG, JPEG ou WebP de até 8 MB e copiar o endereço para o conteúdo.
- **Páginas do site:** editar Sobre, Contato e o e-mail oficial opcional.
- **Rascunho → prévia → publicação:** salvar não altera o site público. A prévia exige sessão administrativa. Publicar promove o documento salvo após confirmação.

O painel alerta sobre alterações não salvas, mantém o rascunho em memória se a sessão expirar e detecta conflitos entre versões. As orientações de saúde continuam exigindo revisão da responsável pelo projeto.

## Dados e execução em produção

```sh
npm run build
npm start
```

O servidor entrega a API, a interface compilada e as imagens. SQLite e os arquivos enviados ficam em `DATA_DIR` (por padrão, `./data`). `content/seed.json` só inicializa uma base vazia; alterações pelo painel persistem no banco.

Para produção, configure `NODE_ENV=production`, `ADMIN_PASSWORD`, `SESSION_SECRET` e `APP_ORIGIN` com a origem **HTTPS** pública exata. O cookie administrativo usa HTTPS. Mantenha o diretório de dados em armazenamento persistente e faça backups antes de atualizar.

Os arquivos Compose preservam as portas anteriores e acrescentam o volume `aninhar-data:/app/data`:

```sh
docker compose up -d --build
```

A configuração em `docker/docker-compose.yml` usa a imagem GHCR e a porta 8090. `nginx.conf` é um exemplo opcional de proxy externo para essa porta. **A versão com CMS precisa do servidor Node e de disco persistente; hospedagem apenas estática, incluindo a configuração Vercel anterior, não executa a API nem persiste os dados.** Consulte [operação e publicação](docs/ADMIN.md) antes da migração.

## Verificação

```sh
npm run build
npm run lint
npm run test:server
npx playwright install chromium
npm run test:e2e
```

Os testes do navegador iniciam sua própria API, com SQLite temporário e credenciais exclusivas de teste. Não acessam o banco de produção. Para Chromium já instalado: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/caminho/do/chromium npm run test:e2e`.

## Conteúdo e validação

- [Uso do painel e operação](docs/ADMIN.md).
- [Edição do conteúdo e mídia](docs/CONTENT_EDITING.md).
- [Pendências clínicas e editoriais](docs/CONTENT_REVIEW.md).
- [Capturas e roteiro de validação](docs/VALIDATION.md).

Os 11 temas e 79 textos originais foram preservados. Imagens do Napkin e links dos vídeos aprovados ainda precisam ser fornecidos; nenhuma mídia educativa foi inventada.
