// ============================================================
// DATI MOCKUP - Prodotto 1 (Freader) e Prodotto 2 (CutAI)
// ============================================================

const PRODOTTO1_CONTRATTI = [
  { cliente:"Ciao", sede:"Milano", canoneTrim:10000, prezzoF1:12, prezzoF2:10, prezzoF3:9, creditoUptime:10, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"20/03/2025" },
  { cliente:"Hello", sede:"Roma", canoneTrim:5000, prezzoF1:20, prezzoF2:16, prezzoF3:12, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"20/07/2025" },
  { cliente:"Hola", sede:"Milano", canoneTrim:10000, prezzoF1:13, prezzoF2:11, prezzoF3:10, creditoUptime:10, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"20/08/2025" },
  { cliente:"Bonjour", sede:"Roma", canoneTrim:7000, prezzoF1:15, prezzoF2:14, prezzoF3:13, creditoUptime:7, creditoTicketing:6, tettoCred:10, durataMesi:36, preavvisoGG:30, dataFirma:"30/12/2024" },
  { cliente:"Hallo", sede:"Torino", canoneTrim:10000, prezzoF1:13, prezzoF2:11, prezzoF3:10, creditoUptime:10, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:60, dataFirma:"20/10/2025" },
  { cliente:"Ola", sede:"Bologna", canoneTrim:10000, prezzoF1:12, prezzoF2:10, prezzoF3:8, creditoUptime:7, creditoTicketing:10, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"14/04/2025" },
  { cliente:"Salut", sede:"Napoli", canoneTrim:10000, prezzoF1:14, prezzoF2:12, prezzoF3:11, creditoUptime:5, creditoTicketing:6, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"27/02/2025" },
  { cliente:"Ahoj", sede:"Milano", canoneTrim:7000, prezzoF1:15, prezzoF2:13, prezzoF3:12, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:24, preavvisoGG:12, dataFirma:"19/12/2024" },
  { cliente:"Dobrý den", sede:"Roma", canoneTrim:7000, prezzoF1:15, prezzoF2:12, prezzoF3:10, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:24, preavvisoGG:30, dataFirma:"04/04/2024" },
  { cliente:"Szia", sede:"Firenze", canoneTrim:7000, prezzoF1:16, prezzoF2:14, prezzoF3:13, creditoUptime:5, creditoTicketing:8, tettoCred:12, durataMesi:22, preavvisoGG:30, dataFirma:"06/06/2025" },
  { cliente:"Hej", sede:"Genova", canoneTrim:5000, prezzoF1:20, prezzoF2:18, prezzoF3:14, creditoUptime:7, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"07/08/2025" },
  { cliente:"Merhaba", sede:"Verona", canoneTrim:5000, prezzoF1:18, prezzoF2:16, prezzoF3:15, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"06/07/2025" },
  { cliente:"Selam", sede:"Padova", canoneTrim:5000, prezzoF1:19, prezzoF2:17, prezzoF3:16, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:6, preavvisoGG:30, dataFirma:"07/08/2025" },
  { cliente:"Bok", sede:"Brescia", canoneTrim:7000, prezzoF1:16, prezzoF2:14, prezzoF3:13, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"06/05/2025" },
  { cliente:"Zdravo", sede:"Milano", canoneTrim:7000, prezzoF1:15, prezzoF2:13, prezzoF3:12, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"09/09/2025" },
  { cliente:"Buna", sede:"Roma", canoneTrim:5000, prezzoF1:17, prezzoF2:14, prezzoF3:13, creditoUptime:8, creditoTicketing:5, tettoCred:13, durataMesi:36, preavvisoGG:120, dataFirma:"12/12/2024" },
  { cliente:"Alo", sede:"Torino", canoneTrim:7000, prezzoF1:14, prezzoF2:12, prezzoF3:11, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30, dataFirma:"04/04/2025" },
  { cliente:"Labas", sede:"Bologna", canoneTrim:7000, prezzoF1:12, prezzoF2:9, prezzoF3:8, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:8, preavvisoGG:30, dataFirma:"01/01/2026" },
  { cliente:"Sveiki", sede:"Napoli", canoneTrim:7000, prezzoF1:16, prezzoF2:14, prezzoF3:13, creditoUptime:9, creditoTicketing:5, tettoCred:12, durataMesi:18, preavvisoGG:90, dataFirma:"05/02/2025" },
  { cliente:"Tere", sede:"Modena", canoneTrim:10000, prezzoF1:13, prezzoF2:10, prezzoF3:6, creditoUptime:5, creditoTicketing:10, tettoCred:12, durataMesi:12, preavvisoGG:30, dataFirma:"12/05/2024" },
];

