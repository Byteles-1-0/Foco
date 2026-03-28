/* Contract Intelligence — Frontend v2 */
const API="http://127.0.0.1:5000/api";
let section="overview",costProduct="prodotto1",selectedIdx=null,expandedMetrics={},cache={};

async function api(path,opts){
  const key=opts?null:path;
  if(key&&cache[key])return cache[key];
  try{const r=await fetch(API+path,opts);if(!r.ok)throw 0;const d=await r.json();if(key)cache[key]=d;return d;}catch{return null;}
}
const euro=n=>n==null?"—":n.toLocaleString("it-IT",{style:"currency",currency:"EUR"});
const pct=n=>n==null?"—":n.toFixed(1)+"%";
const num=n=>n==null?"—":n.toLocaleString("it-IT");
const IC={
  overview:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  costs:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2v20m5-17H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H7"/></svg>`,
  contracts:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  clients:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  ai:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2a4 4 0 014 4v1a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M6 21v-2a6 6 0 0112 0v2"/><circle cx="12" cy="12" r="10" stroke-dasharray="3 3"/></svg>`,
  arrow:`<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>`,
  ext:`<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>`,
  bell:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
};

function nav(s){section=s;selectedIdx=null;expandedMetrics={};cache={};render();}
function openDetail(i){selectedIdx=i;section="contracts";render();}
function backToContracts(){selectedIdx=null;render();}
function setCostProd(p){costProduct=p;cache={};render();}
function toggleMetric(key){expandedMetrics[key]=!expandedMetrics[key];render();}

// ── Push notifications ──
async function checkAndNotify(){
  if(!("Notification" in window))return;
  if(Notification.permission==="default")await Notification.requestPermission();
  if(Notification.permission!=="granted")return;
  const anom=await api("/anomalies");
  if(!anom)return;
  const critical=anom.filter(a=>a.gravita==="alta");
  if(critical.length>0){
    new Notification("⚠️ ContractIQ — Anomalie critiche",{
      body:`${critical.length} anomalie gravi rilevate: ${critical.map(a=>a.cliente).join(", ")}`,
      icon:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚠️</text></svg>",
      tag:"contractiq-anomalies"
    });
  }
}

// ── Render shell ──
async function render(){
  const kpi=await api("/kpi"),exp=await api("/expiring"),anom=await api("/anomalies");
  const scadBadge=exp?exp.length:0;
  const anomBadge=anom?anom.filter(a=>a.gravita==="alta").length:0;
  const navItems=[
    {key:"overview",label:"Overview",icon:IC.overview},
    {key:"costs",label:"Reparto Costi",icon:IC.costs},
    {key:"contracts",label:"Contratti",icon:IC.contracts,badge:scadBadge+anomBadge>0?scadBadge+anomBadge:null},
    {key:"topclients",label:"Top Clients",icon:IC.clients},
    {key:"advisor",label:"AI Advisor",icon:IC.ai},
  ];
  document.getElementById("app").innerHTML=`
  <div class="shell">
    <aside class="side">
      <div class="side-brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        <span>ContractIQ</span>
      </div>
      <nav class="side-nav">
        <div class="side-group"><div class="side-group-label">Dashboard</div>
          ${navItems.map(n=>`<div class="side-item ${section===n.key?'on':''}" onclick="nav('${n.key}')"><span class="ico">${n.icon}</span>${n.label}${n.badge?`<span class="badge-nav">${n.badge}</span>`:''}</div>`).join('')}
        </div>
      </nav>
      <div class="side-foot">ContractIQ v2.0 — 28/03/2026</div>
    </aside>
    <div class="mob-bar">${navItems.map(n=>`<button class="${section===n.key?'on':''}" onclick="nav('${n.key}')">${n.label}</button>`).join('')}</div>
    <main class="main">${await renderSection()}</main>
  </div>`;
}

async function renderSection(){
  switch(section){
    case "overview":return await renderOverview();
    case "costs":return await renderCosts();
    case "contracts":return selectedIdx!==null?await renderDetail():await renderContracts();
    case "topclients":return await renderTopClients();
    case "advisor":return await renderAdvisor();
    default:return "";
  }
}

