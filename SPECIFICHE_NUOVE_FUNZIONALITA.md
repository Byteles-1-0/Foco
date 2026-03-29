# Specifiche Nuove Funzionalità — FOCO Contract Intelligence

## Contesto

Il progetto attuale gestisce contratti B2B SaaS (Freader e CutAI) con upload, estrazione AI, dashboard KPI e analisi pre-firma. Le specifiche seguenti descrivono le nuove funzionalità da implementare sopra l'architettura esistente (React + Vite frontend, Flask + SQLite backend, LLM Llama-3.3-70B via Regolo API).

---

## 1. Nuovo Flusso Principale di Analisi Contratto

### Stato attuale
- Welcome page → Upload → Estrazione testo → Analisi AI (dati strutturati) → Salvataggio
- L'analisi pre-firma (`/pre-sign-analysis`) esiste ma è separata dal flusso principale

### Nuovo flusso richiesto

```
Welcome + Upload contratto
        │
        ▼
Step 1: Analisi AI — Estrazione dati in sezioni
        (anagrafica, scadenza, clausole, pricing)
        │
        ▼
Step 2: Risk Analysis — AI analizza i dati estratti
        ├── 3 KPI: Risk Score, Punti Critici, Errori Ortografici
        ├── Lista punti critici espandibili (popup)
        ├── Per ogni punto: spiegazione + modifica manuale + tasto "Migliora"
        ├── Salvataggio modifiche/proposte
        └── Tasto "FINE"
        │
        ▼
Step 3: Confronto Prima/Dopo — KPI originali vs KPI post-modifiche
        │
        ▼
Salvataggio finale nel database
```

---

### Step 1 — Analisi AI: Estrazione Dati (già parzialmente esistente)

**Cosa cambia rispetto ad oggi:** L'output dell'analisi AI deve essere organizzato in 4 sezioni visive distinte, tutte modificabili dall'utente prima di procedere.

**Sezioni da mostrare:**

| Sezione | Campi | Fonte dati |
|---------|-------|------------|
| Anagrafica | Ragione sociale, sede legale | `anagrafica.*` dal JSON AI |
| Scadenza | Data firma, durata mesi, preavviso giorni, data scadenza calcolata | `dettagli_contratto.*` |
| Clausole & SLA | Credito uptime %, credito ticketing %, tetto crediti %, soglia minima servizio | `sla.*` |
| Pricing | Canone trimestrale, fasce prezzo (Freader) oppure profilo/utenti/fee (CutAI) | `commerciale_freader.*` o `commerciale_cutai.*` |

**Frontend:** Nuovo componente React `ContractReviewStep.jsx` che sostituisce l'attuale `AnalysisStep.jsx`. Ogni sezione è una card con campi editabili inline.

**Backend:** Nessuna modifica — usa l'output esistente di `analyze_contract_text()`.

---

### Step 2 — Risk Analysis: KPI + Punti Critici + Miglioramenti AI

Questa è la funzionalità principale nuova. Dopo che l'utente conferma i dati dello Step 1, l'AI analizza il contratto e produce 3 KPI e una lista di punti critici.

#### 2.1 — I 3 KPI

**Risk Score (0-100%)**
- Percentuale di rischio complessivo del contratto
- Calcolato come media pesata dei punti critici trovati
- Collegato direttamente ai punti critici: più punti critici gravi = score più alto
- Visualizzazione: gauge circolare con colore (verde < 30%, giallo 30-60%, rosso > 60%)

**Punti Critici (conteggio)**
- Numero totale di clausole/termini identificati come rischiosi
- Criteri standard applicati a tutti i contratti (vedi sezione 2.2)
- Visualizzazione: numero con badge di severità

**Errori Ortografici (conteggio)**
- Errori di battitura, grammatica, formattazione nel testo del contratto
- L'AI li identifica durante l'analisi del testo originale
- Visualizzazione: numero con lista espandibile

#### 2.2 — Criteri Standard per Punti Critici

L'AI deve valutare ogni contratto con questi criteri fissi (applicabili a qualsiasi contratto B2B):