const PRODOTTO2_CONTRATTI = [
  { cliente:"Buonasera", sede:"Milano", dataFirma:"12/01/2025", canoneTrim:1000, utentiInclusi:70, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:30 },
  { cliente:"Buenasera", sede:"Roma", dataFirma:"27/04/2025", canoneTrim:3000, utentiInclusi:100, feeExtra:20, profilo:"Premium", sogliaUptime:99, creditoUptime:10, creditoTicketing:5, tettoCred:15, durataMesi:24, preavvisoGG:60 },
  { cliente:"Bonsoir", sede:"Torino", dataFirma:"09/05/2025", canoneTrim:15000, utentiInclusi:70, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:4, tettoCred:9, durataMesi:24, preavvisoGG:45 },
  { cliente:"Good evening", sede:"Milano", dataFirma:"21/05/2025", canoneTrim:15000, utentiInclusi:80, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:24, preavvisoGG:60 },
  { cliente:"Guten Abend", sede:"Napoli", dataFirma:"03/06/2025", canoneTrim:2000, utentiInclusi:50, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:4, tettoCred:9, durataMesi:12, preavvisoGG:60 },
  { cliente:"Boa noite", sede:"Bologna", dataFirma:"18/06/2025", canoneTrim:3000, utentiInclusi:60, feeExtra:30, profilo:"Premium", sogliaUptime:99, creditoUptime:15, creditoTicketing:5, tettoCred:20, durataMesi:24, preavvisoGG:60 },
  { cliente:"Buna seara", sede:"Roma", dataFirma:"07/07/2025", canoneTrim:2000, utentiInclusi:80, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:4, tettoCred:9, durataMesi:12, preavvisoGG:60 },
  { cliente:"Dobra vecer", sede:"Firenze", dataFirma:"22/07/2025", canoneTrim:1500, utentiInclusi:60, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:4, tettoCred:9, durataMesi:12, preavvisoGG:60 },
  { cliente:"Dobar vecer", sede:"Milano", dataFirma:"11/08/2025", canoneTrim:1500, utentiInclusi:80, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:4, tettoCred:9, durataMesi:12, preavvisoGG:60 },
  { cliente:"Labas vakaras", sede:"Genova", dataFirma:"29/08/2025", canoneTrim:4000, utentiInclusi:90, feeExtra:20, profilo:"Premium", sogliaUptime:99, creditoUptime:15, creditoTicketing:5, tettoCred:20, durataMesi:12, preavvisoGG:30 },
  { cliente:"Labvakar", sede:"Verona", dataFirma:"14/09/2025", canoneTrim:1200, utentiInclusi:80, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:4, tettoCred:9, durataMesi:36, preavvisoGG:60 },
  { cliente:"Tere ohtust", sede:"Milano", dataFirma:"30/09/2025", canoneTrim:1200, utentiInclusi:80, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:4, tettoCred:9, durataMesi:12, preavvisoGG:45 },
  { cliente:"Hyvaa iltaa", sede:"Padova", dataFirma:"12/10/2025", canoneTrim:3500, utentiInclusi:60, feeExtra:35, profilo:"Premium", sogliaUptime:99, creditoUptime:15, creditoTicketing:5, tettoCred:20, durataMesi:12, preavvisoGG:60 },
  { cliente:"God kveld", sede:"Bari", dataFirma:"26/10/2025", canoneTrim:1000, utentiInclusi:40, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:6, tettoCred:11, durataMesi:12, preavvisoGG:60 },
  { cliente:"God aften", sede:"Roma", dataFirma:"08/11/2025", canoneTrim:2800, utentiInclusi:40, feeExtra:30, profilo:"Premium", sogliaUptime:99, creditoUptime:15, creditoTicketing:5, tettoCred:20, durataMesi:12, preavvisoGG:60 },
  { cliente:"God kvall", sede:"Venezia", dataFirma:"24/11/2025", canoneTrim:1800, utentiInclusi:60, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:4, tettoCred:9, durataMesi:12, preavvisoGG:30 },
  { cliente:"Yaxsam xeyir", sede:"Catania", dataFirma:"10/12/2025", canoneTrim:1500, utentiInclusi:65, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:10, creditoTicketing:5, tettoCred:15, durataMesi:24, preavvisoGG:60 },
  { cliente:"Dobry vecer", sede:"Milano", dataFirma:"21/12/2025", canoneTrim:1500, utentiInclusi:38, feeExtra:35, profilo:"Premium", sogliaUptime:99, creditoUptime:15, creditoTicketing:5, tettoCred:20, durataMesi:12, preavvisoGG:30 },
  { cliente:"Pryjemnyj vecir", sede:"Modena", dataFirma:"05/01/2026", canoneTrim:1500, utentiInclusi:65, feeExtra:20, profilo:"Standard", sogliaUptime:98, creditoUptime:5, creditoTicketing:5, tettoCred:10, durataMesi:12, preavvisoGG:60 },
  { cliente:"Kalispera", sede:"Palermo", dataFirma:"19/01/2026", canoneTrim:2000, utentiInclusi:50, feeExtra:35, profilo:"Premium", sogliaUptime:99, creditoUptime:15, creditoTicketing:5, tettoCred:20, durataMesi:12, preavvisoGG:30 },
];