// Expandable metric card with product breakdown
function mce(key,label,total,freader,cutai,pctF,pctC,momTotal,yoyTotal,momF,yoyF,momC,yoyC){
  const open=expandedMetrics[key];
  return `<div class="m-card m-card-click${open?' m-open':''}" onclick="toggleMetric('${key}')">
    <div class="m-label">${label} <span style="font-size:.58rem;color:var(--accent)">${open?'▾':'▸'}</span></div>
    <div class="m-val">${total}</div>
    <div class="m-sub"><span class="c-safe">MoM +${momTotal}%</span><span style="margin-left:8px" class="c-safe">YoY +${yoyTotal}%</span></div>
    ${open?`<div class="m-breakdown">
      <div class="m-bk-row"><span class="b b-fr">Freader</span><strong>${freader}</strong><span class="c-muted">${pctF}%</span><span class="c-safe" style="font-size:.68rem">MoM +${momF}% · YoY +${yoyF}%</span></div>
      <div class="m-bk-row"><span class="b b-cu">CutAI</span><strong>${cutai}</strong><span class="c-muted">${pctC}%</span><span class="c-safe" style="font-size:.68rem">MoM +${momC}% · YoY +${yoyC}%</span></div>
    </div>`:''}
  </div>`;
}
function mc(label,value,sub,subType){
  const cls=subType==="up"?"c-safe":subType==="down"?"c-danger":subType==="warn"?"c-warn":"c-muted";
  return `<div class="m-card"><div class="m-label">${label}</div><div class="m-val">${value}</div>${sub?`<div class="m-sub"><span class="${cls}">${sub}</span></div>`:''}</div>`;
}
function kr(l,v){return `<div class="kpi-row"><span>${l}</span><strong>${v}</strong></div>`;}

