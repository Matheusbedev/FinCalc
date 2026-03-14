/* FinCalc Pro — calculators.js | by Matheus Augusto */
'use strict';

// ── DADOS ──────────────────────────────────────────────────────────────────
const ACOES = {
  PETR4: { nome:'Petrobras PN',       preco:38.50,  dy:12.5, setor:'Energia' },
  VALE3: { nome:'Vale ON',            preco:65.20,  dy:10.8, setor:'Mineração' },
  ITUB4: { nome:'Itaú PN',            preco:28.90,  dy:8.5,  setor:'Bancos' },
  BBDC4: { nome:'Bradesco PN',        preco:14.50,  dy:9.2,  setor:'Bancos' },
  BBAS3: { nome:'Banco do Brasil ON', preco:52.30,  dy:11.3, setor:'Bancos' },
  WEGE3: { nome:'WEG ON',             preco:42.80,  dy:2.1,  setor:'Indústria' },
  RENT3: { nome:'Localiza ON',        preco:55.60,  dy:1.8,  setor:'Mobilidade' },
  ABEV3: { nome:'Ambev ON',           preco:12.40,  dy:5.6,  setor:'Bebidas' },
  SUZB3: { nome:'Suzano ON',          preco:58.90,  dy:3.2,  setor:'Papel/Celulose' },
  RADL3: { nome:'Raia Drogasil ON',   preco:24.70,  dy:1.4,  setor:'Saúde' },
  VIVT3: { nome:'Telefônica ON',      preco:48.20,  dy:7.8,  setor:'Telecom' },
  CMIG4: { nome:'Cemig PN',           preco:11.80,  dy:13.2, setor:'Energia' },
  ELET3: { nome:'Eletrobras ON',      preco:38.10,  dy:4.5,  setor:'Energia' },
  CPLE6: { nome:'Copel PNB',          preco:10.90,  dy:9.8,  setor:'Energia' },
  TRPL4: { nome:'CTEEP PN',           preco:22.50,  dy:8.6,  setor:'Energia' },
  TAEE11:{ nome:'Taesa UNT',          preco:35.80,  dy:10.4, setor:'Energia' },
  EGIE3: { nome:'Engie ON',           preco:42.10,  dy:6.5,  setor:'Energia' },
  SAPR11:{ nome:'Sanepar UNT',        preco:22.30,  dy:7.9,  setor:'Saneamento' },
  CSMG3: { nome:'Copasa ON',          preco:18.60,  dy:9.1,  setor:'Saneamento' },
  LREN3: { nome:'Lojas Renner ON',    preco:16.80,  dy:3.4,  setor:'Varejo' },
};

const FIIS = {
  HGLG11:{ nome:'CSHG Logística',       preco:165.50, divM:1.20, tipo:'Logística' },
  MXRF11:{ nome:'Maxi Renda',           preco:10.15,  divM:0.09, tipo:'Papel' },
  KNRI11:{ nome:'Kinea Renda',          preco:145.80, divM:1.10, tipo:'Híbrido' },
  VISC11:{ nome:'Vinci Shopping',       preco:105.20, divM:0.85, tipo:'Shopping' },
  XPLG11:{ nome:'XP Log',              preco:98.50,  divM:0.75, tipo:'Logística' },
  BCFF11:{ nome:'BTG Fundo de Fundos',  preco:82.40,  divM:0.68, tipo:'FoF' },
  RBRF11:{ nome:'RBR Alpha',            preco:88.60,  divM:0.72, tipo:'FoF' },
  HGRE11:{ nome:'CSHG Real Estate',     preco:138.90, divM:0.95, tipo:'Lajes' },
  XPML11:{ nome:'XP Malls',            preco:102.30, divM:0.82, tipo:'Shopping' },
  BTLG11:{ nome:'BTG Logística',        preco:108.70, divM:0.88, tipo:'Logística' },
  IRDM11:{ nome:'Iridium Recebíveis',   preco:95.40,  divM:1.05, tipo:'Papel' },
  KNCR11:{ nome:'Kinea CRI',            preco:98.20,  divM:1.02, tipo:'Papel' },
  RZTR11:{ nome:'Riza Terrax',          preco:102.50, divM:0.95, tipo:'Agro' },
  VGIP11:{ nome:'Valora IP',            preco:88.30,  divM:0.90, tipo:'Papel' },
  HGBS11:{ nome:'CSHG Brasil Shopping', preco:195.60, divM:1.45, tipo:'Shopping' },
};