// ============================================================
// COSTI MOCKUP
// ============================================================
const COSTI = {
  prodotto1: {
    fissi: [
      { voce:"Licenza infrastruttura cloud", importo:18000, tipo:"indiretto" },
      { voce:"Stipendi team sviluppo", importo:120000, tipo:"diretto" },
      { voce:"Affitto ufficio", importo:24000, tipo:"indiretto" },
      { voce:"Ammortamento server", importo:15000, tipo:"indiretto" },
      { voce:"Assicurazione", importo:6000, tipo:"indiretto" },
    ],
    variabili: [
      { voce:"Costo elaborazione pagine (hosting)", importo:0.03, unitaMisura:"€/pagina", volumeStimato:500000, tipo:"diretto" },
      { voce:"Supporto clienti (ticket)", importo:8, unitaMisura:"€/ticket", volumeStimato:1200, tipo:"diretto" },
      { voce:"Commissioni pagamento", importo:0.5, unitaMisura:"% fatturato", tipo:"indiretto" },
      { voce:"Marketing digitale", importo:3000, unitaMisura:"€/mese", tipo:"indiretto" },
      { voce:"Formazione clienti", importo:500, unitaMisura:"€/cliente", volumeStimato:20, tipo:"diretto" },
    ]
  },
  prodotto2: {
    fissi: [
      { voce:"Licenza AI engine", importo:25000, tipo:"indiretto" },
      { voce:"Stipendi team AI/ML", importo:150000, tipo:"diretto" },
      { voce:"Affitto ufficio (quota)", importo:12000, tipo:"indiretto" },
      { voce:"Ammortamento GPU cluster", importo:30000, tipo:"indiretto" },
      { voce:"Certificazioni sicurezza", importo:8000, tipo:"indiretto" },
    ],
    variabili: [
      { voce:"Costo computazione AI per utente", importo:2.5, unitaMisura:"€/utente/mese", volumeStimato:1400, tipo:"diretto" },
      { voce:"Supporto clienti (ticket)", importo:12, unitaMisura:"€/ticket", volumeStimato:800, tipo:"diretto" },
      { voce:"Commissioni pagamento", importo:0.5, unitaMisura:"% fatturato", tipo:"indiretto" },
      { voce:"Marketing digitale", importo:4000, unitaMisura:"€/mese", tipo:"indiretto" },
      { voce:"Onboarding clienti", importo:800, unitaMisura:"€/cliente", volumeStimato:20, tipo:"diretto" },
    ]
  }
};

// ============================================================
// UTILITY
// ============================================================
function parseDataIta(str) {
  const [g, m, a] = str.split("/").map(Number);
  return new Date(a, m - 1, g);
}
function formatDate(d) {
  return d.toLocaleDateString("it-IT", { day:"2-digit", month:"2-digit", year:"numeric" });
}
function formatEuro(n) {
  return n.toLocaleString("it-IT", { style:"currency", currency:"EUR" });
}
function giorniAllaScadenza(dataFirma, durataMesi) {
  const firma = parseDataIta(dataFirma);
  const scadenza = new Date(firma);
  scadenza.setMonth(scadenza.getMonth() + durataMesi);
  const oggi = new Date(2026, 2, 28); // 28 marzo 2026
  return Math.ceil((scadenza - oggi) / (1000 * 60 * 60 * 24));
}
function dataScadenza(dataFirma, durataMesi) {
  const firma = parseDataIta(dataFirma);
  const scadenza = new Date(firma);
  scadenza.setMonth(scadenza.getMonth() + durataMesi);
  return scadenza;
}

// Unisci tutti i contratti con prodotto di riferimento
function getAllContratti() {
  const all = [];
  PRODOTTO1_CONTRATTI.forEach(c => {
    const scad = dataScadenza(c.dataFirma, c.durataMesi);
    const gg = giorniAllaScadenza(c.dataFirma, c.durataMesi);
    const fattAnnuo = c.canoneTrim * 4;
    all.push({ ...c, prodotto:"Freader", scadenza:scad, giorniScadenza:gg, fatturatoAnnuo:fattAnnuo });
  });
  PRODOTTO2_CONTRATTI.forEach(c => {
    const scad = dataScadenza(c.dataFirma, c.durataMesi);
    const gg = giorniAllaScadenza(c.dataFirma, c.durataMesi);
    const fattAnnuo = c.canoneTrim * 4;
    all.push({ ...c, prodotto:"CutAI", scadenza:scad, giorniScadenza:gg, fatturatoAnnuo:fattAnnuo });
  });
  return all;
}


// ============================================================
// CALCOLO COSTO PRODOTTO (Tradizionale + ABC)
// ============================================================
function calcolaCostoProdotto(prodKey) {
  const c = COSTI[prodKey];
  const totFissi = c.fissi.reduce((s, x) => s + x.importo, 0);
  const totVariabili = c.variabili.reduce((s, x) => {
    if (x.volumeStimato) return s + x.importo * x.volumeStimato;
    if (x.unitaMisura === "€/mese") return s + x.importo * 12;
    return s + x.importo;
  }, 0);
  const totDiretti = [...c.fissi, ...c.variabili].filter(x => x.tipo === "diretto").reduce((s, x) => {
    if (x.volumeStimato) return s + x.importo * x.volumeStimato;
    if (x.unitaMisura === "€/mese") return s + x.importo * 12;
    return s + x.importo;
  }, 0);
  const totIndiretti = [...c.fissi, ...c.variabili].filter(x => x.tipo === "indiretto").reduce((s, x) => {
    if (x.volumeStimato) return s + x.importo * x.volumeStimato;
    if (x.unitaMisura === "€/mese") return s + x.importo * 12;
    return s + x.importo;
  }, 0);
  const nContratti = prodKey === "prodotto1" ? PRODOTTO1_CONTRATTI.length : PRODOTTO2_CONTRATTI.length;

  // Metodo tradizionale: allocazione indiretti proporzionale al n. contratti
  const costoTotTrad = totDiretti + totIndiretti;
  const costoUnitTrad = costoTotTrad / nContratti;

  // Metodo ABC: allocazione per attività
  const attivitaABC = [
    { nome:"Gestione infrastruttura", driver:"n. contratti", costoPool: totIndiretti * 0.4 },
    { nome:"Supporto clienti", driver:"n. ticket", costoPool: totIndiretti * 0.3 },
    { nome:"Amministrazione", driver:"n. contratti", costoPool: totIndiretti * 0.2 },
    { nome:"Marketing", driver:"fatturato", costoPool: totIndiretti * 0.1 },
  ];
  const costoUnitABC = (totDiretti + attivitaABC.reduce((s, a) => s + a.costoPool / nContratti, 0) * nContratti) / nContratti;

  return { totFissi, totVariabili, totDiretti, totIndiretti, costoTotTrad, costoUnitTrad, costoUnitABC, nContratti, attivitaABC };
}