| Criterio | Cosa verifica | Soglia critica |
|----------|--------------|----------------|
| Tetto crediti SLA | % massima di rimborso concessa | > 12% (media storica) |
| Credito uptime | % penale per downtime | > 7% |
| Credito ticketing | % penale per SLA ticket | > 6% |
| Preavviso disdetta | Giorni di preavviso | < 30 giorni (rischio churn improvviso) o > 120 giorni (vincolo eccessivo) |
| Durata contratto | Mesi di lock-in | > 36 mesi (limita repricing) |
| Canone vs media | Canone rispetto alla media portafoglio | < 60% della media (sotto costo) |
| Clausole uso dati | Permessi concessi al cliente sui dati | Restrizioni eccessive o permessi troppo ampi |
| Clausole di esclusiva | Vincoli di esclusività | Presenti e limitanti |
| Clausole di responsabilità | Limitazioni di responsabilità del fornitore | Assenti o troppo ampie |
| Clausole di rinnovo | Condizioni di rinnovo automatico | Assenti (rischio non-rinnovo silenzioso) |

**Backend — Nuovo endpoint:**

```
POST /api/v1/contracts/risk-analysis
```

**Request body:**
```json
{
  "contract_data": {
    "prodotto": "Freader",
    "testo_originale": "testo completo del contratto...",
    "anagrafica": { ... },
    "dettagli_contratto": { ... },
    "sla": { ... },
    "commerciale_freader": { ... }
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "risk_score": 72,
    "errori_ortografici": [
      { "posizione": "Art. 3.2", "originale": "servzio", "corretto": "servizio" }
    ],
    "punti_critici": [
      {
        "id": "pc_001",
        "sezione": "SLA — Tetto Crediti",
        "gravita": "alta",
        "valore_attuale": "20%",
        "valore_riferimento": "12% (media portafoglio)",
        "spiegazione": "Il tetto crediti al 20% espone l'azienda a rimborsi fino a €2.000/trimestre. La media del portafoglio è 12%. Questo cliente ha negoziato condizioni significativamente più favorevoli rispetto agli altri.",
        "testo_contratto_originale": "Art. 5.3 — In caso di mancato rispetto degli SLA, il Cliente ha diritto a un credito massimo pari al 20% del canone trimestrale.",
        "testo_migliorato": null
      }
    ]
  }
}
```

**Implementazione AI:** Nuova funzione `analyze_contract_risk(contract_data, testo_originale)` in `ai_service.py` che:
1. Riceve i dati strutturati + testo originale
2. Confronta ogni metrica con le soglie standard
3. Chiede all'LLM di analizzare le clausole testuali per rischi non numerici (uso dati, esclusiva, responsabilità, rinnovo)
4. Chiede all'LLM di trovare errori ortografici nel testo
5. Calcola il risk_score come media pesata (gravità alta = peso 3, media = peso 2, bassa = peso 1)

#### 2.3 — Lista Punti Critici con Popup

**Frontend — Componente `RiskAnalysisStep.jsx`:**

- In alto: 3 KPI card (Risk Score, Punti Critici, Errori Ortografici)
- Sotto: lista scrollabile dei punti critici
- Ogni punto critico è una riga cliccabile che si espande in un popup/drawer con:
  - Spiegazione dettagliata del perché è critico
  - Testo originale del contratto (evidenziato)
  - Campo di testo per modifica manuale
  - Tasto "Migliora" → chiama l'AI per riscrivere la clausola
  - Tasto "Salva modifica" → salva nel state locale

#### 2.4 — Tasto "Migliora" (AI Rewrite)

Quando l'utente clicca "Migliora" su un punto critico, il frontend chiama:

```
POST /api/v1/contracts/improve-clause
```

**Request:**
```json
{
  "clausola_originale": "Art. 5.3 — In caso di mancato rispetto degli SLA, il Cliente ha diritto a un credito massimo pari al 20% del canone trimestrale.",
  "tipo_problema": "tetto_crediti_alto",
  "contesto_contratto": "Freader, canone €10.000/trim",
  "valore_riferimento": "12%"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "clausola_migliorata": "Art. 5.3 — In caso di mancato rispetto degli SLA, il Cliente ha diritto a un credito massimo pari al 12% del canone trimestrale, calcolato proporzionalmente ai giorni di disservizio effettivo.",
    "motivazione": "Ridotto il tetto dal 20% al 12% (media portafoglio). Aggiunta proporzionalità per limitare ulteriormente l'esposizione."
  }
}
```

**Vincoli AI:** Il miglioramento deve:
- Rimanere nel contesto legale corretto
- Non fare richieste irrealistiche
- Proporre termini ragionevoli basati sulle medie del portafoglio
- Mantenere il tono formale del contratto originale

#### 2.5 — Tasto "FINE" e Salvataggio Modifiche

Alla fine della lista dei punti critici, un tasto "FINE" che:
1. Raccoglie tutte le modifiche (manuali + AI) salvate dall'utente
2. Passa allo Step 3 (confronto prima/dopo)

