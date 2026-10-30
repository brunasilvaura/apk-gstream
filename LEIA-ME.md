# Filmes e Séries (APK)

## Como usar
1. Suba **tudo** desta pasta para um repositório no GitHub (inclusive a pasta `.github`).
2. Vá em **Actions > Gerar APK**. Ele roda sozinho a cada push (ou clique em *Run workflow*).
3. Quando ficar verde (uns 5 min), abra a execução e baixe **FilmesESeries-apk** em *Artifacts*.
   Dentro do zip está o `app-debug.apk`.

## Banco (Supabase)
Rode `banco-corrigir.sql` no SQL Editor (se ainda não rodou).

## Ícone
O ícone do app vem de `icones/res/` e é copiado automaticamente no build. Para trocar, substitua os PNGs de lá.

## Observações
- Edite o app em `www/index.html`. As chaves do Supabase ficam em `www/config.js`
  (a `sb_publishable_...` pode ficar pública; **nunca** coloque a `service_role` aqui).
- O APK é assinado sempre com a chave fixa de `keystore/debug.keystore` (não apague nem troque esse arquivo,
  e mantenha o repositório **privado**). Assim o Android aceita instalar a nova versão **por cima** da antiga,
  sem desinstalar, e a chave do aluno (XXXX-XXXX) é mantida.
- **Só na primeira vez** após esta mudança: quem tem o APK antigo (assinado com outra chave) precisa
  desinstalar uma vez. Se já tinha chave liberada, basta digitar a chave antiga no campo "usar chave" do app.

## TV / TV box / controle remoto
- O app aparece no menu das Android TV (com banner) e funciona sem tela de toque.
- Setas = mover, OK = abrir, VOLTAR = fechar/voltar. Com o vídeo aberto, aperte VOLTAR para abrir o menu
  (Tela cheia, Episódios, Fechar). O botão "🎮 Controlar vídeo" devolve as setas/OK para o player.
- Também dá para arrastar com o mouse (PC) e deslizar com o dedo (celular) para os lados e para baixo.