// ============================================================
// ANALISI CONTRATTO
// ============================================================
function analizzaContratto(contratto, tuttiContratti) {
  const stessoProdotto = tuttiContratti.filter(c => c.prodotto === contratto.prodotto);
  const avgCanone = stessoProdotto.reduce((s, c) => s + c.canoneTrim, 0) / stessoProdotto.length;
  const issues = [];

  // Clausole non convenienti
  if (contratto.creditoUptime >= 10) issues.push({ sezione:"Crediti Uptime", gravita:"alta", desc:`Credito uptime ${contratto.creditoUptime}% è molto alto rispetto alla media. Rischio di rimborsi elevati.` });
  else if (contratto.creditoUptime >= 7) issues.push({ sezione:"Crediti Uptime", gravita:"media", desc:`Credito uptime ${contratto.creditoUptime}% sopra la media. Monitorare SLA.` });

  if (contratto.creditoTicketing >= 8) issues.push({ sezione:"Crediti Ticketing", gravita:"alta", desc:`Credito ticketing ${contratto.creditoTicketing}% molto elevato. Clausola penalizzante.` });
  else if (contratto.creditoTicketing >= 6) issues.push({ sezione:"Crediti Ticketing", gravita:"media", desc:`Credito ticketing ${contratto.creditoTicketing}% sopra la norma.` });

  if (contratto.tettoCred >= 15) issues.push({ sezione:"Tetto Crediti", gravita:"alta", desc:`Tetto crediti ${contratto.tettoCred}% molto alto. Esposizione finanziaria significativa.` });
  else if (contratto.tettoCred >= 12) issues.push({ sezione:"Tetto Crediti", gravita:"media", desc:`Tetto crediti ${contratto.tettoCred}% sopra la media del portafoglio.` });

  // Costi non sostenibili
  if (contratto.canoneTrim < avgCanone * 0.6) issues.push({ sezione:"Canone", gravita:"alta", desc:`Canone ${formatEuro(contratto.canoneTrim)} è il ${Math.round(contratto.canoneTrim/avgCanone*100)}% della media (${formatEuro(avgCanone)}). Potrebbe non coprire i costi.` });
  else if (contratto.canoneTrim < avgCanone * 0.8) issues.push({ sezione:"Canone", gravita:"media", desc:`Canone sotto la media del portafoglio. Valutare rinegoziazione al rinnovo.` });

  // Durata e preavviso
  if (contratto.durataMesi >= 36) issues.push({ sezione:"Durata", gravita:"media", desc:`Contratto a lungo termine (${contratto.durataMesi} mesi). Limita flessibilità di repricing.` });
  if (contratto.preavvisoGG >= 90) issues.push({ sezione:"Preavviso", gravita:"media", desc:`Preavviso di ${contratto.preavvisoGG} giorni. Vincolo operativo elevato.` });
  if (contratto.preavvisoGG <= 15) issues.push({ sezione:"Preavviso", gravita:"alta", desc:`Preavviso di soli ${contratto.preavvisoGG} giorni. Rischio di churn improvviso.` });

  // Scadenza imminente
  if (contratto.giorniScadenza <= 30 && contratto.giorniScadenza > 0) issues.push({ sezione:"Scadenza", gravita:"alta", desc:`Contratto in scadenza tra ${contratto.giorniScadenza} giorni. Azione immediata richiesta.` });
  else if (contratto.giorniScadenza <= 90 && contratto.giorniScadenza > 0) issues.push({ sezione:"Scadenza", gravita:"media", desc:`Contratto in scadenza tra ${contratto.giorniScadenza} giorni. Pianificare rinnovo.` });
  else if (contratto.giorniScadenza <= 0) issues.push({ sezione:"Scadenza", gravita:"alta", desc:`Contratto SCADUTO da ${Math.abs(contratto.giorniScadenza)} giorni. Verificare stato rinnovo.` });

  if (issues.length === 0) issues.push({ sezione:"Generale", gravita:"bassa", desc:"Nessuna criticità rilevata. Contratto in linea con il portafoglio." });

  return issues;
}

