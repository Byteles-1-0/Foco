/* Contract Intelligence — Frontend v2 */
const API="http://127.0.0.1:5000/api";
let section="overview",costProduct="prodotto1",selectedIdx=null,expandedMetrics={},cache={},sidebarOpen=true,contractFilter="all",searchQuery="",costDetailView=null;

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

function nav(s){
  if(section===s&&s==="contracts"&&selectedIdx===null){
    section="overview";
  }else{
    section=s;
    selectedIdx=null;
    expandedMetrics={};
    cache={};
  }
  render();
}
function toggleSidebar(){sidebarOpen=!sidebarOpen;render();}
function openDetail(i){selectedIdx=i;section="contracts";render();}
function backToContracts(){selectedIdx=null;render();}
function setCostProd(p){costProduct=p;cache={};costDetailView=null;render();}
function toggleMetric(key){expandedMetrics[key]=!expandedMetrics[key];render();}
function showExpiring(){section="contracts";contractFilter="expiring";render();}
function showContracts(filter){section="contracts";contractFilter=filter;searchQuery="";render();}
function setSearch(q){searchQuery=q;render();}
function showCostDetail(type){costDetailView=type;render();}
function backToCosts(){costDetailView=null;render();}
function openContractsModal(filter){
  api("/contracts").then(all=>{
    if(!all)return;
    let filtered=all;
    if(filter==="active")filtered=all.filter(c=>c.giorni_scadenza>0);
    else if(filter==="expired")filtered=all.filter(c=>c.giorni_scadenza<=0);
    else if(filter==="anomalies"){
      api("/anomalies").then(anom=>{
        if(anom)filtered=all.filter(c=>anom.find(a=>a.cliente===c.cliente));
        showContractsModalContent(filtered,filter);
      });
      return;
    }
    showContractsModalContent(filtered,filter);
  });
}
function showContractsModalContent(contracts,filter){
  const modal=document.getElementById("cost-modal");
  const content=document.getElementById("modal-content");
  const titles={all:"Tutti i contratti",active:"Contratti attivi",expired:"Contratti scaduti",anomalies:"Contratti con anomalie"};
  const html=`<h3>${titles[filter]} (${contracts.length})</h3>
    <div class="t-wrap"><table>
      <thead><tr><th>Cliente</th><th>Prodotto</th><th>Sede</th><th>Canone</th><th>Durata</th><th>Scadenza</th><th>Stato</th></tr></thead>
      <tbody>${contracts.map(c=>{
        const st=c.giorni_scadenza>90?"active":c.giorni_scadenza>0?"expiring":"expired";
        const sl=st==="active"?"Attivo":st==="expiring"?"In scadenza":"Scaduto";
        const sb=st==="active"?"b-ok":st==="expiring"?"b-wrn":"b-err";
        return `<tr><td style="font-weight:600">${c.cliente}</td><td><span class="b ${c.prodotto==="Freader"?"b-fr":"b-cu"}">${c.prodotto}</span></td><td>${c.sede}</td><td class="mono">${euro(c.canone_trim)}</td><td class="mono">${c.durata_mesi}m</td><td class="mono">${c.scadenza}</td><td><span class="b ${sb}">${sl}</span></td></tr>`;
      }).join("")}</tbody>
    </table></div>`;
  content.innerHTML=html;
  modal.style.display="flex";
}
function openExpiringModal(){
  api("/expiring").then(exp=>{
    if(!exp||!exp.length){
      alert("Nessun contratto in scadenza nei prossimi 90 giorni");
      return;
    }
    const modal=document.getElementById("cost-modal");
    const content=document.getElementById("modal-content");
    const html=`<h3>⏰ Prossime Scadenze (${exp.length})</h3>
      <div class="expiring-modal-list">
        ${exp.map(c=>{
          const color=c.giorni_scadenza<=30?"danger":c.giorni_scadenza<=60?"warning":"safe";
          const all=cache["/contracts"];
          const idx=all?all.findIndex(x=>x.cliente===c.cliente&&x.prodotto===c.prodotto):-1;
          return `<div class="expiring-modal-item ${color}" onclick="closeCostModal();${idx>=0?`openDetail(${idx})`:''}">
            <div class="expiring-modal-days">
              <div class="expiring-modal-days-num">${c.giorni_scadenza}</div>
              <div class="expiring-modal-days-label">giorni</div>
            </div>
            <div class="expiring-modal-info">
              <div class="expiring-modal-client">${c.cliente}</div>
              <div class="expiring-modal-meta">
                <span class="b ${c.prodotto==='Freader'?'b-fr':'b-cu'}">${c.prodotto}</span>
                <span>📍 ${c.sede}</span>
                <span>${euro(c.canone_trim)}/trim</span>
              </div>
              <div class="expiring-modal-date">Scadenza: ${c.scadenza}</div>
            </div>
            <div class="expiring-modal-arrow">→</div>
          </div>`;
        }).join('')}
      </div>`;
    content.innerHTML=html;
    modal.style.display="flex";
  });
}
function openCostModal(type,data){
  const modal=document.getElementById("cost-modal");
  const content=document.getElementById("modal-content");
  let html="";
  if(type==="fissi"){
    html=`<h3>Costi fissi — ${euro(data.tot_fissi)}</h3><div class="t-wrap"><table><thead><tr><th>Voce</th><th>Importo</th><th>Tipo</th></tr></thead><tbody>${data.fissi.map(x=>`<tr><td>${x.voce}</td><td class="mono">${euro(x.importo)}</td><td><span class="b ${x.tipo==="diretto"?"b-dir":"b-ind"}">${x.tipo}</span></td></tr>`).join("")}</tbody></table></div>`;
  }else if(type==="variabili"){
    html=`<h3>Costi variabili — ${euro(data.tot_variabili)}</h3><div class="t-wrap"><table><thead><tr><th>Voce</th><th>Costo unit.</th><th>Tipo</th></tr></thead><tbody>${data.variabili.map(x=>`<tr><td>${x.voce}</td><td class="mono">${x.importo} ${x.unita||""}</td><td><span class="b ${x.tipo==="diretto"?"b-dir":"b-ind"}">${x.tipo}</span></td></tr>`).join("")}</tbody></table></div>`;
  }else if(type==="diretti"){
    const items=[...data.fissi,...data.variabili].filter(x=>x.tipo==="diretto");
    html=`<h3>Costi diretti — ${euro(data.tot_diretti)}</h3><div class="t-wrap"><table><thead><tr><th>Voce</th><th>Importo/Costo</th><th>Categoria</th></tr></thead><tbody>${items.map(x=>`<tr><td>${x.voce}</td><td class="mono">${x.importo} ${x.unita||""}</td><td>${data.fissi.includes(x)?"Fisso":"Variabile"}</td></tr>`).join("")}</tbody></table></div>`;
  }else if(type==="indiretti"){
    const items=[...data.fissi,...data.variabili].filter(x=>x.tipo==="indiretto");
    html=`<h3>Costi indiretti — ${euro(data.tot_indiretti)}</h3><div class="t-wrap"><table><thead><tr><th>Voce</th><th>Importo/Costo</th><th>Categoria</th></tr></thead><tbody>${items.map(x=>`<tr><td>${x.voce}</td><td class="mono">${x.importo} ${x.unita||""}</td><td>${data.fissi.includes(x)?"Fisso":"Variabile"}</td></tr>`).join("")}</tbody></table></div>`;
  }
  content.innerHTML=html;
  modal.style.display="flex";
}
function closeCostModal(){
  document.getElementById("cost-modal").style.display="none";
}

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
    {key:"overview",label:"Performance",icon:IC.overview},
    {key:"risks",label:"Risk Radar",icon:IC.bell,badge:null},
    {key:"costs",label:"Reparto Costi",icon:IC.costs},
    {key:"contracts",label:"Contratti",icon:IC.contracts,badge:scadBadge+anomBadge>0?scadBadge+anomBadge:null},
    {key:"topclients",label:"Top Clients",icon:IC.clients},
    {key:"advisor",label:"AI Advisor",icon:IC.ai},
  ];
  document.getElementById("app").innerHTML=`
  <div class="shell">
    <aside class="side${sidebarOpen?'':' side-closed'}">
      <div class="side-brand" onclick="toggleSidebar()" style="cursor:pointer">
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
  </div>
  <div id="cost-modal" class="modal" onclick="if(event.target===this)closeCostModal()">
    <div class="modal-box">
      <button class="modal-close" onclick="closeCostModal()">✕</button>
      <div id="modal-content"></div>
    </div>
  </div>`;
}

