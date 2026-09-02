# InovaLab RN — Painel de Laboratórios e Deep Tech

Painel estático (HTML/CSS/JS puro, sem backend) com o mapeamento de laboratórios do
InovaLab RN, a prospecção de patentes da UFRN e uma triagem crítica de potencial "deep tech",
para uso interno da FUNPEC.

## Arquivos

- `index.html` — página principal do painel (mapa, gráficos, tabela filtrável, roteiro de formulário).
- `app.js` — lógica do painel (Leaflet para o mapa, Chart.js para os gráficos, filtros da tabela).
- `embedded_data.js` — dados dos 32 laboratórios e das 340 patentes, já embutidos (edite aqui para atualizar).
- `InovaLab_RN_Atualizado_2026.xlsx` — planilha completa (base de dados, watchlist, roteiro de formulário e metodologia).

## Como publicar no GitHub Pages

1. Crie um repositório (pode ser privado, se for uso interno da FUNPEC) e suba estes arquivos
   na raiz (ou em uma pasta `/docs`).
2. No GitHub: **Settings → Pages → Source** → selecione a branch (`main`) e a pasta (`/root` ou `/docs`).
3. Aguarde alguns minutos — o GitHub fornecerá uma URL do tipo
   `https://<sua-org>.github.io/<repo>/`.
4. Se o repositório for privado e vocês tiverem GitHub Enterprise/Organização, o Pages também
   pode ser restrito a quem tem acesso ao repositório — confirme essa opção em **Settings → Pages**
   caso o painel deva ficar acessível só internamente.

## Como atualizar os dados

Os dados vivem em `embedded_data.js` como um objeto JSON (`window.__INOVALAB_DATA__`). Para atualizar:

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
- Apenas laboratórios que responderam ao formulário InovaLab 2024 estão representados.