// ============================================================
// KPI & PERFORMANCE
// ============================================================
function calcolaKPI() {
  const tutti = getAllContratti();
  const p1 = tutti.filter(c => c.prodotto === "Freader");
  const p2 = tutti.filter(c => c.prodotto === "CutAI");

  const fattP1 = p1.reduce((s, c) => s + c.fatturatoAnnuo, 0);
  const fattP2 = p2.reduce((s, c) => s + c.fatturatoAnnuo, 0);
  const fattTot = fattP1 + fattP2;

  const costiP1 = calcolaCostoProdotto("prodotto1");
  const costiP2 = calcolaCostoProdotto("prodotto2");
  const costiTotali = costiP1.costoTotTrad + costiP2.costoTotTrad;

  const margine = fattTot - costiTotali;
  const marginePct = (margine / fattTot * 100);

  // BEP (Break Even Point) - n. contratti necessari
  const avgFattPerContratto = fattTot / tutti.length;
  const costiFissiTot = costiP1.totFissi + costiP2.totFissi;
  const costiVarPerContratto = (costiP1.totVariabili + costiP2.totVariabili) / tutti.length;
  const bepContratti = Math.ceil(costiFissiTot / (avgFattPerContratto - costiVarPerContratto));
  const bepEuro = bepContratti * avgFattPerContratto;

  // Contratti attivi vs scaduti
  const attivi = tutti.filter(c => c.giorniScadenza > 0).length;
  const scaduti = tutti.filter(c => c.giorniScadenza <= 0).length;
  const inScadenza90 = tutti.filter(c => c.giorniScadenza > 0 && c.giorniScadenza <= 90).length;

  // MoM e YoY (mockup)
  const momGrowth = 3.2;
  const yoyGrowth = 18.5;

  return {
    fattTot, fattP1, fattP2, costiTotali, margine, marginePct,
    bepContratti, bepEuro, totContratti: tutti.length, attivi, scaduti, inScadenza90,
    momGrowth, yoyGrowth, avgFattPerContratto
  };
}


// ============================================================
// TOP CLIENTS RATING
// ============================================================
function calcolaTopClients() {
  const tutti = getAllContratti();
  return tutti.map(c => {
    let score = 50; // base
    // Canone alto = buono
    const maxCanone = Math.max(...tutti.map(x => x.canoneTrim));
    score += (c.canoneTrim / maxCanone) * 20;
    // Clausole favorevoli (crediti bassi = buono per noi)
    if (c.creditoUptime <= 5) score += 10; else if (c.creditoUptime <= 7) score += 5;
    if (c.creditoTicketing <= 5) score += 5;
    if (c.tettoCred <= 10) score += 5;
    // Durata lunga = fiducia
    if (c.durataMesi >= 24) score += 10; else if (c.durataMesi >= 12) score += 5;
    // Contratto attivo
    if (c.giorniScadenza > 180) score += 5;
    else if (c.giorniScadenza <= 0) score -= 10;
    // Preavviso ragionevole
    if (c.preavvisoGG >= 30 && c.preavvisoGG <= 60) score += 3;

    return { ...c, rating: Math.min(100, Math.max(0, Math.round(score))) };
  }).sort((a, b) => b.rating - a.rating);
}

// ============================================================
// RENDER UI
// ============================================================
let currentSection = "costi";
let selectedProdottoCosti = "prodotto1";
let selectedContractIndex = null;