// ══════════════════════════════════════════════
// OVERVIEW (all KPIs, expandable breakdowns)
// ══════════════════════════════════════════════
async function renderOverview(){
  const k=await api("/kpi"),exp=await api("/expiring");
  if(!k)return `<div class="pg-hd"><h1>Overview</h1><p>Backend non raggiungibile. <code>python3 backend/main.py</code></p></div>`;
  return `
  <div class="pg-hd"><h1>Overview</h1><p>Portafoglio contratti — 28/03/2026</p></div>
  <div class="m-grid c3">
    ${mce("fatt","Fatturato annuo",euro(k.fatturato_totale),euro(k.fatturato_freader),euro(k.fatturato_cutai),k.fatt_pct_freader,k.fatt_pct_cutai,k.mom_growth,k.yoy_growth,k.mom_fatt_freader,k.yoy_fatt_freader,k.mom_fatt_cutai,k.yoy_fatt_cutai)}
    ${mce("marg","Margine operativo",euro(k.margine_totale)+" ("+pct(k.margine_pct)+")",euro(k.margine_freader)+" ("+pct(k.margine_pct_freader)+")",euro(k.margine_cutai)+" ("+pct(k.margine_pct_cutai)+")",Math.round(k.margine_freader/(k.margine_totale||1)*100),Math.round(k.margine_cutai/(k.margine_totale||1)*100),k.mom_margine,k.yoy_margine,2.1,14.8,3.2,19.1)}
    ${mce("contr","Contratti attivi",num(k.attivi)+" / "+num(k.totale_contratti),num(k.attivi_freader)+" / "+num(k.contratti_freader),num(k.attivi_cutai)+" / "+num(k.contratti_cutai),Math.round(k.contratti_freader/k.totale_contratti*100),Math.round(k.contratti_cutai/k.totale_contratti*100),k.mom_contratti,k.yoy_contratti,1.5,10.0,2.2,14.5)}
  </div>
  <div class="m-grid c4">
    ${mc("BEP",k.bep_contratti+" contratti",euro(k.bep_euro))}
    ${mc("Revenue / contratto",euro(k.avg_fatturato))}
    ${mc("In scadenza 90gg",num(k.in_scadenza_90),null,k.in_scadenza_90>0?"warn":"up")}
    ${mc("Churn rate",pct(k.scaduti/k.totale_contratti*100),k.scaduti+" scaduti",k.scaduti>0?"down":null)}
  </div>
  <div class="g2">
    <div class="card"><div class="card-hd"><h3>Prossime scadenze</h3></div><div class="card-bd">
      <div class="exp-list">${exp&&exp.length?exp.map(c=>expRow(c)).join(''):'<span class="c-muted">Nessuna</span>'}</div>
    </div></div>
    <div class="card"><div class="card-hd"><h3>Crescita</h3></div><div class="card-bd">
      <div class="grow-item"><div class="grow-top"><span class="grow-label">MoM</span><span class="grow-val up">+${k.mom_growth}%</span></div><div class="grow-bar"><div class="grow-fill" style="width:${Math.min(k.mom_growth*10,100)}%"></div></div></div>
      <div class="grow-item"><div class="grow-top"><span class="grow-label">YoY</span><span class="grow-val up">+${k.yoy_growth}%</span></div><div class="grow-bar"><div class="grow-fill" style="width:${Math.min(k.yoy_growth*5,100)}%"></div></div></div>
    </div></div>
  </div>`;
}
function expRow(c){
  const color=c.giorni_scadenza<=30?"c-danger":c.giorni_scadenza<=60?"c-warn":"c-safe";
  const all=cache["/contracts"];
  const idx=all?all.findIndex(x=>x.cliente===c.cliente&&x.prodotto===c.prodotto):-1;
  return `<div class="exp-row" onclick="${idx>=0?`openDetail(${idx})`:''}"><div><div class="exp-days ${color}">${c.giorni_scadenza}</div><div class="exp-days-label">giorni</div></div><div><div class="exp-name">${c.cliente}</div><div class="exp-meta"><span>${c.sede}</span><span>${euro(c.canone_trim)}/trim</span></div></div><div class="exp-badge"><span class="b ${c.prodotto==='Freader'?'b-fr':'b-cu'}">${c.prodotto}</span></div></div>`;
}

// ══════════════════════════════════════════════
// COSTS
// ══════════════════════════════════════════════
async function renderCosts(){
  const d=await api("/costs/"+costProduct);
  if(!d)return `<div class="pg-hd"><h1>Reparto Costi</h1><p>Backend non raggiungibile.</p></div>`;
  return `
  <div class="pg-hd"><h1>Reparto Costi</h1>
    <div class="seg"><button class="${costProduct==='prodotto1'?'on':''}" onclick="setCostProd('prodotto1')">Freader</button><button class="${costProduct==='prodotto2'?'on':''}" onclick="setCostProd('prodotto2')">CutAI</button><button class="${costProduct==='totale'?'on':''}" onclick="setCostProd('totale')">Totale</button></div>
  </div>
  <div class="m-grid c4">
    ${mc("Costi fissi",euro(d.tot_fissi))}${mc("Costi variabili",euro(d.tot_variabili))}${mc("Costi diretti",euro(d.tot_diretti))}${mc("Costi indiretti",euro(d.tot_indiretti))}
  </div>
  ${costProduct==='totale'?`<div class="m-grid c2">${mc("Costo Freader",euro(d.costo_prodotto_freader))}${mc("Costo CutAI",euro(d.costo_prodotto_cutai))}</div>`:''}
  ${costProduct!=='totale'&&d.fatturato_prodotto!=null?`<div class="m-grid c3">${mc("Costo prodotto",euro(d.costo_per_prodotto))}${mc("Fatturato",euro(d.fatturato_prodotto))}${mc("Margine",euro(d.margine_prodotto),null,d.margine_prodotto>0?"up":"down")}</div>`:''}
  <div class="g2">
    <div class="card"><div class="card-hd"><h3>Costi fissi</h3></div><div class="card-bd"><div class="t-wrap"><table><thead><tr><th>Voce</th><th>Importo</th><th>Tipo</th></tr></thead><tbody>${d.fissi.map(x=>`<tr><td>${x.voce}</td><td class="mono">${euro(x.importo)}</td><td><span class="b ${x.tipo==='diretto'?'b-dir':'b-ind'}">${x.tipo}</span></td></tr>`).join('')}</tbody></table></div></div></div>
    <div class="card"><div class="card-hd"><h3>Costi variabili</h3></div><div class="card-bd"><div class="t-wrap"><table><thead><tr><th>Voce</th><th>Costo unit.</th><th>Tipo</th></tr></thead><tbody>${d.variabili.map(x=>`<tr><td>${x.voce}</td><td class="mono">${x.importo} ${x.unita||''}</td><td><span class="b ${x.tipo==='diretto'?'b-dir':'b-ind'}">${x.tipo}</span></td></tr>`).join('')}</tbody></table></div></div></div>
  </div>
  <div class="card mt-14"><div class="card-hd"><h3>Allocazione Tradizionale</h3></div><div class="card-bd">
    <p style="font-size:.82rem;color:var(--ink-2);margin-bottom:8px">Costi indiretti su ${d.n_contratti} contratti</p>
    <div class="cost-res"><div class="cost-line"><span>Costo totale</span><strong>${euro(d.costo_totale)}</strong></div><div class="cost-line"><span>Costo unit. / contratto</span><strong>${euro(d.costo_unit_trad)}</strong></div></div>
  </div></div>`;
}