// ── UTILS ──────────────────────────────────────────────────────────────────
// Formata número no padrão brasileiro: R$ 1.234,56
function brl(v) {
  if (v == null || isNaN(v) || !isFinite(v)) return 'R$\u00a00,00';
  const neg = v < 0;
  const n   = Math.abs(v);
  // separa inteiro e decimal com 2 casas
  const partes = n.toFixed(2).split('.');
  const intStr = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decStr = partes[1];
  return (neg ? '-' : '') + 'R$\u00a0' + intStr + ',' + decStr;
}

// Formata percentual: 12,34%
function pct(v, d = 2) {
  if (v == null || isNaN(v) || !isFinite(v)) return '0,00%';
  return Number(v).toFixed(d).replace('.', ',') + '%';
}

// Converte taxa anual % para taxa mensal equivalente
function taxaMensal(taxaAnualPct) {
  return Math.pow(1 + taxaAnualPct / 100, 1 / 12) - 1;
}

function g(id) { return document.getElementById(id); }

function set(id, val) {
  const el = g(id);
  if (!el) return;
  const old = el.textContent;
  el.textContent = val;
  if (old !== val && old !== '—') {
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }
}

// ── THEME ──────────────────────────────────────────────────────────────────
let theme = localStorage.getItem('fcp-theme') || 'dark';
const CHARTS = {};

function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = g('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('fcp-theme', theme);
  Object.keys(CHARTS).forEach(id => {
    if (CHARTS[id]) { CHARTS[id].destroy(); delete CHARTS[id]; }
  });
}

document.documentElement.setAttribute('data-theme', theme);

// ── COUNTER ANIMATION ──────────────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let cur = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + (target === 100 ? '%' : '+');
      if (cur >= target) clearInterval(timer);
    }, 28);
  });
}

// ── MODAL ──────────────────────────────────────────────────────────────────
const AUTO_CALC = {
  juros: () => calcJuros(),
  cdb: () => calcCDB(),
  tesouro: () => calcTD(),
  renda: () => calcRenda(),
  aportes: () => calcAportes(),
  previdencia: () => calcPrev(),
  acoes: () => calcAcoes(),
  fiis: () => calcFIIs(),
  carteira: () => calcCarteira(),
};

function openModal(id) {
  const el = g('modal-' + id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (AUTO_CALC[id]) setTimeout(AUTO_CALC[id], 80);
}

function closeModal(id) {
  const el = g('modal-' + id);
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

function overlayClick(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.overlay.open').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }
});

// ── CHARTS ─────────────────────────────────────────────────────────────────
function mkChart(id, labels, datasets, type = 'line') {
  const canvas = g(id);
  if (!canvas) return;
  if (CHARTS[id]) { CHARTS[id].destroy(); }
  const dark = theme === 'dark';
  const gridC = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickC = dark ? '#475569' : '#94a3b8';
  const bgTooltip = dark ? '#1e293b' : '#ffffff';
  const fgTooltip = dark ? '#f1f5f9' : '#0f172a';

  CHARTS[id] = new Chart(canvas, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeInOutQuart' },
      plugins: {
        legend: {
          labels: { color: tickC, font: { family: 'Inter', size: 11 }, boxWidth: 10, padding: 14 },
        },
        tooltip: {
          backgroundColor: bgTooltip,
          titleColor: fgTooltip,
          bodyColor: tickC,
          borderColor: dark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: ctx => '  ' + brl(ctx.raw),
          },
        },
      },
      scales: type !== 'doughnut' ? {
        x: { ticks: { color: tickC, font: { size: 10 }, maxRotation: 45 }, grid: { color: gridC } },
        y: { ticks: { color: tickC, font: { size: 10 }, callback: v => brl(v) }, grid: { color: gridC } },
      } : {},
    },
  });
}