function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <nav class="navbar">
      <div class="logo">📊 Business Dashboard</div>
      <div class="nav-links">
        <button class="${currentSection==='costi'?'active':''}" onclick="navigate('costi')">💰 Reparto Costi</button>
        <button class="${currentSection==='vendite'?'active':''}" onclick="navigate('vendite')">📝 Vendite & Contratti</button>
        <button class="${currentSection==='performance'?'active':''}" onclick="navigate('performance')">📈 Performance</button>
        <button class="${currentSection==='topclients'?'active':''}" onclick="navigate('topclients')">⭐ Top Clients</button>
      </div>
    </nav>
    <main class="content">
      ${renderSection()}
    </main>
  `;
}

function navigate(section) {
  currentSection = section;
  selectedContractIndex = null;
  render();
}

function renderSection() {
  switch(currentSection) {
    case "costi": return renderCosti();
    case "vendite": return renderVendite();
    case "performance": return renderPerformance();
    case "topclients": return renderTopClients();
    default: return "";
  }
}


// ============================================================
// SEZIONE COSTI
// ============================================================
function renderCosti() {
  const cp = calcolaCostoProdotto(selectedProdottoCosti);
  const c = COSTI[selectedProdottoCosti];
  const nomeProd = selectedProdottoCosti === "prodotto1" ? "Freader" : "CutAI";

  return `
    <div class="section-header">
      <h2>Reparto Costi</h2>
      <div class="toggle-prod">
        <button class="${selectedProdottoCosti==='prodotto1'?'active':''}" onclick="switchProdCosti('prodotto1')">Freader</button>
        <button class="${selectedProdottoCosti==='prodotto2'?'active':''}" onclick="switchProdCosti('prodotto2')">CutAI</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-card"><span class="kpi-label">Costi Fissi Totali</span><span class="kpi-value">${formatEuro(cp.totFissi)}</span></div>
      <div class="kpi-card"><span class="kpi-label">Costi Variabili Totali</span><span class="kpi-value">${formatEuro(cp.totVariabili)}</span></div>
      <div class="kpi-card"><span class="kpi-label">Costi Diretti</span><span class="kpi-value">${formatEuro(cp.totDiretti)}</span></div>
      <div class="kpi-card"><span class="kpi-label">Costi Indiretti</span><span class="kpi-value">${formatEuro(cp.totIndiretti)}</span></div>
    </div>

    <div class="two-col">
      <div class="card">
        <h3>Costi Fissi</h3>
        <table>
          <thead><tr><th>Voce</th><th>Importo Annuo</th><th>Tipo</th></tr></thead>
          <tbody>
            ${c.fissi.map(x => `<tr><td>${x.voce}</td><td>${formatEuro(x.importo)}</td><td><span class="badge ${x.tipo}">${x.tipo}</span></td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3>Costi Variabili</h3>
        <table>
          <thead><tr><th>Voce</th><th>Costo Unitario</th><th>Tipo</th></tr></thead>
          <tbody>
            ${c.variabili.map(x => `<tr><td>${x.voce}</td><td>${x.importo} ${x.unitaMisura||''}</td><td><span class="badge ${x.tipo}">${x.tipo}</span></td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="two-col" style="margin-top:20px">
      <div class="card highlight">
        <h3>📐 Metodo Tradizionale</h3>
        <p>Allocazione costi indiretti proporzionale al numero di contratti (${cp.nContratti})</p>
        <div class="cost-result">
          <div><span>Costo Totale Prodotto</span><strong>${formatEuro(cp.costoTotTrad)}</strong></div>
          <div><span>Costo Unitario per Contratto</span><strong>${formatEuro(cp.costoUnitTrad)}</strong></div>
        </div>
      </div>
      <div class="card highlight">
        <h3>🔬 Metodo ABC (Activity Based Costing)</h3>
        <p>Allocazione per attività con driver specifici</p>
        <div class="abc-activities">
          ${cp.attivitaABC.map(a => `<div class="abc-row"><span>${a.nome}</span><span class="abc-driver">${a.driver}</span><span>${formatEuro(a.costoPool)}</span></div>`).join("")}
        </div>
        <div class="cost-result">
          <div><span>Costo Unitario ABC per Contratto</span><strong>${formatEuro(cp.costoUnitABC)}</strong></div>
        </div>
      </div>
    </div>
  `;
}

function switchProdCosti(p) {
  selectedProdottoCosti = p;
  render();
}


// ============================================================
// SEZIONE VENDITE & CONTRATTI
// ============================================================
function renderVendite() {
  const tutti = getAllContratti();
  const firmati = tutti.filter(c => c.giorniScadenza <= 0 || c.giorniScadenza > 0); // tutti
  const conclusi = tutti.filter(c => c.giorniScadenza <= 0);
  const inScadenza = tutti.filter(c => c.giorniScadenza > 0).sort((a, b) => a.giorniScadenza - b.giorniScadenza).slice(0, 3);

  if (selectedContractIndex !== null) {
    return renderAnalisiContratto(tutti[selectedContractIndex], tutti);
  }

  return `
    <div class="section-header"><h2>Vendite & Contratti</h2></div>

    <div class="kpi-row">
      <div class="kpi-card"><span class="kpi-label">Contratti Totali</span><span class="kpi-value">${tutti.length}</span></div>
      <div class="kpi-card"><span class="kpi-label">Contratti Attivi</span><span class="kpi-value green">${tutti.filter(c=>c.giorniScadenza>0).length}</span></div>
      <div class="kpi-card"><span class="kpi-label">Contratti Scaduti</span><span class="kpi-value red">${conclusi.length}</span></div>
      <div class="kpi-card"><span class="kpi-label">In Scadenza (90gg)</span><span class="kpi-value orange">${tutti.filter(c=>c.giorniScadenza>0&&c.giorniScadenza<=90).length}</span></div>
    </div>

    <div class="card" style="margin-top:20px">
      <h3>⚠️ Top 3 Contratti in Scadenza</h3>
      <div class="expiring-list">
        ${inScadenza.map(c => {
          const idx = tutti.indexOf(c);
          return `<div class="expiring-card ${c.giorniScadenza<=30?'urgent':c.giorniScadenza<=60?'warning':'normal'}" onclick="openContract(${idx})">
            <div class="exp-header">
              <strong>${c.cliente}</strong>
              <span class="badge-prod ${c.prodotto.toLowerCase()}">${c.prodotto}</span>
            </div>
            <div class="exp-details">
              <span>📍 ${c.sede}</span>
              <span>💰 ${formatEuro(c.canoneTrim)}/trim</span>
              <span>📅 Scade: ${formatDate(c.scadenza)}</span>
              <span class="days-left">${c.giorniScadenza} giorni</span>
            </div>
          </div>`;
        }).join("")}
      </div>
    </div>

    <div class="card" style="margin-top:20px">
      <h3>📋 Tutti i Contratti Firmati</h3>
      <table class="contracts-table">
        <thead>
          <tr><th>Cliente</th><th>Prodotto</th><th>Sede</th><th>Canone Trim.</th><th>Durata</th><th>Firma</th><th>Scadenza</th><th>Stato</th><th></th></tr>
        </thead>
        <tbody>
          ${tutti.map((c, i) => `
            <tr class="clickable-row" onclick="openContract(${i})">
              <td><strong>${c.cliente}</strong></td>
              <td><span class="badge-prod ${c.prodotto.toLowerCase()}">${c.prodotto}</span></td>
              <td>${c.sede}</td>
              <td>${formatEuro(c.canoneTrim)}</td>
              <td>${c.durataMesi} mesi</td>
              <td>${c.dataFirma}</td>
              <td>${formatDate(c.scadenza)}</td>
              <td><span class="status ${c.giorniScadenza>90?'active':c.giorniScadenza>0?'expiring':'expired'}">${c.giorniScadenza>90?'Attivo':c.giorniScadenza>0?'In scadenza':'Scaduto'}</span></td>
              <td>🔍</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function openContract(idx) {
  selectedContractIndex = idx;
  render();
}


// ============================================================
// ANALISI SINGOLO CONTRATTO
// ============================================================
function renderAnalisiContratto(c, tutti) {
  const issues = analizzaContratto(c, tutti);
  const alte = issues.filter(i => i.gravita === "alta");
  const medie = issues.filter(i => i.gravita === "media");
  const basse = issues.filter(i => i.gravita === "bassa");

  return `
    <div class="section-header">
      <button class="back-btn" onclick="navigate('vendite')">← Torna ai contratti</button>
      <h2>Analisi Contratto: ${c.cliente}</h2>
      <span class="badge-prod ${c.prodotto.toLowerCase()}">${c.prodotto}</span>
    </div>

    <div class="kpi-row">
      <div class="kpi-card"><span class="kpi-label">Canone Trimestrale</span><span class="kpi-value">${formatEuro(c.canoneTrim)}</span></div>
      <div class="kpi-card"><span class="kpi-label">Fatturato Annuo</span><span class="kpi-value">${formatEuro(c.fatturatoAnnuo)}</span></div>
      <div class="kpi-card"><span class="kpi-label">Durata</span><span class="kpi-value">${c.durataMesi} mesi</span></div>
      <div class="kpi-card"><span class="kpi-label">Giorni alla Scadenza</span><span class="kpi-value ${c.giorniScadenza<=30?'red':c.giorniScadenza<=90?'orange':'green'}">${c.giorniScadenza>0?c.giorniScadenza:'SCADUTO'}</span></div>
    </div>

    <div class="two-col" style="margin-top:20px">
      <div class="card">
        <h3>📄 Dettagli Contratto</h3>
        <div class="detail-grid">
          <div><span>Cliente</span><strong>${c.cliente}</strong></div>
          <div><span>Sede</span><strong>${c.sede}</strong></div>
          <div><span>Data Firma</span><strong>${c.dataFirma}</strong></div>
          <div><span>Scadenza</span><strong>${formatDate(c.scadenza)}</strong></div>
          <div><span>Preavviso Disdetta</span><strong>${c.preavvisoGG} giorni</strong></div>
          <div><span>Credito Uptime</span><strong>${c.creditoUptime}%</strong></div>
          <div><span>Credito Ticketing</span><strong>${c.creditoTicketing}%</strong></div>
          <div><span>Tetto Crediti</span><strong>${c.tettoCred}%</strong></div>
          ${c.profilo ? `<div><span>Profilo</span><strong>${c.profilo}</strong></div>` : ''}
          ${c.utentiInclusi ? `<div><span>Utenti Inclusi</span><strong>${c.utentiInclusi}</strong></div>` : ''}
          ${c.feeExtra ? `<div><span>Fee Utente Extra</span><strong>${formatEuro(c.feeExtra)}/mese</strong></div>` : ''}
          ${c.prezzoF1 ? `<div><span>Prezzo Fascia 1</span><strong>${c.prezzoF1} cent/pag</strong></div>` : ''}
          ${c.prezzoF2 ? `<div><span>Prezzo Fascia 2</span><strong>${c.prezzoF2} cent/pag</strong></div>` : ''}
          ${c.prezzoF3 ? `<div><span>Prezzo Fascia 3</span><strong>${c.prezzoF3} cent/pag</strong></div>` : ''}
        </div>
      </div>

      <div class="card">
        <h3>🔎 Analisi Criticità</h3>
        <div class="issues-summary">
          <span class="issue-count alta">${alte.length} Alta</span>
          <span class="issue-count media">${medie.length} Media</span>
          <span class="issue-count bassa">${basse.length} Bassa</span>
        </div>
        <div class="issues-list">
          ${issues.map(i => `
            <div class="issue-item ${i.gravita}">
              <div class="issue-header">
                <span class="issue-badge ${i.gravita}">${i.gravita === 'alta' ? '🔴' : i.gravita === 'media' ? '🟡' : '🟢'} ${i.gravita.toUpperCase()}</span>
                <span class="issue-section">${i.sezione}</span>
              </div>
              <p>${i.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}


// ============================================================
// SEZIONE PERFORMANCE
// ============================================================
function renderPerformance() {
  const kpi = calcolaKPI();

  return `
    <div class="section-header"><h2>Analisi Performance</h2></div>

    <div class="kpi-row">
      <div class="kpi-card big"><span class="kpi-label">Fatturato Totale Annuo</span><span class="kpi-value">${formatEuro(kpi.fattTot)}</span></div>
      <div class="kpi-card big"><span class="kpi-label">Margine Operativo</span><span class="kpi-value ${kpi.marginePct>0?'green':'red'}">${formatEuro(kpi.margine)}</span><span class="kpi-sub">${kpi.marginePct.toFixed(1)}%</span></div>
      <div class="kpi-card big"><span class="kpi-label">Break Even Point</span><span class="kpi-value">${kpi.bepContratti} contratti</span><span class="kpi-sub">${formatEuro(kpi.bepEuro)}</span></div>
    </div>

    <div class="kpi-row" style="margin-top:15px">
      <div class="kpi-card"><span class="kpi-label">Fatturato Freader</span><span class="kpi-value">${formatEuro(kpi.fattP1)}</span></div>
      <div class="kpi-card"><span class="kpi-label">Fatturato CutAI</span><span class="kpi-value">${formatEuro(kpi.fattP2)}</span></div>
      <div class="kpi-card"><span class="kpi-label">Costi Totali</span><span class="kpi-value">${formatEuro(kpi.costiTotali)}</span></div>
      <div class="kpi-card"><span class="kpi-label">Fatt. Medio/Contratto</span><span class="kpi-value">${formatEuro(kpi.avgFattPerContratto)}</span></div>
    </div>

    <div class="kpi-row" style="margin-top:15px">
      <div class="kpi-card"><span class="kpi-label">Contratti Totali</span><span class="kpi-value">${kpi.totContratti}</span></div>
      <div class="kpi-card"><span class="kpi-label">Contratti Attivi</span><span class="kpi-value green">${kpi.attivi}</span></div>
      <div class="kpi-card"><span class="kpi-label">Contratti Scaduti</span><span class="kpi-value red">${kpi.scaduti}</span></div>
      <div class="kpi-card"><span class="kpi-label">In Scadenza (90gg)</span><span class="kpi-value orange">${kpi.inScadenza90}</span></div>
    </div>

    <div class="two-col" style="margin-top:20px">
      <div class="card highlight">
        <h3>📊 Crescita</h3>
        <div class="growth-metrics">
          <div class="growth-item">
            <span class="growth-label">MoM (Month over Month)</span>
            <span class="growth-value positive">+${kpi.momGrowth}%</span>
            <div class="growth-bar"><div class="growth-fill" style="width:${Math.min(kpi.momGrowth*10,100)}%"></div></div>
          </div>
          <div class="growth-item">
            <span class="growth-label">YoY (Year over Year)</span>
            <span class="growth-value positive">+${kpi.yoyGrowth}%</span>
            <div class="growth-bar"><div class="growth-fill" style="width:${Math.min(kpi.yoyGrowth*5,100)}%"></div></div>
          </div>
        </div>
      </div>
      <div class="card highlight">
        <h3>📋 Riepilogo KPI</h3>
        <div class="kpi-summary-list">
          <div class="kpi-summary-row"><span>Margine Lordo</span><strong>${kpi.marginePct.toFixed(1)}%</strong></div>
          <div class="kpi-summary-row"><span>Revenue per Contratto</span><strong>${formatEuro(kpi.avgFattPerContratto)}</strong></div>
          <div class="kpi-summary-row"><span>Tasso Contratti Attivi</span><strong>${(kpi.attivi/kpi.totContratti*100).toFixed(0)}%</strong></div>
          <div class="kpi-summary-row"><span>Churn Rate (scaduti)</span><strong>${(kpi.scaduti/kpi.totContratti*100).toFixed(1)}%</strong></div>
          <div class="kpi-summary-row"><span>Contratti sopra BEP</span><strong>${kpi.totContratti > kpi.bepContratti ? 'Sì ✅' : 'No ❌'}</strong></div>
          <div class="kpi-summary-row"><span>Mix Freader/CutAI</span><strong>${(kpi.fattP1/kpi.fattTot*100).toFixed(0)}% / ${(kpi.fattP2/kpi.fattTot*100).toFixed(0)}%</strong></div>
        </div>
      </div>
    </div>
  `;
}


// ============================================================
// SEZIONE TOP CLIENTS
// ============================================================
function renderTopClients() {
  const ranked = calcolaTopClients();
  const top10 = ranked.slice(0, 10);

  return `
    <div class="section-header"><h2>Top Clients</h2></div>
    <p class="section-desc">Rating basato su: canone, clausole contrattuali, durata, fiducia, scadenza e termini.</p>

    <div class="top-clients-grid">
      ${top10.map((c, i) => `
        <div class="client-card rank-${i < 3 ? 'top' : 'normal'}" onclick="openContract(${getAllContratti().findIndex(x => x.cliente === c.cliente && x.prodotto === c.prodotto)})">
          <div class="client-rank">#${i + 1}</div>
          <div class="client-info">
            <div class="client-name">${c.cliente}</div>
            <span class="badge-prod ${c.prodotto.toLowerCase()}">${c.prodotto}</span>
            <div class="client-details">
              <span>📍 ${c.sede}</span>
              <span>💰 ${formatEuro(c.canoneTrim)}/trim</span>
              <span>📅 ${c.durataMesi} mesi</span>
            </div>
          </div>
          <div class="client-rating">
            <div class="rating-circle" style="--rating:${c.rating}">
              <span>${c.rating}</span>
            </div>
            <span class="rating-label">${c.rating >= 85 ? 'Eccellente' : c.rating >= 70 ? 'Buono' : c.rating >= 55 ? 'Nella media' : 'Da migliorare'}</span>
          </div>
          <div class="client-terms">
            <div><span>Credito Uptime</span><strong class="${c.creditoUptime<=5?'green':c.creditoUptime<=7?'orange':'red'}">${c.creditoUptime}%</strong></div>
            <div><span>Tetto Crediti</span><strong class="${c.tettoCred<=10?'green':c.tettoCred<=13?'orange':'red'}">${c.tettoCred}%</strong></div>
            <div><span>Preavviso</span><strong>${c.preavvisoGG}gg</strong></div>
            <div><span>Scadenza</span><strong class="${c.giorniScadenza<=0?'red':c.giorniScadenza<=90?'orange':'green'}">${c.giorniScadenza>0?c.giorniScadenza+'gg':'Scaduto'}</strong></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  render();
});