// ══════════════════════════════════════════════
// CONTRACTS + ANOMALIES + MAP
// ══════════════════════════════════════════════
async function renderContracts(){
  const all=await api("/contracts"),exp=await api("/expiring"),mapData=await api("/map-data"),anom=await api("/anomalies");
  if(!all)return `<div class="pg-hd"><h1>Contratti</h1><p>Backend non raggiungibile.</p></div>`;
  const attivi=all.filter(c=>c.giorni_scadenza>0).length,scaduti=all.filter(c=>c.giorni_scadenza<=0).length,inScad=all.filter(c=>c.giorni_scadenza>0&&c.giorni_scadenza<=90).length;
  const anomAlte=anom?anom.filter(a=>a.gravita==="alta"):[];
  return `
  <div class="pg-hd"><h1>Contratti</h1><p>${all.length} contratti</p></div>
  <div class="m-grid c4">${mc("Totale",num(all.length))}${mc("Attivi",num(attivi),null,"up")}${mc("Scaduti",num(scaduti),null,scaduti>0?"down":null)}${mc("Anomalie",num(anom?anom.length:0),anomAlte.length+" critiche",anomAlte.length>0?"down":null)}</div>
  ${anom&&anom.length?`<div class="card"><div class="card-hd"><h3>${IC.bell} Anomalie pagamenti</h3><span class="b b-err">${anomAlte.length} critiche</span></div><div class="card-bd"><div class="i-list">${anom.map(a=>`<div class="i-row ${a.gravita}"><div class="i-sev"></div><div class="i-body"><div class="i-head"><span class="b ${a.gravita==='alta'?'b-err':a.gravita==='media'?'b-wrn':'b-ok'}">${a.gravita.toUpperCase()}</span><span class="i-section">${a.tipo.replace(/_/g,' ')}</span><span class="c-muted" style="margin-left:auto;font-size:.72rem">${a.data_evento}</span></div><p class="i-desc"><strong>${a.cliente}</strong> (${a.prodotto}) — ${a.desc}</p></div></div>`).join('')}</div></div></div>`:''}
  <div class="g2">
    <div>${exp&&exp.length?`<div class="card"><div class="card-hd"><h3>Prossime scadenze</h3></div><div class="card-bd"><div class="exp-list">${exp.map(c=>expRow(c)).join('')}</div></div></div>`:''}</div>
    <div class="card"><div class="card-hd"><h3>Distribuzione geografica</h3></div><div class="card-bd">${renderMap(mapData)}</div></div>
  </div>
  <div class="card mt-14"><div class="card-hd"><h3>Tutti i contratti</h3></div><div class="t-wrap"><table>
    <thead><tr><th>Cliente</th><th>Prodotto</th><th>Sede</th><th>Canone</th><th>Durata</th><th>Firma</th><th>Scadenza</th><th>Stato</th><th></th></tr></thead>
    <tbody>${all.map((c,i)=>{const st=c.giorni_scadenza>90?"active":c.giorni_scadenza>0?"expiring":"expired";const sl=st==="active"?"Attivo":st==="expiring"?"In scadenza":"Scaduto";const sb=st==="active"?"b-ok":st==="expiring"?"b-wrn":"b-err";const hasAnom=anom&&anom.find(a=>a.cliente===c.cliente);return `<tr onclick="openDetail(${i})"${hasAnom?' style="background:var(--danger-bg)"':''}><td style="font-weight:600">${c.cliente}${hasAnom?' ⚠️':''}</td><td><span class="b ${c.prodotto==='Freader'?'b-fr':'b-cu'}">${c.prodotto}</span></td><td>${c.sede}</td><td class="mono">${euro(c.canone_trim)}</td><td class="mono">${c.durata_mesi}m</td><td class="mono">${c.data_firma}</td><td class="mono">${c.scadenza}</td><td><span class="b ${sb}">${sl}</span></td><td style="color:var(--ink-3)">${IC.ext}</td></tr>`;}).join('')}</tbody>
  </table></div></div>`;
}
function renderMap(data){
  if(!data||!data.length)return '<span class="c-muted">Nessun dato</span>';
  const W=300,H=340;
  function proj(lat,lng){return [(lng-6.5)/(18.5-6.5)*W,(1-(lat-36)/(47-36))*H];}
  const mx=Math.max(...data.map(d=>d.count));
  const dots=data.map(d=>{const[x,y]=proj(d.lat,d.lng);const r=Math.max(6,Math.min(18,d.count/mx*18));return `<g class="map-dot"><circle cx="${x}" cy="${y}" r="${r}" fill="var(--accent)" opacity=".18"/><circle cx="${x}" cy="${y}" r="${Math.max(3,r*.5)}" fill="var(--accent)" opacity=".7"/><title>${d.citta}: ${d.count}</title></g><text x="${x}" y="${y-r-3}" text-anchor="middle" fill="var(--ink-2)" font-size="9" font-weight="600">${d.citta}</text>`;}).join('');
  const outline=`<path d="M140 20C155 15,175 18,185 30C195 42,200 55,195 70C190 85,200 95,210 105C220 115,235 120,245 135C255 150,260 165,255 180C250 195,240 205,235 220C230 235,225 245,215 255C205 265,195 270,185 280C175 290,170 300,160 310C150 320,140 325,130 320C120 315,115 305,120 295C125 285,130 275,125 265C120 255,110 250,105 240C100 230,95 220,90 210C85 200,80 190,85 180C90 170,95 160,100 150C105 140,100 130,95 120C90 110,85 100,90 90C95 80,100 70,110 60C120 50,125 35,140 20Z" fill="none" stroke="var(--border)" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-height:280px">${outline}${dots}</svg><div class="map-legend">${data.sort((a,b)=>b.count-a.count).slice(0,6).map(d=>`<span class="map-leg-item"><span class="map-leg-dot"></span>${d.citta} <strong>${d.count}</strong></span>`).join('')}</div>`;
}