async function renderSection(){
  switch(section){
    case "overview":return await renderOverview();
    case "risks":return await renderRiskRadar();
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
function mc(label,value,sub,subType,onClick){
  const cls=subType==="up"?"c-safe":subType==="down"?"c-danger":subType==="warn"?"c-warn":"c-muted";
  const click=onClick?` onclick="${onClick}" style="cursor:pointer"`:"";
  return `<div class="m-card"${click}><div class="m-label">${label}</div><div class="m-val">${value}</div>${sub?`<div class="m-sub"><span class="${cls}">${sub}</span></div>`:""}</div>`;
}
function kr(l,v){return `<div class="kpi-row"><span>${l}</span><strong>${v}</strong></div>`;}

function renderTrendChart(k){
  // Mock 12-month trend data
  const months=["Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic","Gen","Feb","Mar"];
  const base=k.fatturato_totale/12;
  const data=months.map((_,i)=>{
    const variance=(Math.sin(i*0.5)+1)*0.15;
    return Math.round(base*(0.85+variance+i*0.015));
  });
  const max=Math.max(...data);
  const W=600,H=180,pad=40,gW=W-pad*2,gH=H-50;
  const xStep=gW/(data.length-1);
  const points=data.map((v,i)=>[pad+i*xStep,H-30-(v/max)*gH]).map(p=>`${p[0]},${p[1]}`).join(' ');
  const area=`${pad},${H-30} `+points+` ${pad+gW},${H-30}`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:180px">
    <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".3"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    <polyline points="${area}" fill="url(#gr)"/>
    <polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
    ${data.map((v,i)=>`<circle cx="${pad+i*xStep}" cy="${H-30-(v/max)*gH}" r="3.5" fill="var(--accent)"/>`).join('')}
    ${months.map((m,i)=>`<text x="${pad+i*xStep}" y="${H-10}" text-anchor="middle" fill="var(--ink-3)" font-size="10">${m}</text>`).join('')}
    <text x="${W/2}" y="20" text-anchor="middle" fill="var(--ink-2)" font-size="11" font-weight="600">Fatturato mensile (ultimi 12 mesi)</text>
  </svg>`;
}

function renderAdvancedTrendChart(k){
  const months=["Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic","Gen","Feb","Mar"];
  const base=k.fatturato_totale/12;
  const data=months.map((_,i)=>{
    const variance=(Math.sin(i*0.5)+1)*0.15;
    return Math.round(base*(0.85+variance+i*0.015));
  });
  const max=Math.max(...data);
  const min=Math.min(...data);
  const W=1000,H=320,padL=60,padR=40,padT=60,padB=50;
  const gW=W-padL-padR,gH=H-padT-padB;
  const xStep=gW/(data.length-1);
  
  // Grid lines
  const gridLines=[];
  for(let i=0;i<=5;i++){
    const y=padT+gH*(i/5);
    const val=Math.round(max-(max-min)*(i/5));
    gridLines.push(`<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4 4"/>`);
    gridLines.push(`<text x="${padL-10}" y="${y+4}" text-anchor="end" fill="var(--ink-3)" font-size="11">${euro(val)}</text>`);
  }
  
  // Data points and lines
  const points=data.map((v,i)=>[padL+i*xStep,padT+gH-(v-min)/(max-min)*gH]);
  const pathData=points.map((p,i)=>i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`).join(' ');
  const areaData=`M${padL},${H-padB} L${points.map(p=>`${p[0]},${p[1]}`).join(' L')} L${W-padR},${H-padB} Z`;
  
  // Bars
  const bars=data.map((v,i)=>{
    const x=padL+i*xStep;
    const barH=(v-min)/(max-min)*gH;
    const y=padT+gH-barH;
    return `<rect x="${x-8}" y="${y}" width="16" height="${barH}" fill="var(--accent)" opacity="0.15" rx="4"/>`;
  }).join('');
  
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:320px">
    <defs>
      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${gridLines.join('')}
    ${bars}
    <path d="${areaData}" fill="url(#grad1)"/>
    <path d="${pathData}" fill="none" stroke="var(--accent)" stroke-width="3" filter="url(#glow)"/>
    ${points.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="var(--surface)" stroke="var(--accent)" stroke-width="3"/><circle cx="${p[0]}" cy="${p[1]}" r="2" fill="var(--accent)"/>`).join('')}
    ${months.map((m,i)=>`<text x="${padL+i*xStep}" y="${H-padB+20}" text-anchor="middle" fill="var(--ink-2)" font-size="12" font-weight="500">${m}</text>`).join('')}
    <text x="${W/2}" y="30" text-anchor="middle" fill="var(--ink)" font-size="14" font-weight="600" letter-spacing="0.5">ANDAMENTO FATTURATO MENSILE</text>
    <text x="${W/2}" y="48" text-anchor="middle" fill="var(--ink-3)" font-size="11">Ultimi 12 mesi • Trend crescente +${k.yoy_growth}% YoY</text>
  </svg>`;
}

// ══════════════════════════════════════════════
// OVERVIEW (all KPIs, expandable breakdowns)
// ══════════════════════════════════════════════
async function renderOverview(){
  const k=await api("/kpi"),exp=await api("/expiring");
  if(!k)return `<div class="pg-hd"><h1>Performance</h1><p>Backend non raggiungibile. <code>python3 backend/main.py</code></p></div>`;
  
  // Calculate diversification risk for CTA
  const freaderPct=Math.round(k.fatturato_freader/k.fatturato_totale*100);
  const riskLevel=freaderPct>65?"ALTO":freaderPct>55?"MEDIO":"BASSO";
  const showCTA=riskLevel!=="BASSO";
  
  return `
  <div class="pg-hd"><h1>Performance</h1><p>Portafoglio contratti — 28/03/2026</p></div>
  
  ${showCTA?`<div class="ai-cta-banner" onclick="nav('advisor')">
    <div class="ai-cta-icon">🤖</div>
    <div class="ai-cta-content">
      <div class="ai-cta-title">⚠️ Rischio Concentrazione Rilevato</div>
      <div class="ai-cta-desc">Hai una concentrazione del ${freaderPct}% su Freader. L'AI Decision Copilot ha analizzato il tuo portafoglio e suggerisce azioni immediate.</div>
    </div>
    <div class="ai-cta-action">
      <span class="ai-cta-btn">Analizza ora →</span>
    </div>
  </div>`:''}
  
  <div class="m-grid c3">
    ${mce("fatt","Fatturato annuo",euro(k.fatturato_totale),euro(k.fatturato_freader),euro(k.fatturato_cutai),k.fatt_pct_freader,k.fatt_pct_cutai,k.mom_growth,k.yoy_growth,k.mom_fatt_freader,k.yoy_fatt_freader,k.mom_fatt_cutai,k.yoy_fatt_cutai)}
    ${mce("marg","Margine operativo",euro(k.margine_totale)+" ("+pct(k.margine_pct)+")",euro(k.margine_freader)+" ("+pct(k.margine_pct_freader)+")",euro(k.margine_cutai)+" ("+pct(k.margine_pct_cutai)+")",Math.round(k.margine_freader/(k.margine_totale||1)*100),Math.round(k.margine_cutai/(k.margine_totale||1)*100),k.mom_margine,k.yoy_margine,2.1,14.8,3.2,19.1)}
    ${mce("contr","Contratti attivi",num(k.attivi)+" / "+num(k.totale_contratti),num(k.attivi_freader)+" / "+num(k.contratti_freader),num(k.attivi_cutai)+" / "+num(k.contratti_cutai),Math.round(k.contratti_freader/k.totale_contratti*100),Math.round(k.contratti_cutai/k.totale_contratti*100),k.mom_contratti,k.yoy_contratti,1.5,10.0,2.2,14.5)}
  </div>
  <div class="m-grid c4">
    ${mc("BEP",k.bep_contratti+" contratti",euro(k.bep_euro))}
    ${mc("Revenue / contratto",euro(k.avg_fatturato))}
    ${mc("In scadenza 90gg",num(k.in_scadenza_90),exp&&exp.length?exp.map(c=>`${c.cliente} (${c.giorni_scadenza}gg)`).join(', '):null,k.in_scadenza_90>0?"warn":"up","showContracts('expiring')")}
    ${mc("Churn rate",pct(k.scaduti/k.totale_contratti*100),k.scaduti+" scaduti",k.scaduti>0?"down":null,"showContracts('expired')")}
  </div>
  <div class="card"><div class="card-hd"><h3>Trend fatturato</h3></div><div class="card-bd">${renderAdvancedTrendChart(k)}</div></div>`;
}

// ══════════════════════════════════════════════
// RISK RADAR - Real-time contract risk analysis
// ══════════════════════════════════════════════
// RISK RADAR - Enhanced with filters and heatmap
// ══════════════════════════════════════════════
let riskFilter="all"; // Global filter state
function setRiskFilter(f){riskFilter=f;render();}

async function renderRiskRadar(){
  const all=await api("/contracts"),anom=await api("/anomalies"),k=await api("/kpi");
  if(!all)return `<div class="pg-hd"><h1>🚨 Risk Radar</h1><p>Backend non raggiungibile.</p></div>`;
  
  // Calculate risks
  const risks=[];
  all.forEach((c,idx)=>{
    const margine=(c.canone_trim*4)/(k.avg_fatturato||1);
    const hasAnom=anom&&anom.find(a=>a.cliente===c.cliente);
    
    // Risk 1: Low profitability
    if(margine<0.7){
      risks.push({idx,cliente:c.cliente,prodotto:c.prodotto,tipo:"profitability",gravita:"alta",score:Math.round((1-margine)*100),desc:`Marginalità ${Math.round(margine*100)}%`,icon:"💰",color:"var(--danger)",label:"Profitabilità"});
    }
    
    // Risk 2: Payment anomalies
    if(hasAnom&&hasAnom.gravita==="alta"){
      risks.push({idx,cliente:c.cliente,prodotto:c.prodotto,tipo:"payment",gravita:"alta",score:95,desc:`${hasAnom.tipo.replace(/_/g,' ')}`,icon:"💳",color:"var(--danger)",label:"Pagamenti"});
    }
    
    // Risk 3: Expiring soon
    if(c.giorni_scadenza>0&&c.giorni_scadenza<=30){
      risks.push({idx,cliente:c.cliente,prodotto:c.prodotto,tipo:"expiring",gravita:"media",score:Math.round((30-c.giorni_scadenza)/30*100),desc:`Scade tra ${c.giorni_scadenza}gg`,icon:"⏰",color:"var(--warn)",label:"Scadenze"});
    }
    
    // Risk 4: High credit exposure
    if(c.tetto_cred>=15){
      risks.push({idx,cliente:c.cliente,prodotto:c.prodotto,tipo:"credit",gravita:"media",score:c.tetto_cred*5,desc:`Crediti ${c.tetto_cred}%`,icon:"⚠️",color:"var(--warn)",label:"Crediti"});
    }
    
    // Risk 5: Aggressive pricing (Freader)
    if(c.prezzo_f1&&c.prezzo_f1>=18){
      risks.push({idx,cliente:c.cliente,prodotto:c.prodotto,tipo:"pricing",gravita:"bassa",score:c.prezzo_f1*3,desc:`Prezzo €${c.prezzo_f1}`,icon:"📊",color:"var(--accent)",label:"Pricing"});
    }
  });
  
  risks.sort((a,b)=>b.score-a.score);
  
  // Filter risks
  let filteredRisks=risks;
  if(riskFilter==="alta")filteredRisks=risks.filter(r=>r.gravita==="alta");
  else if(riskFilter==="media")filteredRisks=risks.filter(r=>r.gravita==="media");
  else if(riskFilter==="bassa")filteredRisks=risks.filter(r=>r.gravita==="bassa");
  else if(riskFilter!=="all")filteredRisks=risks.filter(r=>r.tipo===riskFilter);
  
  const critici=risks.filter(r=>r.gravita==="alta").length;
  const medi=risks.filter(r=>r.gravita==="media").length;
  const bassi=risks.filter(r=>r.gravita==="bassa").length;
  const riskPct=Math.round((critici+medi*0.5)/all.length*100);
  
  // Calculate heatmap data
  const heatmapData={
    profitability:risks.filter(r=>r.tipo==="profitability").length,
    payment:risks.filter(r=>r.tipo==="payment").length,
    expiring:risks.filter(r=>r.tipo==="expiring").length,
    credit:risks.filter(r=>r.tipo==="credit").length,
    pricing:risks.filter(r=>r.tipo==="pricing").length
  };
  const maxHeat=Math.max(...Object.values(heatmapData));
  
  return `
  <div class="pg-hd">
    <h1>🚨 Risk Radar</h1>
    <p>Monitoraggio rischi in tempo reale • ${risks.length} rischi rilevati</p>
  </div>
  
  <div class="radar-hero">
    <div class="radar-hero-left">
      <div class="radar-eyebrow">REAL-TIME MONITORING</div>
      <h1 class="radar-title">Risk Score</h1>
      <p class="radar-subtitle">Analisi predittiva dei rischi contrattuali</p>
    </div>
    <div class="radar-hero-right">
      <div class="radar-circle">
        <svg viewBox="0 0 200 200" class="radar-svg">
          <defs>
            <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--danger)" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="var(--warn)" stop-opacity="0.8"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--border)" stroke-width="12" opacity="0.2"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="url(#riskGrad)" stroke-width="12" 
            stroke-dasharray="${riskPct*5.03} 503" transform="rotate(-90 100 100)" 
            stroke-linecap="round" class="radar-progress"/>
          <text x="100" y="95" text-anchor="middle" fill="var(--ink)" font-size="48" font-weight="700" font-family="var(--mono)">${riskPct}</text>
          <text x="100" y="115" text-anchor="middle" fill="var(--ink-3)" font-size="14" font-weight="600">RISK %</text>
        </svg>
      </div>
    </div>
  </div>
  
  <div class="radar-stats">
    <div class="radar-stat critical" onclick="setRiskFilter('alta')">
      <div class="radar-stat-icon">🔴</div>
      <div class="radar-stat-num">${critici}</div>
      <div class="radar-stat-label">CRITICI</div>
    </div>
    <div class="radar-stat warning" onclick="setRiskFilter('media')">
      <div class="radar-stat-icon">🟡</div>
      <div class="radar-stat-num">${medi}</div>
      <div class="radar-stat-label">ATTENZIONE</div>
    </div>
    <div class="radar-stat info" onclick="setRiskFilter('bassa')">
      <div class="radar-stat-icon">🔵</div>
      <div class="radar-stat-num">${bassi}</div>
      <div class="radar-stat-label">MONITORAGGIO</div>
    </div>
    <div class="radar-stat safe" onclick="setRiskFilter('all')">
      <div class="radar-stat-icon">🟢</div>
      <div class="radar-stat-num">${all.length-critici-medi-bassi}</div>
      <div class="radar-stat-label">SICURI</div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-hd">
      <h3>🔥 Risk Heatmap</h3>
      <div class="risk-filter-chips">
        <button class="chip ${riskFilter==="all"?"on":""}" onclick="setRiskFilter('all')">Tutti (${risks.length})</button>
        <button class="chip ${riskFilter==="profitability"?"on":""}" onclick="setRiskFilter('profitability')">💰 Profitabilità (${heatmapData.profitability})</button>
        <button class="chip ${riskFilter==="payment"?"on":""}" onclick="setRiskFilter('payment')">💳 Pagamenti (${heatmapData.payment})</button>
        <button class="chip ${riskFilter==="expiring"?"on":""}" onclick="setRiskFilter('expiring')">⏰ Scadenze (${heatmapData.expiring})</button>
        <button class="chip ${riskFilter==="credit"?"on":""}" onclick="setRiskFilter('credit')">⚠️ Crediti (${heatmapData.credit})</button>
        <button class="chip ${riskFilter==="pricing"?"on":""}" onclick="setRiskFilter('pricing')">📊 Pricing (${heatmapData.pricing})</button>
      </div>
    </div>
    <div class="card-bd">
      <div class="risk-heatmap">
        ${Object.entries(heatmapData).map(([tipo,count])=>{
          const intensity=maxHeat>0?count/maxHeat:0;
          const icons={profitability:"💰",payment:"💳",expiring:"⏰",credit:"⚠️",pricing:"📊"};
          const labels={profitability:"Profitabilità",payment:"Pagamenti",expiring:"Scadenze",credit:"Crediti",pricing:"Pricing"};
          return `<div class="heatmap-cell" style="opacity:${0.3+intensity*0.7}" onclick="setRiskFilter('${tipo}')">
            <div class="heatmap-icon">${icons[tipo]}</div>
            <div class="heatmap-label">${labels[tipo]}</div>
            <div class="heatmap-count">${count}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>
  
  ${riskFilter==="all"?`
    ${critici>0?`<div class="card risk-section-critical">
      <div class="card-hd">
        <h3>🔴 Rischi Critici (${critici})</h3>
        <span class="b b-err">Richiede azione immediata</span>
      </div>
      <div class="card-bd">
        <div class="radar-grid">
          ${risks.filter(r=>r.gravita==="alta").map(r=>`
            <div class="radar-card ${r.gravita}" onclick="openDetail(${r.idx})">
              <div class="radar-card-header">
                <div class="radar-card-icon">${r.icon}</div>
                <div class="radar-card-score" style="color:${r.color}">${r.score}</div>
              </div>
              <div class="radar-card-client">${r.cliente}</div>
              <div class="radar-card-desc">${r.desc}</div>
              <div class="radar-card-footer">
                <span class="b ${r.prodotto==='Freader'?'b-fr':'b-cu'}">${r.prodotto}</span>
                <span class="radar-card-type">${r.label}</span>
              </div>
              <div class="radar-card-actions">
                <button class="radar-action-btn" onclick="event.stopPropagation();alert('Azione: Contatta cliente')">📞 Contatta</button>
                <button class="radar-action-btn" onclick="event.stopPropagation();alert('Azione: Analizza rischio')">📊 Analizza</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`:''}
    
    ${medi>0?`<div class="card risk-section-warning">
      <div class="card-hd">
        <h3>🟡 Rischi in Attenzione (${medi})</h3>
        <span class="b b-wrn">Monitoraggio attivo</span>
      </div>
      <div class="card-bd">
        <div class="radar-grid">
          ${risks.filter(r=>r.gravita==="media").map(r=>`
            <div class="radar-card ${r.gravita}" onclick="openDetail(${r.idx})">
              <div class="radar-card-header">
                <div class="radar-card-icon">${r.icon}</div>
                <div class="radar-card-score" style="color:${r.color}">${r.score}</div>
              </div>
              <div class="radar-card-client">${r.cliente}</div>
              <div class="radar-card-desc">${r.desc}</div>
              <div class="radar-card-footer">
                <span class="b ${r.prodotto==='Freader'?'b-fr':'b-cu'}">${r.prodotto}</span>
                <span class="radar-card-type">${r.label}</span>
              </div>
              <div class="radar-card-actions">
                <button class="radar-action-btn" onclick="event.stopPropagation();alert('Azione: Contatta cliente')">📞 Contatta</button>
                <button class="radar-action-btn" onclick="event.stopPropagation();alert('Azione: Analizza rischio')">📊 Analizza</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`:''}
    
    ${bassi>0?`<div class="card risk-section-info">
      <div class="card-hd">
        <h3>🔵 Rischi in Monitoraggio (${bassi})</h3>
        <span class="b b-ok">Sotto controllo</span>
      </div>
      <div class="card-bd">
        <div class="radar-grid">
          ${risks.filter(r=>r.gravita==="bassa").map(r=>`
            <div class="radar-card ${r.gravita}" onclick="openDetail(${r.idx})">
              <div class="radar-card-header">
                <div class="radar-card-icon">${r.icon}</div>
                <div class="radar-card-score" style="color:${r.color}">${r.score}</div>
              </div>
              <div class="radar-card-client">${r.cliente}</div>
              <div class="radar-card-desc">${r.desc}</div>
              <div class="radar-card-footer">
                <span class="b ${r.prodotto==='Freader'?'b-fr':'b-cu'}">${r.prodotto}</span>
                <span class="radar-card-type">${r.label}</span>
              </div>
              <div class="radar-card-actions">
                <button class="radar-action-btn" onclick="event.stopPropagation();alert('Azione: Contatta cliente')">📞 Contatta</button>
                <button class="radar-action-btn" onclick="event.stopPropagation();alert('Azione: Analizza rischio')">📊 Analizza</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`:''}
    
    ${all.length-critici-medi-bassi>0?`<div class="card risk-section-safe">
      <div class="card-hd">
        <h3>🟢 Contratti Sicuri (${all.length-critici-medi-bassi})</h3>
        <span class="b b-ok">Nessun rischio rilevato</span>
      </div>
      <div class="card-bd">
        <p style="text-align:center;color:var(--ink-3);padding:40px">
          ${all.length-critici-medi-bassi} contratti non presentano rischi significativi e sono in buono stato.
        </p>
      </div>
    </div>`:''}
  `:`
    ${filteredRisks.length>0?`<div class="card">
      <div class="card-hd">
        <h3>📋 Rischi Rilevati (${filteredRisks.length})</h3>
        <button class="chip" onclick="setRiskFilter('all')">✕ Rimuovi filtro</button>
      </div>
      <div class="card-bd">
        <div class="radar-grid">
          ${filteredRisks.slice(0,20).map(r=>`
            <div class="radar-card ${r.gravita}" onclick="openDetail(${r.idx})">
              <div class="radar-card-header">
                <div class="radar-card-icon">${r.icon}</div>
                <div class="radar-card-score" style="color:${r.color}">${r.score}</div>
              </div>
              <div class="radar-card-client">${r.cliente}</div>
              <div class="radar-card-desc">${r.desc}</div>
              <div class="radar-card-footer">
                <span class="b ${r.prodotto==='Freader'?'b-fr':'b-cu'}">${r.prodotto}</span>
                <span class="radar-card-type">${r.label}</span>
              </div>
              <div class="radar-card-actions">
                <button class="radar-action-btn" onclick="event.stopPropagation();alert('Azione: Contatta cliente')">📞 Contatta</button>
                <button class="radar-action-btn" onclick="event.stopPropagation();alert('Azione: Analizza rischio')">📊 Analizza</button>
              </div>
            </div>
          `).join('')}
        </div>
        ${filteredRisks.length>20?`<div class="contract-load-more">
          <button class="btn-load-more">Mostra altri ${filteredRisks.length-20} rischi</button>
        </div>`:''}
      </div>
    </div>`:`<div class="card"><div class="card-bd"><p style="text-align:center;color:var(--ink-3);padding:40px">Nessun rischio trovato con i filtri selezionati</p></div></div>`}
  `}
  
  <div class="card">
    <div class="card-hd"><h3>🌍 GLOBAL RISK MAP</h3></div>
    <div class="card-bd">${renderRiskGlobe(all,risks)}</div>
  </div>`;
}

function renderRiskGlobe(contracts,risks){
  const COORDS={
    "Milano":[45.46,9.19],"Roma":[41.90,12.50],"Torino":[45.07,7.69],
    "Bologna":[44.49,11.34],"Napoli":[40.85,14.27],"Firenze":[43.77,11.25],
    "Genova":[44.41,8.93],"Verona":[45.44,10.99],"Padova":[45.41,11.88],
    "Brescia":[45.54,10.21],"Modena":[44.65,10.92],"Bari":[41.12,16.87],
    "Venezia":[45.44,12.32],"Catania":[37.50,15.09],"Palermo":[38.12,13.36],
  };
  
  const cityRisks={};
  contracts.forEach((c,idx)=>{
    const city=c.sede;
    if(!cityRisks[city]){
      const coords=COORDS[city]||[42,12];
      cityRisks[city]={citta:city,lat:coords[0],lng:coords[1],score:0,count:0};
    }
    const clientRisks=risks.filter(r=>r.idx===idx);
    cityRisks[city].score+=clientRisks.reduce((sum,r)=>sum+r.score,0);
    cityRisks[city].count++;
  });
  
  const data=Object.values(cityRisks).sort((a,b)=>b.score-a.score);
  setTimeout(()=>initGlobe('globe-risks',data,true),100);
  return `<div id="globe-risks" style="width:100%;height:400px;position:relative"></div>`;
}

function renderRiskBreakdown(risks){
  const types={profitability:0,payment:0,expiring:0,credit:0,pricing:0};
  risks.forEach(r=>types[r.tipo]++);
  const labels={profitability:"Marginalità",payment:"Pagamenti",expiring:"Scadenze",credit:"Crediti",pricing:"Pricing"};
  const icons={profitability:"💰",payment:"💳",expiring:"⏰",credit:"⚠️",pricing:"📊"};
  const total=risks.length||1;
  
  return `<div class="breakdown-grid">
    ${Object.keys(types).map(t=>`
      <div class="breakdown-item">
        <div class="breakdown-icon">${icons[t]}</div>
        <div class="breakdown-body">
          <div class="breakdown-label">${labels[t]}</div>
          <div class="breakdown-bar">
            <div class="breakdown-fill" style="width:${types[t]/total*100}%"></div>
          </div>
        </div>
        <div class="breakdown-num">${types[t]}</div>
      </div>
    `).join('')}
  </div>`;
}

function renderTopRiskClients(contracts,risks){
  const clientRisks={};
  risks.forEach(r=>{
    if(!clientRisks[r.cliente])clientRisks[r.cliente]={cliente:r.cliente,prodotto:r.prodotto,idx:r.idx,score:0,count:0};
    clientRisks[r.cliente].score+=r.score;
    clientRisks[r.cliente].count++;
  });
  const sorted=Object.values(clientRisks).sort((a,b)=>b.score-a.score).slice(0,6);
  
  return `<div class="top-risk-list">
    ${sorted.map((c,i)=>`
      <div class="top-risk-item" onclick="openDetail(${c.idx})">
        <div class="top-risk-rank">${i+1}</div>
        <div class="top-risk-body">
          <div class="top-risk-name">${c.cliente}</div>
          <div class="top-risk-meta">${c.count} rischi rilevati</div>
        </div>
        <div class="top-risk-score">${c.score}</div>
      </div>
    `).join('')}
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
  window.currentCostData=d;
  return `
  <div class="pg-hd"><h1>Reparto Costi</h1>
    <div class="seg"><button class="${costProduct==='prodotto1'?'on':''}" onclick="setCostProd('prodotto1')">Freader</button><button class="${costProduct==='prodotto2'?'on':''}" onclick="setCostProd('prodotto2')">CutAI</button><button class="${costProduct==='totale'?'on':''}" onclick="setCostProd('totale')">Totale</button></div>
  </div>
  <div class="m-grid c4">
    ${mc("Costi fissi",euro(d.tot_fissi),null,null,"openCostModal('fissi',window.currentCostData)")}
    ${mc("Costi variabili",euro(d.tot_variabili),null,null,"openCostModal('variabili',window.currentCostData)")}
    ${mc("Costi diretti",euro(d.tot_diretti),null,null,"showCostDetail('diretti')")}
    ${mc("Costi indiretti",euro(d.tot_indiretti),null,null,"showCostDetail('indiretti')")}
  </div>
  ${costProduct==='totale'?`<div class="m-grid c2">${mc("Costo Freader",euro(d.costo_prodotto_freader),null,null,"setCostProd('prodotto1')")}${mc("Costo CutAI",euro(d.costo_prodotto_cutai),null,null,"setCostProd('prodotto2')")}</div>`:''}
  ${costProduct!=='totale'?`<div class="m-grid c1">${mc("Costo unitario / contratto",euro(d.costo_unit_trad),"Metodo tradizionale",null,"showCostDetail('unitario')")}</div>`:''}`;
}

// ══════════════════════════════════════════════
// CONTRACTS + ANOMALIES + MAP
// ══════════════════════════════════════════════
// CONTRACTS + ANOMALIES + MAP + ENHANCED VIEW
// ══════════════════════════════════════════════
async function renderContracts(){
  const all=await api("/contracts"),exp=await api("/expiring"),mapData=await api("/map-data"),anom=await api("/anomalies");
  if(!all)return `<div class="pg-hd"><h1>Contratti</h1><p>Backend non raggiungibile.</p></div>`;
  
  // Filter contracts
  let filtered=all;
  if(contractFilter==="active")filtered=all.filter(c=>c.giorni_scadenza>0);
  else if(contractFilter==="expired")filtered=all.filter(c=>c.giorni_scadenza<=0);
  else if(contractFilter==="expiring")filtered=all.filter(c=>c.giorni_scadenza>0&&c.giorni_scadenza<=90);
  else if(contractFilter==="anomalies"&&anom)filtered=all.filter(c=>anom.find(a=>a.cliente===c.cliente));
  
  // Search filter
  if(searchQuery){
    const q=searchQuery.toLowerCase();
    filtered=filtered.filter(c=>
      c.cliente.toLowerCase().includes(q)||
      c.sede.toLowerCase().includes(q)||
      c.prodotto.toLowerCase().includes(q)||
      c.data_firma.includes(q)||
      c.scadenza.includes(q)
    );
  }
  
  const attivi=all.filter(c=>c.giorni_scadenza>0).length;
  const scaduti=all.filter(c=>c.giorni_scadenza<=0).length;
  const inScad=all.filter(c=>c.giorni_scadenza>0&&c.giorni_scadenza<=90).length;
  const anomAlte=anom?anom.filter(a=>a.gravita==="alta"):[];
  
  // Calculate health metrics
  const avgCanone=all.reduce((sum,c)=>sum+c.canone_trim,0)/all.length;
  const totalValue=all.reduce((sum,c)=>sum+c.fatturato_annuo,0);
  const healthyContracts=all.filter(c=>c.giorni_scadenza>90&&!anom?.find(a=>a.cliente===c.cliente)).length;
  const healthScore=Math.round((healthyContracts/all.length)*100);
  
  return `
  <div class="pg-hd">
    <h1>📋 Gestione Contratti</h1>
    <p>${all.length} contratti • Valore totale ${euro(totalValue)}</p>
  </div>
  
  <div class="contract-stats-grid">
    <div class="contract-stat-card primary" onclick="openContractsModal('all')">
      <div class="contract-stat-icon">📊</div>
      <div class="contract-stat-content">
        <div class="contract-stat-num">${num(all.length)}</div>
        <div class="contract-stat-label">Totale Contratti</div>
        <div class="contract-stat-meta">${euro(totalValue)} valore</div>
      </div>
    </div>
    
    <div class="contract-stat-card success" onclick="openContractsModal('active')">
      <div class="contract-stat-icon">✅</div>
      <div class="contract-stat-content">
        <div class="contract-stat-num">${num(attivi)}</div>
        <div class="contract-stat-label">Attivi</div>
        <div class="contract-stat-meta">${Math.round(attivi/all.length*100)}% del totale</div>
      </div>
    </div>
    
    <div class="contract-stat-card ${inScad>0?"warning":"success"}" onclick="openExpiringModal()">
      <div class="contract-stat-icon">${inScad>0?"⏰":"🎯"}</div>
      <div class="contract-stat-content">
        <div class="contract-stat-num">${num(inScad)}</div>
        <div class="contract-stat-label">In Scadenza 90gg</div>
        <div class="contract-stat-meta">${inScad>0?"Richiede attenzione":"Tutto ok"}</div>
      </div>
    </div>
    
    <div class="contract-stat-card ${scaduti>0?"danger":"success"}" onclick="openContractsModal('expired')">
      <div class="contract-stat-icon">${scaduti>0?"❌":"✨"}</div>
      <div class="contract-stat-content">
        <div class="contract-stat-num">${num(scaduti)}</div>
        <div class="contract-stat-label">Scaduti</div>
        <div class="contract-stat-meta">${scaduti>0?"Da rinnovare":"Nessuno"}</div>
      </div>
    </div>
    
    <div class="contract-stat-card ${anomAlte.length>0?"danger":"info"}" onclick="openContractsModal('anomalies')">
      <div class="contract-stat-icon">${anomAlte.length>0?"⚠️":"💳"}</div>
      <div class="contract-stat-content">
        <div class="contract-stat-num">${num(anom?anom.length:0)}</div>
        <div class="contract-stat-label">Anomalie</div>
        <div class="contract-stat-meta">${anomAlte.length} critiche</div>
      </div>
    </div>
    
    <div class="contract-stat-card health">
      <div class="contract-stat-icon">💚</div>
      <div class="contract-stat-content">
        <div class="contract-stat-num">${healthScore}%</div>
        <div class="contract-stat-label">Health Score</div>
        <div class="contract-stat-meta">${healthyContracts} contratti sani</div>
      </div>
    </div>
  </div>
  
  <div class="search-bar">
    <input type="text" placeholder="🔍 Cerca per cliente, sede, prodotto, data..." value="${searchQuery}" oninput="setSearch(this.value)">
    <div class="filter-chips">
      <button class="chip ${contractFilter==="all"?"on":""}" onclick="showContracts('all')">Tutti</button>
      <button class="chip ${contractFilter==="active"?"on":""}" onclick="showContracts('active')">Attivi</button>
      <button class="chip ${contractFilter==="expired"?"on":""}" onclick="showContracts('expired')">Scaduti</button>
      <button class="chip ${contractFilter==="expiring"?"on":""}" onclick="showContracts('expiring')">In scadenza</button>
      <button class="chip ${contractFilter==="anomalies"?"on":""}" onclick="showContracts('anomalies')">Con anomalie</button>
    </div>
  </div>
  
  ${filtered.length>0?`<div class="card">
    <div class="card-hd">
      <h3>📑 Lista Contratti (${filtered.length})</h3>
      <div class="contract-view-toggle">
        <button class="chip-sm">Vista tabella</button>
        <button class="chip-sm">Vista card</button>
      </div>
    </div>
    <div class="card-bd">
      <div class="contract-list-enhanced">
        ${filtered.slice(0,20).map((c,idx)=>{
          const health=c.giorni_scadenza>90&&!anom?.find(a=>a.cliente===c.cliente)?100:c.giorni_scadenza>30?70:c.giorni_scadenza>0?40:0;
          const healthColor=health>=70?"success":health>=40?"warning":"danger";
          const hasAnomaly=anom?.find(a=>a.cliente===c.cliente);
          return `<div class="contract-item-enhanced" onclick="openDetail(${all.indexOf(c)})">
            <div class="contract-item-header">
              <div class="contract-item-client">
                <div class="contract-item-name">${c.cliente}</div>
                <div class="contract-item-meta">
                  <span class="b ${c.prodotto==='Freader'?'b-fr':'b-cu'}">${c.prodotto}</span>
                  <span class="contract-item-location">📍 ${c.sede}</span>
                </div>
              </div>
              <div class="contract-item-health ${healthColor}">
                <div class="contract-health-circle">
                  <svg viewBox="0 0 36 36" class="contract-health-svg">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/>
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-dasharray="${health*1.005} 100.5" transform="rotate(-90 18 18)" stroke-linecap="round"/>
                  </svg>
                  <span class="contract-health-num">${health}</span>
                </div>
                <div class="contract-health-label">Health</div>
              </div>
            </div>
            <div class="contract-item-body">
              <div class="contract-item-stat">
                <div class="contract-item-stat-label">Canone Trim.</div>
                <div class="contract-item-stat-value">${euro(c.canone_trim)}</div>
              </div>
              <div class="contract-item-stat">
                <div class="contract-item-stat-label">Fatturato Anno</div>
                <div class="contract-item-stat-value">${euro(c.fatturato_annuo)}</div>
              </div>
              <div class="contract-item-stat">
                <div class="contract-item-stat-label">Durata</div>
                <div class="contract-item-stat-value">${c.durata_mesi}m</div>
              </div>
              <div class="contract-item-stat">
                <div class="contract-item-stat-label">Scadenza</div>
                <div class="contract-item-stat-value ${c.giorni_scadenza<=0?'danger':c.giorni_scadenza<=30?'warning':'success'}">
                  ${c.giorni_scadenza>0?c.giorni_scadenza+'gg':'Scaduto'}
                </div>
              </div>
            </div>
            ${hasAnomaly?`<div class="contract-item-alert">
              <span class="contract-alert-icon">⚠️</span>
              <span class="contract-alert-text">Anomalia: ${hasAnomaly.tipo.replace(/_/g,' ')}</span>
            </div>`:''}
          </div>`;
        }).join('')}
      </div>
      ${filtered.length>20?`<div class="contract-load-more">
        <button class="btn-load-more" onclick="alert('Caricamento altri contratti...')">Carica altri ${filtered.length-20} contratti</button>
      </div>`:''}
    </div>
  </div>`:'<div class="card"><div class="card-bd"><p style="text-align:center;color:var(--ink-3);padding:40px">Nessun contratto trovato con i filtri selezionati</p></div></div>'}
  
  <div class="g2">
    <div class="card"><div class="card-hd"><h3>🌍 Distribuzione Geografica</h3></div><div class="card-bd">${renderSatelliteMap(mapData)}</div></div>
  </div>`;
}


function renderSatelliteMap(data){
  if(!data||!data.length)return '<span class="c-muted">Nessun dato</span>';
  setTimeout(()=>initGlobe('globe-contracts',data,false),200);
  return `<div id="globe-contracts" style="width:100%;height:400px;position:relative;background:var(--surface-alt);border-radius:12px"></div>`;
}

function initGlobe(containerId,data,showRisk){
  const container=document.getElementById(containerId);
  if(!container){
    console.error('Container not found:',containerId);
    return;
  }
  
  // Check if COBE is available (try both window.COBE and window.createGlobe)
  const createGlobe=window.COBE||window.createGlobe;
  if(!createGlobe){
    console.error('COBE library not loaded yet');
    container.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--ink-3);font-size:0.9rem">Caricamento globo...</div>';
    // Retry after delay
    setTimeout(()=>initGlobe(containerId,data,showRisk),800);
    return;
  }
  
  const canvas=document.createElement('canvas');
  canvas.style.width='100%';
  canvas.style.height='100%';
  canvas.style.cursor='grab';
  canvas.style.opacity='0';
  canvas.style.transition='opacity 1s ease';
  container.innerHTML='';
  container.appendChild(canvas);
  
  // Convert city coordinates to markers
  const markers=data.map(d=>({
    location:[d.lat,d.lng],
    size:showRisk?0.04:0.03
  }));
  
  let phi=0;
  const width=container.offsetWidth;
  canvas.width=width*2;
  canvas.height=width*2;
  
  try{
    const globe=createGlobe(canvas,{
      devicePixelRatio:2,
      width:width*2,
      height:width*2,
      phi:0,
      theta:0.3,
      dark:0,
      diffuse:1.8,
      mapSamples:16000,
      mapBrightness:8,
      baseColor:[0.95,0.95,0.98],
      markerColor:showRisk?[0.93,0.26,0.26]:[0.39,0.40,0.95],
      glowColor:[0.85,0.88,0.95],
      markers:markers,
      onRender:(state)=>{
        state.phi=phi;
        phi+=0.003;
      }
    });
    
    setTimeout(()=>canvas.style.opacity='1',100);
    
    // Add legend
    const legend=document.createElement('div');
    legend.className='globe-legend';
    legend.innerHTML=data.slice(0,6).map(d=>`
      <div class="globe-legend-item">
        <div class="globe-legend-dot" style="background:${showRisk?'var(--danger)':'var(--accent)'}"></div>
        <span>${d.citta||d.cliente}</span>
        <strong>${d.count||d.score||0}</strong>
      </div>
    `).join('');
    container.appendChild(legend);
    
    return ()=>globe.destroy();
  }catch(e){
    console.error('Globe initialization error:',e);
    container.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--danger);font-size:0.9rem">Errore caricamento globo: '+e.message+'</div>';
  }
}

function renderMap(data){
  if(!data||!data.length)return '<span class="c-muted">Nessun dato</span>';
  const W=300,H=340;
  function proj(lat,lng){return [(lng-6.5)/(18.5-6.5)*W,(1-(lat-36)/(47-36))*H];}
  const mx=Math.max(...data.map(d=>d.count));
  const dots=data.map(d=>{const[x,y]=proj(d.lat,d.lng);const r=Math.max(6,Math.min(18,d.count/mx*18));return `<g class="map-dot"><circle cx="${x}" cy="${y}" r="${r}" fill="var(--accent)" opacity=".18"/><circle cx="${x}" cy="${y}" r="${Math.max(3,r*.5)}" fill="var(--accent)" opacity=".7"/><title>${d.citta}: ${d.count}</title></g><text x="${x}" y="${y-r-3}" text-anchor="middle" fill="var(--ink-2)" font-size="9" font-weight="600">${d.citta}</text>`;}).join("");
  const outline=`<path d="M140 20C155 15,175 18,185 30C195 42,200 55,195 70C190 85,200 95,210 105C220 115,235 120,245 135C255 150,260 165,255 180C250 195,240 205,235 220C230 235,225 245,215 255C205 265,195 270,185 280C175 290,170 300,160 310C150 320,140 325,130 320C120 315,115 305,120 295C125 285,130 275,125 265C120 255,110 250,105 240C100 230,95 220,90 210C85 200,80 190,85 180C90 170,95 160,100 150C105 140,100 130,95 120C90 110,85 100,90 90C95 80,100 70,110 60C120 50,125 35,140 20Z" fill="none" stroke="var(--border)" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-height:280px">${outline}${dots}</svg><div class="map-legend">${data.sort((a,b)=>b.count-a.count).slice(0,6).map(d=>`<span class="map-leg-item"><span class="map-leg-dot"></span>${d.citta} <strong>${d.count}</strong></span>`).join("")}</div>`;
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
// REVENUE DIVERSIFICATION INTELLIGENCE + AI ASSISTANT
// ══════════════════════════════════════════════
async function renderAdvisor(){
  const k=await api("/kpi");
  if(!k)return `<div class="pg-hd"><h1>Revenue Diversification Intelligence</h1><p>Backend non raggiungibile.</p></div>`;
  
  // Calculate diversification metrics
  const freaderPct=Math.round(k.fatturato_freader/k.fatturato_totale*100);
  const cutaiPct=Math.round(k.fatturato_cutai/k.fatturato_totale*100);
  const riskLevel=freaderPct>65||cutaiPct>65?"ALTO":freaderPct>55||cutaiPct>55?"MEDIO":"BASSO";
  const riskColor=riskLevel==="ALTO"?"danger":riskLevel==="MEDIO"?"warn":"safe";
  
  // AI Insights
  const aiInsight=freaderPct>65?
    `Hai una concentrazione del ${freaderPct}% su Freader. Questo espone l'azienda a rischio elevato. Ti consiglio di aumentare la quota di CutAI.`:
    `Buona diversificazione: Freader ${freaderPct}%, CutAI ${cutaiPct}%. Mantieni questo equilibrio.`;
  
  const targetGap=Math.max(0,freaderPct-50);
  const neededRevenue=Math.round(k.fatturato_totale*targetGap/100);
  const estimatedClients=Math.ceil(neededRevenue/(k.avg_fatturato||50000));
  const estimatedMonths=Math.ceil(estimatedClients/2);
  
  return `
  <div class="pg-hd">
    <h1>💡 Revenue Diversification Intelligence</h1>
    <p>Analisi concentrazione ricavi e suggerimenti strategici</p>
  </div>
  
  <div class="rev-hero">
    <div class="rev-hero-left">
      <div class="rev-eyebrow">RISK ASSESSMENT</div>
      <div class="rev-risk-badge ${riskColor}">
        <span class="rev-risk-icon">${riskLevel==="ALTO"?"🔴":riskLevel==="MEDIO"?"🟡":"🟢"}</span>
        <span class="rev-risk-label">RISCHIO ${riskLevel}</span>
      </div>
      <div class="rev-hero-stat">
        <div class="rev-hero-num">${freaderPct}%</div>
        <div class="rev-hero-label">Concentrazione Freader</div>
      </div>
    </div>
    <div class="rev-hero-right">
      <div class="rev-chart">
        <svg viewBox="0 0 200 200" style="width:200px;height:200px">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#E5E7EB" stroke-width="20"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="#6366F1" stroke-width="20"
            stroke-dasharray="${freaderPct*5.03} 503" transform="rotate(-90 100 100)" stroke-linecap="round"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="#10B981" stroke-width="20"
            stroke-dasharray="${cutaiPct*5.03} 503" 
            transform="rotate(${-90+freaderPct*3.6} 100 100)" stroke-linecap="round"/>
          <text x="100" y="95" text-anchor="middle" fill="#0F172A" font-size="32" font-weight="700">${freaderPct}%</text>
          <text x="100" y="115" text-anchor="middle" fill="#64748B" font-size="12">Freader</text>
        </svg>
      </div>
    </div>
  </div>
  
  <div class="g2">
    <div class="card">
      <div class="card-hd"><h3>📊 Distribuzione Revenue</h3></div>
      <div class="card-bd">
        <div class="rev-dist-item">
          <div class="rev-dist-header">
            <span class="b b-fr">Freader</span>
            <strong>${euro(k.fatturato_freader)}</strong>
          </div>
          <div class="rev-dist-bar">
            <div class="rev-dist-fill freader" style="width:${freaderPct}%"></div>
          </div>
          <div class="rev-dist-pct">${freaderPct}%</div>
        </div>
        <div class="rev-dist-item">
          <div class="rev-dist-header">
            <span class="b b-cu">CutAI</span>
            <strong>${euro(k.fatturato_cutai)}</strong>
          </div>
          <div class="rev-dist-bar">
            <div class="rev-dist-fill cutai" style="width:${cutaiPct}%"></div>
          </div>
          <div class="rev-dist-pct">${cutaiPct}%</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hd"><h3>🎯 KPI Diversificazione</h3></div>
      <div class="card-bd">
        <div class="kpi-list">
          ${kr("Prodotto dominante",freaderPct>cutaiPct?"Freader":"CutAI")}
          ${kr("Concentrazione max",Math.max(freaderPct,cutaiPct)+"%")}
          ${kr("Target ideale","40-60%")}
          ${kr("Gap da target",targetGap+"%")}
          ${kr("Livello rischio",riskLevel)}
        </div>
      </div>
    </div>
  </div>
  
  ${riskLevel!=="BASSO"?`<div class="card rev-alert">
    <div class="card-hd"><h3>⚠️ Alert Concentrazione</h3></div>
    <div class="card-bd">
      <p class="rev-alert-text">La concentrazione su ${freaderPct>cutaiPct?"Freader":"CutAI"} è troppo alta (${Math.max(freaderPct,cutaiPct)}%). Rischio: perdita di un cliente chiave o calo di mercato potrebbero impattare significativamente il fatturato.</p>
    </div>
  </div>`:''}
  
  <div class="rev-ai-panel">
    <div class="rev-ai-header">
      <div class="rev-ai-avatar">🤖</div>
      <div>
        <div class="rev-ai-title">AI Decision Copilot</div>
        <div class="rev-ai-subtitle">Analisi in tempo reale</div>
      </div>
    </div>
    <div class="rev-ai-insight">
      <div class="rev-ai-insight-icon">💡</div>
      <div class="rev-ai-insight-text">${aiInsight}</div>
    </div>
    ${targetGap>0?`<div class="rev-ai-action">
      <div class="rev-ai-action-title">Piano d'azione suggerito</div>
      <div class="rev-ai-action-steps">
        <div class="rev-ai-step">1. Identifica ${estimatedClients} prospect per CutAI</div>
        <div class="rev-ai-step">2. Prepara offerta commerciale aggressiva</div>
        <div class="rev-ai-step">3. Monitora conversione settimanalmente</div>
        <div class="rev-ai-step">4. Target: ${euro(neededRevenue)} in ${estimatedMonths} mesi</div>
      </div>
    </div>`:''}
    <div class="rev-ai-quick">
      <div class="rev-ai-quick-title">Quick Actions</div>
      <div class="rev-ai-quick-btns">
        <button class="rev-ai-btn" onclick="alert('Simulazione: Con +20% CutAI raggiungi equilibrio in 6 mesi')">📊 Simula scenario</button>
        <button class="rev-ai-btn" onclick="alert('Cliente più critico: ${k.attivi>0?'Analisi disponibile in Contratti':'Nessun dato'}')">🎯 Cliente critico</button>
        <button class="rev-ai-btn" onclick="alert('Rischio reale: ${riskLevel} - Impatto potenziale: ${Math.round(Math.max(freaderPct,cutaiPct)*k.fatturato_totale/100)} EUR')">⚠️ Calcola rischio</button>
      </div>
    </div>
  </div>`;
}

// ── INIT ──
document.addEventListener("DOMContentLoaded",()=>{
  api("/contracts").then(()=>render());
  checkAndNotify();
});
