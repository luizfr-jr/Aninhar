# Prévia para validação — navegação por temas

Esta versão propõe manter os 11 temas existentes, com **Primeiros Dias** no topo. A navegação lateral fica disponível no desktop e em uma gaveta no celular. Cada tema abre seus textos completos e um índice com acesso direto às seções.

## Capturas da interface

| Desktop | Celular |
| --- | --- |
| [Tela inicial](previews/desktop.png) | [Tela inicial](previews/mobile.png) |
| | [Menu lateral aberto](previews/mobile-menu.png) |
| | [Primeiros Dias](previews/mobile-topic.png) |

## O que conferir com a responsável

- Ordem e nomenclatura dos 11 temas, especialmente **Primeiros Dias**.
- Leitura e uso da busca no celular: experimentar “amamentacao”, “banho” e palavras que aparecem apenas no corpo de um texto.
- Conteúdo clínico e jurídico listado em [CONTENT_REVIEW.md](CONTENT_REVIEW.md). Os textos existentes foram preservados, sem alegação de validação médica.
- Imagens originais do Napkin e URLs exatas dos vídeos aprovados, principalmente o vídeo de banho de aproximadamente 11 minutos. A interface aceita texto, imagem, vídeo e referências por seção; a mídia real ainda precisa ser fornecida.
- Canal de contato oficial: o formulário anterior não tinha envio; a página informa essa indisponibilidade até existir uma integração real.

## Escopo da verificação técnica

Build de produção e ESLint; navegação pelos 11 temas; busca normalizada; links diretos, recarregamento e histórico; menu por toque/teclado, Escape e clique fora; larguras de 320, 375, 390, 768 e 1280 px; verificações automatizadas de acessibilidade (axe) e renderização de mídia com dados de teste isolados.

Os testes usam Chromium em desktop e emulação de celular. Eles não equivalem à validação clínica nem substituem a conferência final em aparelhos reais e Safari/iOS. Nenhum vídeo real foi incluído ou validado sem seu endereço confirmado.

A versão está em uma branch para revisão. Não publicar em `main` antes dessa validação: o workflow existente aciona a publicação da imagem Docker ao receber um push em `main`.
