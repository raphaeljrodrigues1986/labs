(function () {
  const DATA = window.__INOVALAB_DATA__;
  const LABS = DATA.labs;
  const CIDADES = DATA.cidades;
  const PAT = DATA.patentes_area;
  const PAT_TOTAL = DATA.patentes_total;

  const COLORS = {
    ALTO: "#1E7A46",
    MEDIO: "#9C6B00",
    BAIXO: "#A3323B",
  };

  // ---------- KPI row ----------
  const counts = { ALTO: 0, MEDIO: 0, BAIXO: 0 };
  LABS.forEach((l) => counts[l.potencial]++);
  const kpiRow = document.getElementById("kpiRow");
  const focoCount = (DATA.foco_geo_mat_tec || []).length;
  const kpis = [
    { n: LABS.length, label: "Laboratórios mapeados" },
    { n: PAT_TOTAL, label: "Patentes UFRN prospectadas" },
    { n: counts.ALTO, label: "Potencial deep tech ALTO", cls: "alto" },
    { n: focoCount, label: "Em Geologia / Materiais / Tecnologia" },
  ];
  kpiRow.innerHTML = kpis
    .map(
      (k) => `<div class="kpi"><div class="n ${k.cls || ""}">${k.n}</div><div class="label">${k.label}</div></div>`
    )
    .join("");

  // ---------- Map ----------
  const map = L.map("map", { scrollWheelZoom: false }).setView([-5.6, -36.5], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(map);

  // group labs by city, jitter markers slightly so they don't fully overlap
  const byCity = {};
  LABS.forEach((l) => {
    byCity[l.cidade] = byCity[l.cidade] || [];
    byCity[l.cidade].push(l);
  });

  Object.entries(byCity).forEach(([cidade, labs]) => {
    const base = CIDADES[cidade];
    if (!base) return;
    labs.forEach((l, i) => {
      const angle = (i / labs.length) * 2 * Math.PI;
      const r = labs.length > 1 ? 0.035 : 0;
      const lat = base[0] + r * Math.sin(angle);
      const lng = base[1] + r * Math.cos(angle);
      const color = COLORS[l.potencial];
      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        color: color,
        fillColor: color,
        fillOpacity: 0.85,
        weight: 2,
      }).addTo(map);
      marker.bindPopup(
        `<strong>${l.nome}</strong><br>${l.coord}<br><em>${l.area}</em><br>` +
          `<span style="color:${color}; font-weight:600;">Potencial: ${l.potencial}</span>`
      );
    });
  });

  // ---------- Charts ----------
  Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";
  Chart.defaults.color = "#4B5566";

  new Chart(document.getElementById("chartArea"), {
    type: "doughnut",
    data: {
      labels: PAT.map((p) => p.area),
      datasets: [
        {
          data: PAT.map((p) => p.qtd),
          backgroundColor: ["#1F3864", "#0F766E", "#C9A24B"],
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11.5 } } },
        title: { display: true, text: "Patentes por área (n=340)", font: { size: 13 }, color: "#1B2430" },
      },
    },
  });

  new Chart(document.getElementById("chartPotencial"), {
    type: "bar",
    data: {
      labels: ["Alto", "Médio", "Baixo"],
      datasets: [
        {
          data: [counts.ALTO, counts.MEDIO, counts.BAIXO],
          backgroundColor: [COLORS.ALTO, COLORS.MEDIO, COLORS.BAIXO],
          borderRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Laboratórios por potencial deep tech",
          font: { size: 13 },
          color: "#1B2430",
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });

  // ---------- Table ----------
  const tblBody = document.getElementById("tblBody");
  const fSearch = document.getElementById("fSearch");
  const fPotencial = document.getElementById("fPotencial");
  const fDominio = document.getElementById("fDominio");
  const fFoco = document.getElementById("fFoco");
  const FOCO_NAMES = new Set(DATA.foco_geo_mat_tec || []);

  // populate domain filter
  const dominiosUnicos = [...new Set(LABS.map((l) => l.dominio))].sort();
  dominiosUnicos.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    fDominio.appendChild(opt);
  });

  function renderTable() {
    const q = fSearch.value.trim().toLowerCase();
    const pot = fPotencial.value;
    const dom = fDominio.value;
    const soFoco = fFoco.checked;

    const order = { ALTO: 0, MEDIO: 1, BAIXO: 2 };
    const rows = LABS.filter((l) => {
      if (pot && l.potencial !== pot) return false;
      if (dom && l.dominio !== dom) return false;
      if (soFoco && !FOCO_NAMES.has(l.nome)) return false;
      if (q) {
        const hay = `${l.nome} ${l.coord} ${l.area}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => order[a.potencial] - order[b.potencial] || a.nome.localeCompare(b.nome));

    tblBody.innerHTML = rows
      .map(
        (l) => `
        <tr>
          <td>
            <div class="cell-name">${l.nome}</div>
            <div class="cell-sub">${l.vinculo}</div>
          </td>
          <td>${l.coord}</td>
          <td>${l.dominio}</td>
          <td>${l.area}</td>
          <td><span class="badge ${l.potencial}">${l.potencial}</span></td>
          <td>
            ${l.status_2026}
            <details class="row-detail">
              <summary>ver justificativa</summary>
              <div class="cell-just">${l.justificativa}<br><br><em>Fonte: ${l.fonte}</em></div>
            </details>
          </td>
        </tr>`
      )
      .join("");
  }

  [fSearch, fPotencial, fDominio].forEach((el) => el.addEventListener("input", renderTable));
  fFoco.addEventListener("change", renderTable);
  renderTable();

  // ---------- Form questions ----------
  const perguntas = [
    ["Nome do laboratório/grupo de pesquisa*", "Texto curto"],
    ["Coordenador(a) responsável e e-mail atualizado*", "Texto curto"],
    ["As informações de infraestrutura enviadas em 2024 continuam válidas?*", "Sim / Não / Parcialmente"],
    ["Se não, o que mudou (equipamentos, obras, etc.)?", "Texto longo"],
    ["Quais pesquisas/projetos estão em andamento atualmente?*", "Texto longo"],
    ["Alguma pesquisa resultou em pedido de patente, software ou outra IP desde 2024?*", "Sim / Não"],
    ["Se sim: título, processo (INPI/AGIR) e situação atual", "Texto longo"],
    ["A tecnologia já foi validada fora do laboratório (piloto, prêmio, financiamento)?", "Sim / Não + detalhes"],
    ["Há interesse em produto, licenciamento ou spin-off (startup)?*", "Sim / Não / Já em andamento"],
    ["O laboratório foi procurado por empresas nos últimos 12 meses?", "Sim / Não + quantas"],
    ["Estágio de maturidade tecnológica (TRL) da pesquisa principal", "Escala 1–9"],
    ["Observações livres / apoio que gostaria de receber da FUNPEC", "Texto longo"],
  ];
  document.getElementById("formQuestions").innerHTML = perguntas
    .map(
      ([q, t], i) =>
        `<div class="qcard"><div class="q">${i + 1}. ${q}</div><div class="meta">${t}</div></div>`
    )
    .join("");
})();