Le modifiche non salvate vengono ignorate. Solo i punti critici dove l'utente ha cliccato "Salva modifica" vengono considerati.

---

### Step 3 — Confronto KPI Prima/Dopo

**Pagina che mostra side-by-side:**

| KPI | Prima (originale) | Dopo (con modifiche) | Delta |
|-----|-------------------|---------------------|-------|
| Risk Score | 72% | 38% | -34% ↓ |
| Punti Critici | 6 | 2 | -4 ↓ |
| Errori Ortografici | 3 | 0 | -3 ↓ |
| Tetto Crediti | 20% | 12% | -8% ↓ |
| Esposizione stimata | €8.000/anno | €4.800/anno | -€3.200 ↓ |

**Backend:** Nuovo endpoint che ricalcola i KPI con i dati modificati:

```
POST /api/v1/contracts/recalculate-risk
```

**Request:** I dati del contratto con le clausole modificate applicate.
**Response:** Stessa struttura di `/risk-analysis` ma con i nuovi valori.

**Frontend — Componente `RiskComparisonStep.jsx`:**
- Tabella comparativa con colori (verde = migliorato, rosso = peggiorato)
- Tasto "Salva contratto" → procede al salvataggio finale nel DB
- Tasto "Torna indietro" → torna allo Step 2 per ulteriori modifiche

---

## 2. Sezione Re-Pricing

### Descrizione

Nuova sezione nella sidebar dedicata ai contratti in scadenza entro 20 giorni che necessitano di rinegoziazione del prezzo al rinnovo. L'obiettivo è proporre aumenti di pricing calibrati sulla "apertura" del cliente (quanto è restrittivo nelle clausole attuali).

### Logica di Re-Pricing

**Indice di Confidenza Cliente (0-100):**

Calcolato analizzando le clausole del contratto attuale:

| Fattore | Peso | Logica |
|---------|------|--------|
| Tetto crediti SLA | 25% | Basso (≤10%) = alta confidenza, Alto (>15%) = bassa |
| Credito uptime | 20% | Basso (≤5%) = alta confidenza |
| Credito ticketing | 15% | Basso (≤5%) = alta confidenza |
| Preavviso disdetta | 15% | Lungo (>60gg) = alta confidenza (cliente stabile) |
| Durata contratto | 15% | Lunga (>24 mesi) = alta confidenza |
| Clausole restrittive | 10% | Poche = alta confidenza |

**Confidenza alta (70-100):** Cliente "aperto", poche clausole restrittive → re-pricing aggressivo possibile
**Confidenza media (40-69):** Cliente equilibrato → re-pricing moderato
**Confidenza bassa (0-39):** Cliente con molte clausole limitanti → re-pricing leggero per evitare la perdita

### Fasce di Re-Pricing Proposte

Per ogni contratto in scadenza, il sistema propone 3 fasce:

| Fascia | Confidenza alta | Confidenza media | Confidenza bassa |
|--------|----------------|-----------------|-----------------|
| Conservativa | +5% canone | +3% canone | +1% canone |
| Raccomandata | +12% canone | +7% canone | +3% canone |
| Aggressiva | +20% canone | +12% canone | +5% canone |

Le percentuali vengono anche influenzate da:
- **Aumento costi mercato:** Se i costi aziendali sono aumentati (energia, personale, infrastruttura), il re-pricing minimo deve coprire almeno il delta costi
- **Allineamento portafoglio:** Se il canone attuale è sotto la media del portafoglio per lo stesso prodotto, il re-pricing punta ad avvicinarlo alla media
- **Domanda interna:** Se il prodotto ha alta domanda (molti nuovi clienti), il potere negoziale aumenta

### KPI di Impatto

Per ogni proposta di re-pricing, mostrare:

| KPI | Descrizione |
|-----|-------------|
| Delta Revenue Annuo | Quanto fatturato in più se accettata (canone_nuovo - canone_attuale) × 4 |
| Margine Incrementale | Delta revenue - costi aggiuntivi stimati |
| Probabilità Accettazione | Basata sull'indice di confidenza (alta confidenza = alta probabilità per fascia conservativa) |
| Revenue a Rischio | Fatturato annuo attuale del cliente (se lo perdiamo) |
| ROI Rinegoziazione | Delta revenue / Revenue a rischio × 100 |

### Backend — Nuovo endpoint