// ══════════════════════════════════════════════
// CONTRACT DETAIL (editable)
// ══════════════════════════════════════════════
async function renderDetail(){
  const d=await api("/contracts/"+selectedIdx);
  if(!d)return `<div class="pg-hd"><button class="btn-back" onclick="backToContracts()">${IC.arrow} Indietro</button></div><p>Errore.</p>`;
  const c=d.contract,issues=d.issues;
  const alta=issues.filter(i=>i.gravita==="alta").length,media=issues.filter(i=>i.gravita==="media").length,bassa=issues.filter(i=>i.gravita==="bassa").length;
  const fields=[{key:"sede",label:"Sede",type:"text"},{key:"canone_trim",label:"Canone trim.",type:"number"},{key:"durata_mesi",label:"Durata (mesi)",type:"number"},{key:"preavviso_gg",label:"Preavviso (gg)",type:"number"},{key:"credito_uptime",label:"Credito uptime %",type:"number"},{key:"credito_ticketing",label:"Credito ticketing %",type:"number"},{key:"tetto_cred",label:"Tetto crediti %",type:"number"}];
  if(c.prezzo_f1!=null)fields.push({key:"prezzo_f1",label:"Fascia 1",type:"number"},{key:"prezzo_f2",label:"Fascia 2",type:"number"},{key:"prezzo_f3",label:"Fascia 3",type:"number"});
  if(c.utenti_inclusi!=null)fields.push({key:"utenti_inclusi",label:"Utenti inclusi",type:"number"},{key:"fee_extra",label:"Fee extra €",type:"number"});
  return `
  <div class="pg-hd"><button class="btn-back" onclick="backToContracts()">${IC.arrow} Contratti</button><h1>${c.cliente}</h1><span class="b ${c.prodotto==='Freader'?'b-fr':'b-cu'}">${c.prodotto}</span></div>
  <div class="m-grid c4">${mc("Canone trim.",euro(c.canone_trim))}${mc("Fatt. annuo",euro(c.fatturato_annuo))}${mc("Durata",c.durata_mesi+" mesi")}${mc("Scadenza",c.giorni_scadenza>0?c.giorni_scadenza+" gg":"SCADUTO",null,c.giorni_scadenza<=0?"down":c.giorni_scadenza<=90?"warn":"up")}</div>
  <div class="g2">
    <div class="card"><div class="card-hd"><h3>Modifica contratto</h3></div><div class="card-bd">
      <form id="edit-form" onsubmit="saveContract(event,${selectedIdx})">
        <div class="edit-grid">
          <div class="d-item"><div class="d-label">Cliente</div><div class="d-val text">${c.cliente}</div></div>
          <div class="d-item"><div class="d-label">Data firma</div><div class="d-val">${c.data_firma}</div></div>
          <div class="d-item"><div class="d-label">Scadenza</div><div class="d-val">${c.scadenza}</div></div>
          ${c.profilo?`<div class="d-item"><div class="d-label">Profilo</div><div class="d-val text">${c.profilo}</div></div>`:''}
          ${fields.map(f=>`<div class="edit-field"><label>${f.label}</label><input type="${f.type}" name="${f.key}" value="${c[f.key]}" ${f.type==='number'?'step="any"':''}></div>`).join('')}
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;align-items:center"><button type="submit" class="btn-save">Salva</button><span id="save-msg" style="font-size:.78rem;color:var(--safe);display:none">Salvato ✓</span></div>
      </form>
    </div></div>
    <div class="card"><div class="card-hd"><h3>Criticità</h3><div style="display:flex;gap:6px">${alta?`<span class="b b-err">${alta} Alta</span>`:''}${media?`<span class="b b-wrn">${media} Media</span>`:''}${bassa?`<span class="b b-ok">${bassa} Bassa</span>`:''}</div></div><div class="card-bd">
      <div class="i-list">${issues.map(i=>`<div class="i-row ${i.gravita}"><div class="i-sev"></div><div class="i-body"><div class="i-head"><span class="b ${i.gravita==='alta'?'b-err':i.gravita==='media'?'b-wrn':'b-ok'}">${i.gravita.toUpperCase()}</span><span class="i-section">${i.sezione}</span></div><p class="i-desc">${i.desc}</p></div></div>`).join('')}</div>
    </div></div>
  </div>`;
}
async function saveContract(e,idx){
  e.preventDefault();const fd=new FormData(document.getElementById("edit-form"));const body={};for(const[k,v]of fd.entries())body[k]=v;
  cache={};const res=await api("/contracts/"+idx,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(res){const msg=document.getElementById("save-msg");if(msg){msg.style.display="inline";setTimeout(()=>msg.style.display="none",2000);}const main=document.querySelector(".main");if(main)main.innerHTML=await renderDetail();}
}

// ══════════════════════════════════════════════
// TOP CLIENTS
// ══════════════════════════════════════════════
async function renderTopClients(){
  const ranked=await api("/top-clients");
  if(!ranked)return `<div class="pg-hd"><h1>Top Clients</h1><p>Backend non raggiungibile.</p></div>`;
  return `
  <div class="pg-hd"><h1>Top Clients</h1><p>Rating: canone, clausole, durata, fiducia, termini</p></div>
  <div class="cl-list">${ranked.map((c,i)=>{
    const sc=c.rating>=85?"c-safe":c.rating>=70?"c-warn":"c-danger";
    const sl=c.rating>=85?"Eccellente":c.rating>=70?"Buono":c.rating>=55?"Nella media":"Da migliorare";
    return `<div class="cl-row" onclick="openDetail(${c.index})">
      <div class="cl-rank">${i+1}</div>
      <div><div class="cl-name">${c.cliente} <span class="b ${c.prodotto==='Freader'?'b-fr':'b-cu'}" style="margin-left:6px">${c.prodotto}</span></div><div class="cl-sub">${c.sede} · ${euro(c.canone_trim)}/trim · ${c.durata_mesi}m</div></div>
      <div class="cl-score"><div class="sc-num ${sc}">${c.rating}</div><div class="sc-label">${sl}</div></div>
      <div class="cl-terms">
        <div class="ct-item"><div class="ct-label">Uptime</div><div class="ct-val ${c.credito_uptime<=5?'c-safe':c.credito_uptime<=7?'c-warn':'c-danger'}">${c.credito_uptime}%</div></div>
        <div class="ct-item"><div class="ct-label">Tetto</div><div class="ct-val ${c.tetto_cred<=10?'c-safe':c.tetto_cred<=13?'c-warn':'c-danger'}">${c.tetto_cred}%</div></div>
        <div class="ct-item"><div class="ct-label">Preavviso</div><div class="ct-val">${c.preavviso_gg}gg</div></div>
        <div class="ct-item"><div class="ct-label">Scadenza</div><div class="ct-val ${c.giorni_scadenza<=0?'c-danger':c.giorni_scadenza<=90?'c-warn':'c-safe'}">${c.giorni_scadenza>0?c.giorni_scadenza+'gg':'Scaduto'}</div></div>
      </div>
    </div>`;}).join('')}</div>`;
}

// ══════════════════════════════════════════════
// AI ADVISOR
// ══════════════════════════════════════════════
async function renderAdvisor(){
  const advice=await api("/ai-advice");
  if(!advice)return `<div class="pg-hd"><h1>AI Advisor</h1><p>Backend non raggiungibile.</p></div>`;
  const priColors={alta:"b-err",media:"b-wrn",bassa:"b-ok"};
  const catIcons={Diversificazione:"📊",Retention:"🔄","Credit Risk":"💳",Pricing:"💰",Pipeline:"📋",Crescita:"📈",Legal:"⚖️"};
  return `
  <div class="pg-hd"><h1>AI Advisor</h1><p>Consigli basati sull'analisi del portafoglio</p></div>
  <div class="advice-list">${advice.map(a=>`
    <div class="advice-card">
      <div class="advice-top">
        <span class="advice-cat">${catIcons[a.categoria]||'💡'} ${a.categoria}</span>
        <span class="b ${priColors[a.priorita]}">${a.priorita.toUpperCase()}</span>
      </div>
      <h4 class="advice-title">${a.titolo}</h4>
      <p class="advice-desc">${a.desc}</p>
      <div class="advice-action">
        <span class="advice-action-label">Azione consigliata</span>
        <p>${a.azione}</p>
      </div>
    </div>
  `).join('')}</div>`;
}

// ── INIT ──
document.addEventListener("DOMContentLoaded",()=>{
  api("/contracts").then(()=>render());
  checkAndNotify();
});
