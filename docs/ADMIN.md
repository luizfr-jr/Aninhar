# Administração do Aninhar

## Primeiro acesso

1. Configure a senha administrativa e o segredo de sessão em `.env` ou no gerenciador de segredos da hospedagem. Use `.env.example` como referência; não existe senha padrão.
2. Defina `APP_ORIGIN` com o endereço exato utilizado para abrir o site. Localhost e 127.0.0.1 são origens diferentes.
3. Inicie o servidor e abra `/admin`.
4. Entre com a senha configurada. O acesso é destinado à equipe editorial; esta versão não possui contas individuais ou convites.

Em produção, a origem deve usar HTTPS. Senha curta, segredo insuficiente ou origem de produção ausente/inválida deixam o painel desativado. O conteúdo público continua disponível.

## Atualizar um tema

Em **Temas e conteúdos**, abra um tema ou escolha **Novo tema**. O nome aparece no menu; a descrição orienta a família. Adicione tópicos e preencha título e texto. Use **Subir/Descer** para organizar a leitura. Identificadores são gerados automaticamente e preservados ao editar títulos.

As seções de imagem, vídeo e referências são opcionais. Imagens precisam de uma descrição acessível. Para vídeos, use o endereço de um vídeo aprovado do YouTube. Referências devem ter nome e URL HTTPS.

**Salvar rascunho** grava a versão no servidor, mas não modifica a versão pública. **Ver prévia** abre o site com o documento salvo e uma faixa indicando a prévia. Quando terminar a revisão, use **Publicar** e confira o resumo antes de confirmar. A publicação inclui o documento inteiro: temas e páginas institucionais.

A exclusão de um tema ou tópico afeta primeiro o rascunho. A alteração alcança o site somente após publicar. **Descartar alterações** retorna ao último rascunho salvo, mediante confirmação.

## Imagens e páginas institucionais

Na **Biblioteca de imagens**, envie PNG, JPEG ou WebP até 8 MB. Copie o endereço e cole no campo de imagem de um tópico. A biblioteca também pode ser aberta a partir do editor; use **Voltar ao editor** para retomar o conteúdo. Arquivos são mantidos no armazenamento do servidor. Esta versão não exclui arquivos da biblioteca.

Em **Páginas do site**, edite os textos de Sobre e Contato. O e-mail é opcional; informe apenas um canal oficial. O site apresenta um link para o aplicativo de e-mail, sem simular um serviço de mensagens.

## Falhas e conflitos

Um erro de salvamento não confirma a operação e mantém a edição na tela. Se outra pessoa salvar a mesma versão, o painel informa o conflito e oferece recarregar a versão atual com confirmação. Não sobrescreve silenciosamente a versão mais recente.

Se a sessão expirar durante uma edição, o conteúdo não salvo permanece temporariamente na memória da aba para recuperação após entrar novamente. Fechar a aba ou recarregar o navegador pode perder esse conteúdo; salve regularmente. O navegador solicita confirmação quando há mudanças não salvas.

## Compatibilidade com o Vercel estático

O `vercel.json` compila o frontend com `VITE_STATIC_PUBLIC_FALLBACK=1` para preservar o site público na hospedagem estática existente. Nessa instalação, quando `/api/content` devolve o próprio HTML do site com status de sucesso, as páginas exibem o conteúdo inicial incluído em `content/seed.json` no momento do build. Essa versão é um retrato estático: alterações salvas ou publicadas em outro servidor não são sincronizadas automaticamente com ela.

O modo é explícito e restrito: erros reais da API (incluindo HTTP 500) continuam mostrando a opção de tentar novamente. A prévia de rascunhos nunca recebe esse fallback e continua exigindo autenticação. A rota `/admin` informa que a administração não está disponível nessa hospedagem e oferece retorno ao site, sem apresentar um formulário de login sem servidor.

Para ter edição, prévia e publicação funcionando, use a instalação Node/Docker com armazenamento persistente descrita abaixo. Nela, **não** defina `VITE_STATIC_PUBLIC_FALLBACK`; o conteúdo público vem de `/api/content`, e o painel autentica no servidor. Essa compatibilidade mantém o Vercel público disponível enquanto o acesso à infraestrutura UFN é concluído; não altera o destino previsto para a instalação completa.

## Hospedagem e dados

O site agora é uma aplicação Node.js 24 com API Express e SQLite, não apenas arquivos estáticos. O Dockerfile compila o frontend e executa o servidor Node na porta 80. Compose monta `aninhar-data` em `/app/data` para preservar:

- `aninhar.sqlite` e arquivos auxiliares SQLite;
- pasta `media/` com imagens enviadas.

O servidor inicializa uma base vazia a partir de `content/seed.json`. Não substitui um banco já existente. Não edite nem apague o banco ao atualizar a imagem. Para um backup consistente, pare o serviço e copie **todo** o diretório/volume de dados; depois reinicie. Não copie apenas o `.sqlite` de uma base ativa sem uma ferramenta de backup compatível com SQLite WAL.

O acesso administrativo usa cookie HTTP-only, SameSite=Strict, expiração, validação de origem e limitação de tentativas. O segredo e a senha não entram no bundle do navegador. A prévia de rascunhos usa endpoints protegidos.

A instalação estática anterior no Vercel não oferece o disco persistente necessário. Use o ambiente Node/Docker já previsto no projeto, com HTTPS no proxy. O arquivo `nginx.conf` exemplifica um proxy para a porta 8090 da configuração `docker/docker-compose.yml`; ajuste domínio e TLS na infraestrutura existente.

### IP do cliente atrás de um proxy

Por padrão, Node ignora `X-Forwarded-For` e limita as tentativas de login pelo IP da conexão direta. Se Nginx/Portainer encaminha todo o tráfego, configure `TRUST_PROXY` somente com os **IPs ou CIDRs reais e exclusivos desses proxies**, separados por vírgula. Isso permite limitar cada cliente pelo seu IP, sem agrupar todos os editores no mesmo limite do proxy. Exemplo: `127.0.0.1,::1` é correto **apenas** quando a conexão do proxy chega pelo loopback; em Docker, identifique o IP/rede efetivamente usado pelo proxy, não presuma que seja loopback.

O servidor recusa `true`, nomes genéricos, contagens de saltos e redes `/0`. Deixe a variável vazia quando não houver um proxy confiável. Restrinja o acesso direto à porta Node e faça o proxy **sobrescrever** `X-Forwarded-For` com o IP observado da conexão (como no `nginx.conf`), em vez de preservar um valor enviado pelo cliente. Não marque redes que também contenham clientes não confiáveis. Depois da configuração, confira os testes de limite de login; o Compose repassa a variável ao container.

Não publique a branch automaticamente sem conferir variáveis, volume persistente e revisão editorial. O workflow existente cria a imagem GHCR ao receber alterações em `main`; a criação do PR não altera o serviço em execução.