// ── JUROS COMPOSTOS ────────────────────────────────────────────────────────
function calcJuros() {
  const ini  = parseFloat(g('j-ini')?.value)  || 0;
  const ap   = parseFloat(g('j-ap')?.value)   || 0;
  const taxa = parseFloat(g('j-taxa')?.value) || 0;
  const anos = parseInt(g('j-anos')?.value)   || 0;

  // atualiza displays dos sliders
  const tv = g('j-taxa-v'); if (tv) tv.textContent = taxa.toString().replace('.', ',') + '%';
  const av = g('j-anos-v'); if (av) av.textContent = anos + ' ano' + (anos !== 1 ? 's' : '');
  const tl = g('j-taxa-lbl'); if (tl) tl.textContent = taxa.toString().replace('.', ',') + '%';
  const al = g('j-anos-lbl'); if (al) al.textContent = anos;

  const tm    = taxaMensal(taxa);
  const meses = anos * 12;

  // simula mês a mês
  let saldo = ini;
  const lbls = [], sInv = [], sTot = [];

  for (let m = 1; m <= meses; m++) {
    saldo = saldo * (1 + tm) + ap;
    if (m % 12 === 0) {
      lbls.push('Ano ' + (m / 12));
      sInv.push(parseFloat((ini + ap * m).toFixed(2)));
      sTot.push(parseFloat(saldo.toFixed(2)));
    }
  }

  const inv   = ini + ap * meses;
  const juros = saldo - inv;
  // rentabilidade = juros / total investido
  const rent  = inv > 0 ? (juros / inv) * 100 : 0;
  // renda mensal estimada = saldo × taxa mensal
  const renda = saldo * tm;

  set('j-final', brl(saldo));
  set('j-juros', brl(juros));
  set('j-inv',   brl(inv));
  set('j-rent',  pct(rent));
  set('j-renda', brl(renda));
  set('j-tm',    pct(tm * 100, 4));

  // barra de progresso: % do total que é capital investido
  const prog = g('j-prog');
  if (prog && saldo > 0) prog.style.width = Math.min(100, (inv / saldo) * 100).toFixed(1) + '%';

  // tabela anual
  const tb = g('tb-juros');
  if (tb) {
    tb.innerHTML = '';
    let s2 = ini;
    for (let a = 1; a <= anos; a++) {
      for (let m = 0; m < 12; m++) s2 = s2 * (1 + tm) + ap;
      const i2 = ini + ap * a * 12;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${a}º</td><td>${brl(i2)}</td><td class="pos">${brl(s2 - i2)}</td><td>${brl(s2)}</td>`;
      tb.appendChild(tr);
    }
  }

  mkChart('chart-juros', lbls, [
    { label: 'Capital Investido', data: sInv, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.15)', fill: true, tension: 0.4, pointRadius: 2 },
    { label: 'Patrimônio Total',  data: sTot, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)',  fill: true, tension: 0.4, pointRadius: 2 },
  ]);
}

// ── CDB ────────────────────────────────────────────────────────────────────
function calcCDB() {
  const val  = parseFloat(g('cdb-val')?.value) || 0;
  const pctC = parseFloat(g('cdb-pct')?.value) || 0;   // % do CDI (ex: 110)
  const cdi  = parseFloat(g('cdb-cdi')?.value) || 0;   // CDI anual % (ex: 13.75)
  const mes  = parseInt(g('cdb-m')?.value)     || 0;

  // taxa efetiva anual = CDI × (% CDI / 100)
  const taxaEfAnual = cdi * (pctC / 100);
  // converte para mensal equivalente
  const tm = taxaMensal(taxaEfAnual);

  const bruto = val * Math.pow(1 + tm, mes);
  const rend  = bruto - val;

  // IR regressivo por prazo em dias (aproximado por meses)
  const dias = mes * 30;
  let aliq;
  if (dias <= 180)      aliq = 22.5;
  else if (dias <= 360) aliq = 20.0;
  else if (dias <= 720) aliq = 17.5;
  else                  aliq = 15.0;

  const ir     = rend * (aliq / 100);
  const liq    = bruto - ir;
  const rl     = val > 0 ? ((liq - val) / val) * 100 : 0;
  // rendimento médio mensal líquido
  const mensal = mes > 0 ? (liq - val) / mes : 0;

  set('cdb-liq',   brl(liq));
  set('cdb-bruto', brl(bruto));
  set('cdb-ir',    brl(ir));
  set('cdb-aliq',  aliq.toString().replace('.', ',') + '%');
  set('cdb-rl',    pct(rl));
  set('cdb-men',   brl(mensal));

  // gráfico de evolução
  const lbls = [], sBruto = [], sLiq = [];
  const pts = Math.min(mes, 24);
  const step = Math.max(1, Math.floor(mes / pts));
  for (let m = 0; m <= mes; m += step) {
    const b  = val * Math.pow(1 + tm, m);
    const r2 = b - val;
    const d2 = m * 30;
    const a2 = d2 <= 180 ? 22.5 : d2 <= 360 ? 20 : d2 <= 720 ? 17.5 : 15;
    lbls.push('M' + m);
    sBruto.push(parseFloat(b.toFixed(2)));
    sLiq.push(parseFloat((b - r2 * (a2 / 100)).toFixed(2)));
  }
  mkChart('chart-cdb', lbls, [
    { label: 'Bruto',   data: sBruto, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)',  fill: true, tension: 0.4, pointRadius: 2 },
    { label: 'Líquido', data: sLiq,   borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, pointRadius: 2 },
  ]);
}

// ── TESOURO DIRETO ─────────────────────────────────────────────────────────
let tdTipo = 'selic';

function setTdTab(tipo, btn) {
  tdTipo = tipo;
  document.querySelectorAll('#modal-tesouro .tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const ipcaF = g('td-ipca-f');
  const tlbl  = g('td-tlbl');
  const tinp  = g('td-taxa');
  if (tipo === 'ipca') {
    ipcaF.style.display = '';
    tlbl.textContent = '📈 Taxa Real IPCA+ (%)';
    tinp.value = '6.00';
  } else if (tipo === 'pre') {
    ipcaF.style.display = 'none';
    tlbl.textContent = '📈 Taxa Prefixada (%)';
    tinp.value = '12.50';
  } else {
    ipcaF.style.display = 'none';
    tlbl.textContent = '📈 Taxa Selic (%)';
    tinp.value = '13.75';
  }
  calcTD();
}

function calcTD() {
  const val  = parseFloat(g('td-val')?.value)  || 0;
  const anos = parseInt(g('td-anos')?.value)   || 0;
  const taxa = parseFloat(g('td-taxa')?.value) || 0;
  const ipca = parseFloat(g('td-ipca')?.value) || 0;
  const dias = anos * 365;

  // taxa anual efetiva
  let taAnual;
  if (tdTipo === 'ipca') {
    // IPCA+: (1 + taxa real) × (1 + IPCA) - 1
    taAnual = (1 + taxa / 100) * (1 + ipca / 100) - 1;
  } else {
    taAnual = taxa / 100;
  }

  const bruto = val * Math.pow(1 + taAnual, anos);
  const rend  = bruto - val;

  // IR regressivo por dias
  let aliq;
  if (dias <= 180)      aliq = 22.5;
  else if (dias <= 360) aliq = 20.0;
  else if (dias <= 720) aliq = 17.5;
  else                  aliq = 15.0;

  const ir   = rend * (aliq / 100);
  const liq  = bruto - ir;
  const rent = val > 0 ? ((liq - val) / val) * 100 : 0;

  set('td-bruto', brl(bruto));
  set('td-ir',    brl(ir));
  set('td-liq',   brl(liq));
  set('td-rent',  pct(rent));
}

// ── RENDA MENSAL PASSIVA ───────────────────────────────────────────────────
function calcRenda() {
  const rendaDes = parseFloat(g('rm-renda')?.value) || 0;
  const tmPct    = parseFloat(g('rm-taxa')?.value)  || 0.01;

  // patrimônio = renda / taxa_mensal
  const pat   = tmPct > 0 ? rendaDes / (tmPct / 100) : 0;
  const anual = rendaDes * 12;
  // taxa anual equivalente
  const taAnual = (Math.pow(1 + tmPct / 100, 12) - 1) * 100;
  const dia     = rendaDes / 30;

  set('rm-pat',   brl(pat));
  set('rm-anual', brl(anual));
  set('rm-ta',    pct(taAnual));
  set('rm-dia',   brl(dia));
}

// ── APORTES MENSAIS ────────────────────────────────────────────────────────
function calcAportes() {
  const obj  = parseFloat(g('ap-obj')?.value)  || 0;
  const ini  = parseFloat(g('ap-ini')?.value)  || 0;
  const taxa = parseFloat(g('ap-taxa')?.value) || 0;
  const anos = parseInt(g('ap-anos')?.value)   || 0;

  const mes = anos * 12;
  const tm  = taxaMensal(taxa);

  // valor futuro do capital inicial
  const fvIni = ini * Math.pow(1 + tm, mes);
  // aporte necessário para completar o restante
  let ap = 0;
  if (tm > 0 && mes > 0) {
    ap = (obj - fvIni) / ((Math.pow(1 + tm, mes) - 1) / tm);
  } else if (mes > 0) {
    ap = (obj - ini) / mes;
  }
  ap = Math.max(0, ap);

  const totAp  = ap * mes;
  const totInv = ini + totAp;
  const juros  = Math.max(0, obj - totInv);

  set('ap-ap',  brl(ap));
  set('ap-tot', brl(totAp));
  set('ap-jur', brl(juros));
  set('ap-inv', brl(totInv));
}

// ── PREVIDÊNCIA PRIVADA ────────────────────────────────────────────────────
let pvTipo = 'pgbl';

function setPvTab(tipo, btn) {
  pvTipo = tipo;
  document.querySelectorAll('#modal-previdencia .tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const rf = g('pv-rf');
  if (rf) rf.style.display = tipo === 'pgbl' ? '' : 'none';
  calcPrev();
}

function calcPrev() {
  const ap   = parseFloat(g('pv-ap')?.value)    || 0;
  const anos = parseInt(g('pv-anos')?.value)    || 0;
  const taxa = parseFloat(g('pv-taxa')?.value)  || 0;
  const rend = parseFloat(g('pv-renda')?.value) || 0;

  const tm  = taxaMensal(taxa);
  const mes = anos * 12;

  // montante acumulado com aportes mensais
  const pat = tm > 0
    ? ap * ((Math.pow(1 + tm, mes) - 1) / tm)
    : ap * mes;

  const tot = ap * mes;
  const jur = pat - tot;

  // PGBL: dedução de até 12% da renda bruta anual no IR
  const ded = pvTipo === 'pgbl' ? Math.min(ap * 12, rend * 0.12) : 0;

  set('pv-pat', brl(pat));
  set('pv-jur', brl(jur));
  set('pv-tot', brl(tot));
  set('pv-ded', pvTipo === 'pgbl' ? brl(ded) + '/ano' : 'N/A (VGBL)');
}

// ── AÇÕES E DIVIDENDOS ─────────────────────────────────────────────────────
function calcAcoes() {
  const tick = g('ac-tick')?.value;
  const qtd  = parseInt(g('ac-qtd')?.value) || 0;
  const a    = ACOES[tick];
  if (!a) return;

  const inv    = a.preco * qtd;
  // dividendo anual = valor investido × DY
  const divAn  = inv * (a.dy / 100);
  // dividendo mensal estimado = anual / 12
  const divMen = divAn / 12;
  // dividendo por ação por mês
  const divPorAcao = divMen / (qtd || 1);

  set('ac-preco',    brl(a.preco));
  set('ac-inv',      brl(inv));
  set('ac-dy',       pct(a.dy));
  set('ac-men',      brl(divMen));
  set('ac-anual',    brl(divAn));
  set('ac-setor',    a.setor);
  set('ac-divacao',  brl(divPorAcao));
}

// ── FIIs ───────────────────────────────────────────────────────────────────
function calcFIIs() {
  const tick = g('fii-tick')?.value;
  const qtd  = parseInt(g('fii-qtd')?.value) || 0;
  const f    = FIIS[tick];
  if (!f) return;

  const inv    = f.preco * qtd;
  // dividendo mensal = dividendo por cota × quantidade
  const divMen = f.divM * qtd;
  const divAn  = divMen * 12;
  // yield mensal = dividendo por cota / preço da cota
  const ym     = f.preco > 0 ? (f.divM / f.preco) * 100 : 0;
  const ya     = ym * 12;

  set('fii-preco', brl(f.preco));
  set('fii-inv',   brl(inv));
  set('fii-ym',    pct(ym, 3));
  set('fii-ya',    pct(ya, 2));
  set('fii-men',   brl(divMen));
  set('fii-anual', brl(divAn));
  set('fii-tipo',  f.tipo);
}

// ── CARTEIRA DIVERSIFICADA ─────────────────────────────────────────────────
function calcCarteira() {
  const rfV  = parseFloat(g('ct-rf')?.value)  || 0;
  const rfT  = parseFloat(g('ct-rft')?.value) || 0;   // taxa mensal %
  const acV  = parseFloat(g('ct-ac')?.value)  || 0;
  const acDY = parseFloat(g('ct-ady')?.value) || 0;   // DY anual %
  const fiiV = parseFloat(g('ct-fii')?.value) || 0;
  const fiiY = parseFloat(g('ct-fym')?.value) || 0;   // yield mensal %

  // renda mensal de cada classe
  const rfR  = rfV  * (rfT  / 100);
  const acR  = acV  * (acDY / 100) / 12;   // DY anual ÷ 12
  const fiiR = fiiV * (fiiY / 100);

  const men   = rfR + acR + fiiR;
  const anual = men * 12;
  const pat   = rfV + acV + fiiV;
  const yld   = pat > 0 ? (men / pat) * 100 : 0;

  set('ct-men',   brl(men));
  set('ct-anual', brl(anual));
  set('ct-pat',   brl(pat));
  set('ct-yield', pct(yld, 3));
  set('ct-rfr',   brl(rfR));
  set('ct-varr',  brl(acR + fiiR));

  mkChart('chart-carteira',
    ['Renda Fixa', 'Ações', 'FIIs'],
    [{
      data: [rfV, acV, fiiV],
      backgroundColor: ['rgba(99,102,241,0.85)', 'rgba(16,185,129,0.85)', 'rgba(245,158,11,0.85)'],
      borderColor: ['#6366f1', '#10b981', '#f59e0b'],
      borderWidth: 2,
      hoverOffset: 10,
    }],
    'doughnut'
  );
}

// ── INIT ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  animateCounters();

  // tema
  const btn = g('themeBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme();
    });
  }

  // teclado nos cards
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); }
    });
  });
});
