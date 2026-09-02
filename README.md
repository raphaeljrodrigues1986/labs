# FUNPEC — Painel de Laboratórios e Deep Tech UFRN

Painel estático (HTML/CSS/JS puro, sem backend) com o mapeamento de laboratórios da UFRN, a
prospecção de patentes e uma triagem crítica de potencial "deep tech", para uso interno da FUNPEC.

## Arquivos

- `index.html` — página principal do painel (mapa, gráficos, tabela filtrável, roteiro de formulário).
- `app.js` — lógica do painel (Leaflet para o mapa, Chart.js para os gráficos, filtros da tabela).
- `embedded_data.js` — dados dos laboratórios e das 340 patentes, já embutidos (edite aqui para atualizar).
- `FUNPEC_Laboratorios_UFRN_2026.xlsx` — planilha completa (base de dados, watchlist, roteiro de formulário e metodologia).

## Como publicar no GitHub Pages

1. Crie um repositório (pode ser privado, se for uso interno da FUNPEC) e suba estes arquivos
   na raiz (ou em uma pasta `/docs`).
2. No GitHub: **Settings → Pages → Source** → selecione a branch (`main`) e a pasta (`/root` ou `/docs`).
3. Aguarde alguns minutos — o GitHub fornecerá uma URL do tipo
   `https://<sua-org>.github.io/<repo>/`.
4. Se o repositório for privado, o GitHub Pages gratuito exige que ele seja tornado público para
   funcionar sem custo adicional (GitHub Enterprise permite Pages privado).

## Como atualizar os dados

Os dados vivem em `embedded_data.js` como um objeto JSON (`window.__FUNPEC_LABS_DATA__`). Para atualizar:

1. Edite os campos do laboratório desejado (ex.: `status_2026`, `potencial`, `justificativa`).
2. Salve o arquivo e faça commit — o GitHub Pages atualiza automaticamente.
3. Mantenha a planilha Excel como cópia mestra/arquivada de cada atualização trimestral.

## Sobre o formulário para os professores

Este painel **não substitui** uma ferramenta de formulário de verdade (Google Forms, Microsoft
Forms, SEI etc.) — ele mostra o roteiro de perguntas pronto para ser copiado para lá. Depois de
coletar as respostas, atualize `embedded_data.js` (ou a planilha) com o novo status de cada
laboratório.

## Limitações importantes

- Classificação de "potencial deep tech" é uma triagem qualitativa inicial (ver aba
  "Metodologia" da planilha), não uma due diligence de propriedade intelectual.
- Coordenadas no mapa são aproximadas por cidade-sede, não endereço exato de cada laboratório.
- A base parte de um formulário de mapeamento de laboratórios respondido em 2024; laboratórios
  que não responderam foram incluídos apenas quando identificados via busca — o painel sinaliza
  isso explicitamente em cada caso.