```
GET /api/repricing
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "contract_id": "uuid-xxx",
      "cliente": "Azienda XYZ",
      "prodotto": "Freader",
      "canone_attuale": 7000,
      "giorni_scadenza": 15,
      "scadenza": "12/04/2026",
      "indice_confidenza": 78,
      "confidenza_label": "alta",
      "fattori_confidenza": {
        "tetto_crediti": { "valore": 10, "score": 90 },
        "credito_uptime": { "valore": 5, "score": 85 },
        "preavviso": { "valore": 60, "score": 75 },
        "durata": { "valore": 24, "score": 80 }
      },
      "proposte": [
        {
          "fascia": "conservativa",
          "percentuale": 5,
          "nuovo_canone": 7350,
          "delta_revenue_annuo": 1400,
          "probabilita_accettazione": 92
        },
        {
          "fascia": "raccomandata",
          "percentuale": 12,
          "nuovo_canone": 7840,
          "delta_revenue_annuo": 3360,
          "probabilita_accettazione": 75
        },
        {
          "fascia": "aggressiva",
          "percentuale": 20,
          "nuovo_canone": 8400,
          "delta_revenue_annuo": 5600,
          "probabilita_accettazione": 55
        }
      ],
      "motivazioni": [
        "Canone attuale sotto media portafoglio (€8.500/trim)",
        "Costi infrastruttura aumentati del 8% YoY",
        "Cliente con basso tetto crediti (10%) — buona apertura"
      ],
      "revenue_a_rischio": 28000
    }
  ]
}
```

**Implementazione backend:** Nuova funzione in `dashboard_routes.py` che:
1. Recupera tutti i contratti con scadenza ≤ 20 giorni dal DB
2. Per ognuno calcola l'indice di confidenza dai dati della versione più recente
3. Calcola le 3 fasce di re-pricing
4. Calcola i KPI di impatto
5. Ordina per urgenza (giorni_scadenza crescente)

### Frontend — Componente `RepricingView.jsx`

**Layout:**
- Header con KPI aggregati: totale contratti da rinegoziare, revenue totale a rischio, delta revenue potenziale (se tutte le proposte raccomandate vengono accettate)
- Lista card per ogni contratto, ognuna con:
  - Info cliente (nome, prodotto, canone attuale, giorni alla scadenza)
  - Gauge indice di confidenza
  - 3 card per le 3 fasce di re-pricing con: nuovo canone, delta revenue, probabilità accettazione
  - Lista motivazioni
  - Badge "Revenue a rischio" in rosso

**Sidebar:** Nuova voce "Re-Pricing" con icona e badge con il conteggio dei contratti da rinegoziare.

---

## 3. Riepilogo Nuovi Endpoint API

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/v1/contracts/risk-analysis` | Analisi rischio con punti critici ed errori ortografici |
| POST | `/api/v1/contracts/improve-clause` | AI riscrive una clausola critica |
| POST | `/api/v1/contracts/recalculate-risk` | Ricalcola KPI rischio con modifiche applicate |
| GET | `/api/repricing` | Lista contratti in scadenza con proposte re-pricing |

## 4. Riepilogo Nuovi Componenti React

| Componente | Posizione | Descrizione |
|------------|-----------|-------------|
| `ContractReviewStep.jsx` | `src/components/upload/` | Step 1 — Dati estratti in 4 sezioni editabili |
| `RiskAnalysisStep.jsx` | `src/components/upload/` | Step 2 — 3 KPI + lista punti critici con popup |
| `CriticalPointPopup.jsx` | `src/components/upload/` | Popup singolo punto critico con modifica + migliora |
| `RiskComparisonStep.jsx` | `src/components/upload/` | Step 3 — Confronto KPI prima/dopo |
| `RepricingView.jsx` | `src/components/views/` | Sezione re-pricing con proposte per contratti in scadenza |

## 5. Modifiche a Componenti Esistenti

| Componente | Modifica |
|------------|----------|
| `UploadView.jsx` | Aggiungere Step 2 (Risk Analysis) e Step 3 (Confronto) al flusso |
| `PipelineSteps.jsx` | Aggiornare da 3 a 5 step visivi |
| `Sidebar.jsx` | Aggiungere voce "Re-Pricing" con badge conteggio |
| `App.jsx` | Aggiungere route per `RepricingView` |

## 6. Modifiche Backend

| File | Modifica |
|------|----------|
| `ai_service.py` | Aggiungere `analyze_contract_risk()` e `improve_clause()` |
| `contracts_routes.py` | Aggiungere 3 nuovi endpoint (risk-analysis, improve-clause, recalculate-risk) |
| `dashboard_routes.py` | Aggiungere endpoint `/api/repricing` |
