"""
Contract Intelligence — Backend API (Flask)
Serves contract data, cost analysis, KPIs, and client ratings.
"""
import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
from math import ceil

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'frontend')
app = Flask(__name__, static_folder=FRONTEND_DIR)
CORS(app)


@app.route('/')
def serve_index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)

# ──────────────────────────────────────────────
# DATA — Prodotto 1 (Freader)
# ──────────────────────────────────────────────
PRODOTTO1 = [
    dict(cliente="Ciao",sede="Milano",canone_trim=10000,prezzo_f1=12,prezzo_f2=10,prezzo_f3=9,credito_uptime=10,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="20/03/2025"),
    dict(cliente="Hello",sede="Roma",canone_trim=5000,prezzo_f1=20,prezzo_f2=16,prezzo_f3=12,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="20/07/2025"),
    dict(cliente="Hola",sede="Milano",canone_trim=10000,prezzo_f1=13,prezzo_f2=11,prezzo_f3=10,credito_uptime=10,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="20/08/2025"),
    dict(cliente="Bonjour",sede="Roma",canone_trim=7000,prezzo_f1=15,prezzo_f2=14,prezzo_f3=13,credito_uptime=7,credito_ticketing=6,tetto_cred=10,durata_mesi=36,preavviso_gg=30,data_firma="30/12/2024"),
    dict(cliente="Hallo",sede="Torino",canone_trim=10000,prezzo_f1=13,prezzo_f2=11,prezzo_f3=10,credito_uptime=10,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=60,data_firma="20/10/2025"),
    dict(cliente="Ola",sede="Bologna",canone_trim=10000,prezzo_f1=12,prezzo_f2=10,prezzo_f3=8,credito_uptime=7,credito_ticketing=10,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="14/04/2025"),
    dict(cliente="Salut",sede="Napoli",canone_trim=10000,prezzo_f1=14,prezzo_f2=12,prezzo_f3=11,credito_uptime=5,credito_ticketing=6,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="27/02/2025"),
    dict(cliente="Ahoj",sede="Milano",canone_trim=7000,prezzo_f1=15,prezzo_f2=13,prezzo_f3=12,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=24,preavviso_gg=12,data_firma="19/12/2024"),
    dict(cliente="Dobrý den",sede="Roma",canone_trim=7000,prezzo_f1=15,prezzo_f2=12,prezzo_f3=10,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=24,preavviso_gg=30,data_firma="04/04/2024"),
    dict(cliente="Szia",sede="Firenze",canone_trim=7000,prezzo_f1=16,prezzo_f2=14,prezzo_f3=13,credito_uptime=5,credito_ticketing=8,tetto_cred=12,durata_mesi=22,preavviso_gg=30,data_firma="06/06/2025"),
    dict(cliente="Hej",sede="Genova",canone_trim=5000,prezzo_f1=20,prezzo_f2=18,prezzo_f3=14,credito_uptime=7,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="07/08/2025"),
    dict(cliente="Merhaba",sede="Verona",canone_trim=5000,prezzo_f1=18,prezzo_f2=16,prezzo_f3=15,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="06/07/2025"),
    dict(cliente="Selam",sede="Padova",canone_trim=5000,prezzo_f1=19,prezzo_f2=17,prezzo_f3=16,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=6,preavviso_gg=30,data_firma="07/08/2025"),
    dict(cliente="Bok",sede="Brescia",canone_trim=7000,prezzo_f1=16,prezzo_f2=14,prezzo_f3=13,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="06/05/2025"),
    dict(cliente="Zdravo",sede="Milano",canone_trim=7000,prezzo_f1=15,prezzo_f2=13,prezzo_f3=12,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="09/09/2025"),
    dict(cliente="Buna",sede="Roma",canone_trim=5000,prezzo_f1=17,prezzo_f2=14,prezzo_f3=13,credito_uptime=8,credito_ticketing=5,tetto_cred=13,durata_mesi=36,preavviso_gg=120,data_firma="12/12/2024"),
    dict(cliente="Alo",sede="Torino",canone_trim=7000,prezzo_f1=14,prezzo_f2=12,prezzo_f3=11,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30,data_firma="04/04/2025"),
    dict(cliente="Labas",sede="Bologna",canone_trim=7000,prezzo_f1=12,prezzo_f2=9,prezzo_f3=8,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=8,preavviso_gg=30,data_firma="01/01/2026"),
    dict(cliente="Sveiki",sede="Napoli",canone_trim=7000,prezzo_f1=16,prezzo_f2=14,prezzo_f3=13,credito_uptime=9,credito_ticketing=5,tetto_cred=12,durata_mesi=18,preavviso_gg=90,data_firma="05/02/2025"),
    dict(cliente="Tere",sede="Modena",canone_trim=10000,prezzo_f1=13,prezzo_f2=10,prezzo_f3=6,credito_uptime=5,credito_ticketing=10,tetto_cred=12,durata_mesi=12,preavviso_gg=30,data_firma="12/05/2024"),
]


# ──────────────────────────────────────────────
# DATA — Prodotto 2 (CutAI)
# ──────────────────────────────────────────────
PRODOTTO2 = [
    dict(cliente="Buonasera",sede="Milano",data_firma="12/01/2025",canone_trim=1000,utenti_inclusi=70,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=30),
    dict(cliente="Buenasera",sede="Roma",data_firma="27/04/2025",canone_trim=3000,utenti_inclusi=100,fee_extra=20,profilo="Premium",soglia_uptime=99,credito_uptime=10,credito_ticketing=5,tetto_cred=15,durata_mesi=24,preavviso_gg=60),
    dict(cliente="Bonsoir",sede="Torino",data_firma="09/05/2025",canone_trim=15000,utenti_inclusi=70,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=4,tetto_cred=9,durata_mesi=24,preavviso_gg=45),
    dict(cliente="Good evening",sede="Milano",data_firma="21/05/2025",canone_trim=15000,utenti_inclusi=80,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=24,preavviso_gg=60),
    dict(cliente="Guten Abend",sede="Napoli",data_firma="03/06/2025",canone_trim=2000,utenti_inclusi=50,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=4,tetto_cred=9,durata_mesi=12,preavviso_gg=60),
    dict(cliente="Boa noite",sede="Bologna",data_firma="18/06/2025",canone_trim=3000,utenti_inclusi=60,fee_extra=30,profilo="Premium",soglia_uptime=99,credito_uptime=15,credito_ticketing=5,tetto_cred=20,durata_mesi=24,preavviso_gg=60),
    dict(cliente="Buna seara",sede="Roma",data_firma="07/07/2025",canone_trim=2000,utenti_inclusi=80,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=4,tetto_cred=9,durata_mesi=12,preavviso_gg=60),
    dict(cliente="Dobra vecer",sede="Firenze",data_firma="22/07/2025",canone_trim=1500,utenti_inclusi=60,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=4,tetto_cred=9,durata_mesi=12,preavviso_gg=60),
    dict(cliente="Dobar vecer",sede="Milano",data_firma="11/08/2025",canone_trim=1500,utenti_inclusi=80,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=4,tetto_cred=9,durata_mesi=12,preavviso_gg=60),
    dict(cliente="Labas vakaras",sede="Genova",data_firma="29/08/2025",canone_trim=4000,utenti_inclusi=90,fee_extra=20,profilo="Premium",soglia_uptime=99,credito_uptime=15,credito_ticketing=5,tetto_cred=20,durata_mesi=12,preavviso_gg=30),
    dict(cliente="Labvakar",sede="Verona",data_firma="14/09/2025",canone_trim=1200,utenti_inclusi=80,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=4,tetto_cred=9,durata_mesi=36,preavviso_gg=60),
    dict(cliente="Tere ohtust",sede="Milano",data_firma="30/09/2025",canone_trim=1200,utenti_inclusi=80,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=4,tetto_cred=9,durata_mesi=12,preavviso_gg=45),
    dict(cliente="Hyvaa iltaa",sede="Padova",data_firma="12/10/2025",canone_trim=3500,utenti_inclusi=60,fee_extra=35,profilo="Premium",soglia_uptime=99,credito_uptime=15,credito_ticketing=5,tetto_cred=20,durata_mesi=12,preavviso_gg=60),
    dict(cliente="God kveld",sede="Bari",data_firma="26/10/2025",canone_trim=1000,utenti_inclusi=40,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=6,tetto_cred=11,durata_mesi=12,preavviso_gg=60),
    dict(cliente="God aften",sede="Roma",data_firma="08/11/2025",canone_trim=2800,utenti_inclusi=40,fee_extra=30,profilo="Premium",soglia_uptime=99,credito_uptime=15,credito_ticketing=5,tetto_cred=20,durata_mesi=12,preavviso_gg=60),
    dict(cliente="God kvall",sede="Venezia",data_firma="24/11/2025",canone_trim=1800,utenti_inclusi=60,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=4,tetto_cred=9,durata_mesi=12,preavviso_gg=30),
    dict(cliente="Yaxsam xeyir",sede="Catania",data_firma="10/12/2025",canone_trim=1500,utenti_inclusi=65,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=10,credito_ticketing=5,tetto_cred=15,durata_mesi=24,preavviso_gg=60),
    dict(cliente="Dobry vecer",sede="Milano",data_firma="21/12/2025",canone_trim=1500,utenti_inclusi=38,fee_extra=35,profilo="Premium",soglia_uptime=99,credito_uptime=15,credito_ticketing=5,tetto_cred=20,durata_mesi=12,preavviso_gg=30),
    dict(cliente="Pryjemnyj vecir",sede="Modena",data_firma="05/01/2026",canone_trim=1500,utenti_inclusi=65,fee_extra=20,profilo="Standard",soglia_uptime=98,credito_uptime=5,credito_ticketing=5,tetto_cred=10,durata_mesi=12,preavviso_gg=60),
    dict(cliente="Kalispera",sede="Palermo",data_firma="19/01/2026",canone_trim=2000,utenti_inclusi=50,fee_extra=35,profilo="Premium",soglia_uptime=99,credito_uptime=15,credito_ticketing=5,tetto_cred=20,durata_mesi=12,preavviso_gg=30),
]

# ──────────────────────────────────────────────
# COSTI
# ──────────────────────────────────────────────
COSTI = {
    "prodotto1": {
        "fissi": [
            dict(voce="Licenza infrastruttura cloud",importo=18000,tipo="indiretto"),
            dict(voce="Stipendi team sviluppo",importo=120000,tipo="diretto"),
            dict(voce="Affitto ufficio",importo=24000,tipo="indiretto"),
            dict(voce="Ammortamento server",importo=15000,tipo="indiretto"),
            dict(voce="Assicurazione",importo=6000,tipo="indiretto"),
        ],
        "variabili": [
            dict(voce="Costo elaborazione pagine",importo=0.03,unita="€/pagina",volume=500000,tipo="diretto"),
            dict(voce="Supporto clienti (ticket)",importo=8,unita="€/ticket",volume=1200,tipo="diretto"),
            dict(voce="Commissioni pagamento",importo=0.5,unita="% fatturato",volume=0,tipo="indiretto"),
            dict(voce="Marketing digitale",importo=3000,unita="€/mese",volume=0,tipo="indiretto"),
            dict(voce="Formazione clienti",importo=500,unita="€/cliente",volume=20,tipo="diretto"),
        ],
    },
    "prodotto2": {
        "fissi": [
            dict(voce="Licenza AI engine",importo=25000,tipo="indiretto"),
            dict(voce="Stipendi team AI/ML",importo=150000,tipo="diretto"),
            dict(voce="Affitto ufficio (quota)",importo=12000,tipo="indiretto"),
            dict(voce="Ammortamento GPU cluster",importo=30000,tipo="indiretto"),
            dict(voce="Certificazioni sicurezza",importo=8000,tipo="indiretto"),
        ],
        "variabili": [
            dict(voce="Costo computazione AI",importo=2.5,unita="€/utente/mese",volume=1400,tipo="diretto"),
            dict(voce="Supporto clienti (ticket)",importo=12,unita="€/ticket",volume=800,tipo="diretto"),
            dict(voce="Commissioni pagamento",importo=0.5,unita="% fatturato",volume=0,tipo="indiretto"),
            dict(voce="Marketing digitale",importo=4000,unita="€/mese",volume=0,tipo="indiretto"),
            dict(voce="Onboarding clienti",importo=800,unita="€/cliente",volume=20,tipo="diretto"),
        ],
    },
}

TODAY = datetime(2026, 3, 28)


# ──────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────
def parse_date(s):
    d, m, y = map(int, s.split("/"))
    return datetime(y, m, d)

def scadenza(data_firma, durata_mesi):
    d = parse_date(data_firma)
    m = d.month - 1 + durata_mesi
    y = d.year + m // 12
    m = m % 12 + 1
    day = min(d.day, [31,29 if y%4==0 else 28,31,30,31,30,31,31,30,31,30,31][m-1])
    return datetime(y, m, day)

def giorni_scadenza(data_firma, durata_mesi):
    return (scadenza(data_firma, durata_mesi) - TODAY).days

def enrich(c, prodotto):
    sc = scadenza(c["data_firma"], c["durata_mesi"])
    gg = (sc - TODAY).days
    return {**c, "prodotto": prodotto, "scadenza": sc.strftime("%d/%m/%Y"), "giorni_scadenza": gg, "fatturato_annuo": c["canone_trim"] * 4}

def all_contracts():
    out = []
    for c in PRODOTTO1:
        out.append(enrich(c, "Freader"))
    for c in PRODOTTO2:
        out.append(enrich(c, "CutAI"))
    return out

def calc_cost(key):
    c = COSTI[key]
    tot_fissi = sum(x["importo"] for x in c["fissi"])
    tot_var = 0
    for x in c["variabili"]:
        if x["volume"]:
            tot_var += x["importo"] * x["volume"]
        elif x["unita"] == "€/mese":
            tot_var += x["importo"] * 12
        else:
            tot_var += x["importo"]
    all_items = c["fissi"] + c["variabili"]
    tot_dir = 0
    tot_ind = 0
    for x in all_items:
        val = x["importo"]
        if "volume" in x and x.get("volume"):
            val = x["importo"] * x["volume"]
        elif x.get("unita") == "€/mese":
            val = x["importo"] * 12
        if x["tipo"] == "diretto":
            tot_dir += val
        else:
            tot_ind += val
    n = len(PRODOTTO1) if key == "prodotto1" else len(PRODOTTO2)
    costo_tot = tot_dir + tot_ind
    costo_unit_trad = costo_tot / n
    abc = [
        dict(nome="Gestione infrastruttura", driver="n. contratti", pool=round(tot_ind * 0.4, 2)),
        dict(nome="Supporto clienti", driver="n. ticket", pool=round(tot_ind * 0.3, 2)),
        dict(nome="Amministrazione", driver="n. contratti", pool=round(tot_ind * 0.2, 2)),
        dict(nome="Marketing", driver="fatturato", pool=round(tot_ind * 0.1, 2)),
    ]
    costo_unit_abc = (tot_dir + sum(a["pool"] / n for a in abc) * n) / n
    return dict(
        tot_fissi=tot_fissi, tot_variabili=round(tot_var,2),
        tot_diretti=round(tot_dir,2), tot_indiretti=round(tot_ind,2),
        costo_totale=round(costo_tot,2), costo_unit_trad=round(costo_unit_trad,2),
        costo_unit_abc=round(costo_unit_abc,2), n_contratti=n,
        abc=abc, fissi=c["fissi"], variabili=c["variabili"],
    )

def analyze_contract(c, all_c):
    same = [x for x in all_c if x["prodotto"] == c["prodotto"]]
    avg = sum(x["canone_trim"] for x in same) / len(same)
    issues = []
    if c["credito_uptime"] >= 10:
        issues.append(dict(sezione="Crediti Uptime", gravita="alta", desc=f"Credito uptime {c['credito_uptime']}% molto alto. Rischio rimborsi elevati."))
    elif c["credito_uptime"] >= 7:
        issues.append(dict(sezione="Crediti Uptime", gravita="media", desc=f"Credito uptime {c['credito_uptime']}% sopra la media. Monitorare SLA."))
    if c["credito_ticketing"] >= 8:
        issues.append(dict(sezione="Crediti Ticketing", gravita="alta", desc=f"Credito ticketing {c['credito_ticketing']}% molto elevato. Clausola penalizzante."))
    elif c["credito_ticketing"] >= 6:
        issues.append(dict(sezione="Crediti Ticketing", gravita="media", desc=f"Credito ticketing {c['credito_ticketing']}% sopra la norma."))
    if c["tetto_cred"] >= 15:
        issues.append(dict(sezione="Tetto Crediti", gravita="alta", desc=f"Tetto crediti {c['tetto_cred']}% molto alto. Esposizione finanziaria significativa."))
    elif c["tetto_cred"] >= 12:
        issues.append(dict(sezione="Tetto Crediti", gravita="media", desc=f"Tetto crediti {c['tetto_cred']}% sopra la media del portafoglio."))
    if c["canone_trim"] < avg * 0.6:
        pct = round(c["canone_trim"] / avg * 100)
        issues.append(dict(sezione="Canone", gravita="alta", desc=f"Canone è il {pct}% della media. Potrebbe non coprire i costi."))
    elif c["canone_trim"] < avg * 0.8:
        issues.append(dict(sezione="Canone", gravita="media", desc="Canone sotto la media. Valutare rinegoziazione al rinnovo."))
    if c["durata_mesi"] >= 36:
        issues.append(dict(sezione="Durata", gravita="media", desc=f"Contratto a lungo termine ({c['durata_mesi']} mesi). Limita flessibilità di repricing."))
    if c["preavviso_gg"] >= 90:
        issues.append(dict(sezione="Preavviso", gravita="media", desc=f"Preavviso di {c['preavviso_gg']} giorni. Vincolo operativo elevato."))
    if c["preavviso_gg"] <= 15:
        issues.append(dict(sezione="Preavviso", gravita="alta", desc=f"Preavviso di soli {c['preavviso_gg']} giorni. Rischio churn improvviso."))
    gg = c["giorni_scadenza"]
    if gg <= 0:
        issues.append(dict(sezione="Scadenza", gravita="alta", desc=f"Contratto SCADUTO da {abs(gg)} giorni."))
    elif gg <= 30:
        issues.append(dict(sezione="Scadenza", gravita="alta", desc=f"Scadenza tra {gg} giorni. Azione immediata."))
    elif gg <= 90:
        issues.append(dict(sezione="Scadenza", gravita="media", desc=f"Scadenza tra {gg} giorni. Pianificare rinnovo."))
    if not issues:
        issues.append(dict(sezione="Generale", gravita="bassa", desc="Nessuna criticità. Contratto in linea con il portafoglio."))
    return issues

def rate_client(c, all_c):
    score = 50
    mx = max(x["canone_trim"] for x in all_c)
    score += (c["canone_trim"] / mx) * 20
    if c["credito_uptime"] <= 5: score += 10
    elif c["credito_uptime"] <= 7: score += 5
    if c["credito_ticketing"] <= 5: score += 5
    if c["tetto_cred"] <= 10: score += 5
    if c["durata_mesi"] >= 24: score += 10
    elif c["durata_mesi"] >= 12: score += 5
    if c["giorni_scadenza"] > 180: score += 5
    elif c["giorni_scadenza"] <= 0: score -= 10
    if 30 <= c["preavviso_gg"] <= 60: score += 3
    return min(100, max(0, round(score)))


# ──────────────────────────────────────────────
# API ROUTES
# ──────────────────────────────────────────────
@app.route("/api/contracts")
def api_contracts():
    return jsonify(all_contracts())

@app.route("/api/contracts/<int:idx>")
def api_contract_detail(idx):
    ac = all_contracts()
    if idx < 0 or idx >= len(ac):
        return jsonify({"error": "not found"}), 404
    c = ac[idx]
    return jsonify({"contract": c, "issues": analyze_contract(c, ac)})

@app.route("/api/contracts/<int:idx>", methods=["PATCH"])
def api_contract_update(idx):
    ac = all_contracts()
    if idx < 0 or idx >= len(ac):
        return jsonify({"error": "not found"}), 404
    c = ac[idx]
    data = request.get_json()
    # Determine which source list to update
    if c["prodotto"] == "Freader":
        src = PRODOTTO1
        local_idx = idx
    else:
        src = PRODOTTO2
        local_idx = idx - len(PRODOTTO1)
    # Update allowed fields
    allowed = {"canone_trim","credito_uptime","credito_ticketing","tetto_cred",
               "durata_mesi","preavviso_gg","sede","prezzo_f1","prezzo_f2","prezzo_f3",
               "utenti_inclusi","fee_extra","profilo"}
    for k, v in data.items():
        if k in allowed:
            # Cast numeric fields
            if k in {"canone_trim","credito_uptime","credito_ticketing","tetto_cred",
                      "durata_mesi","preavviso_gg","prezzo_f1","prezzo_f2","prezzo_f3",
                      "utenti_inclusi","fee_extra"}:
                v = float(v) if '.' in str(v) else int(v)
            src[local_idx][k] = v
    # Return updated
    ac2 = all_contracts()
    c2 = ac2[idx]
    return jsonify({"contract": c2, "issues": analyze_contract(c2, ac2)})

@app.route("/api/map-data")
def api_map_data():
    """Returns contract count per city with approximate lat/lng for Italian map."""
    COORDS = {
        "Milano":(45.46,9.19),"Roma":(41.90,12.50),"Torino":(45.07,7.69),
        "Bologna":(44.49,11.34),"Napoli":(40.85,14.27),"Firenze":(43.77,11.25),
        "Genova":(44.41,8.93),"Verona":(45.44,10.99),"Padova":(45.41,11.88),
        "Brescia":(45.54,10.21),"Modena":(44.65,10.92),"Bari":(41.12,16.87),
        "Venezia":(45.44,12.32),"Catania":(37.50,15.09),"Palermo":(38.12,13.36),
    }
    ac = all_contracts()
    cities = {}
    for c in ac:
        s = c["sede"]
        if s not in cities:
            lat, lng = COORDS.get(s, (42.0, 12.0))
            cities[s] = {"citta": s, "lat": lat, "lng": lng, "count": 0, "contratti": []}
        cities[s]["count"] += 1
        cities[s]["contratti"].append({"cliente": c["cliente"], "prodotto": c["prodotto"]})
    return jsonify(list(cities.values()))

@app.route("/api/costs/<key>")
def api_costs(key):
    if key == "totale":
        c1 = calc_cost("prodotto1")
        c2 = calc_cost("prodotto2")
        n_tot = c1["n_contratti"] + c2["n_contratti"]
        merged = dict(
            tot_fissi=c1["tot_fissi"]+c2["tot_fissi"],
            tot_variabili=round(c1["tot_variabili"]+c2["tot_variabili"],2),
            tot_diretti=round(c1["tot_diretti"]+c2["tot_diretti"],2),
            tot_indiretti=round(c1["tot_indiretti"]+c2["tot_indiretti"],2),
            costo_totale=round(c1["costo_totale"]+c2["costo_totale"],2),
            costo_unit_trad=round((c1["costo_totale"]+c2["costo_totale"])/n_tot,2),
            n_contratti=n_tot,
            fissi=c1["fissi"]+c2["fissi"],
            variabili=c1["variabili"]+c2["variabili"],
            costo_prodotto_freader=c1["costo_totale"],
            costo_prodotto_cutai=c2["costo_totale"],
        )
        return jsonify(merged)
    if key not in COSTI:
        return jsonify({"error": "invalid product"}), 400
    d = calc_cost(key)
    # Add costo per prodotto
    ac = all_contracts()
    prod_name = "Freader" if key == "prodotto1" else "CutAI"
    prod_contracts = [c for c in ac if c["prodotto"] == prod_name]
    fatt = sum(c["fatturato_annuo"] for c in prod_contracts)
    d["fatturato_prodotto"] = fatt
    d["costo_per_prodotto"] = round(d["costo_totale"], 2)
    d["margine_prodotto"] = round(fatt - d["costo_totale"], 2)
    return jsonify(d)

@app.route("/api/kpi")
def api_kpi():
    ac = all_contracts()
    p1 = [c for c in ac if c["prodotto"] == "Freader"]
    p2 = [c for c in ac if c["prodotto"] == "CutAI"]
    fatt_p1 = sum(c["fatturato_annuo"] for c in p1)
    fatt_p2 = sum(c["fatturato_annuo"] for c in p2)
    fatt_tot = fatt_p1 + fatt_p2
    c1 = calc_cost("prodotto1")
    c2 = calc_cost("prodotto2")
    costi_p1 = c1["costo_totale"]
    costi_p2 = c2["costo_totale"]
    costi_tot = costi_p1 + costi_p2
    marg_p1 = fatt_p1 - costi_p1
    marg_p2 = fatt_p2 - costi_p2
    margine = fatt_tot - costi_tot
    margine_pct = round(margine / fatt_tot * 100, 1) if fatt_tot else 0
    avg_fatt = fatt_tot / len(ac) if ac else 0
    fissi_tot = c1["tot_fissi"] + c2["tot_fissi"]
    var_per_c = (c1["tot_variabili"] + c2["tot_variabili"]) / len(ac) if ac else 0
    denom = avg_fatt - var_per_c
    bep_c = ceil(fissi_tot / denom) if denom > 0 else 0
    bep_eur = round(bep_c * avg_fatt, 2)
    attivi = sum(1 for c in ac if c["giorni_scadenza"] > 0)
    scaduti = sum(1 for c in ac if c["giorni_scadenza"] <= 0)
    in_scad = sum(1 for c in ac if 0 < c["giorni_scadenza"] <= 90)
    attivi_p1 = sum(1 for c in p1 if c["giorni_scadenza"] > 0)
    attivi_p2 = sum(1 for c in p2 if c["giorni_scadenza"] > 0)
    return jsonify(dict(
        fatturato_totale=fatt_tot, fatturato_freader=fatt_p1, fatturato_cutai=fatt_p2,
        fatt_pct_freader=round(fatt_p1/fatt_tot*100,1) if fatt_tot else 0,
        fatt_pct_cutai=round(fatt_p2/fatt_tot*100,1) if fatt_tot else 0,
        costi_freader=round(costi_p1,2), costi_cutai=round(costi_p2,2),
        margine_totale=round(margine,2), margine_freader=round(marg_p1,2), margine_cutai=round(marg_p2,2),
        margine_pct=margine_pct,
        margine_pct_freader=round(marg_p1/fatt_p1*100,1) if fatt_p1 else 0,
        margine_pct_cutai=round(marg_p2/fatt_p2*100,1) if fatt_p2 else 0,
        bep_contratti=bep_c, bep_euro=bep_eur,
        totale_contratti=len(ac), attivi=attivi, scaduti=scaduti, in_scadenza_90=in_scad,
        contratti_freader=len(p1), contratti_cutai=len(p2),
        attivi_freader=attivi_p1, attivi_cutai=attivi_p2,
        avg_fatturato=round(avg_fatt,2),
        mom_growth=3.2, yoy_growth=18.5,
        mom_fatt_freader=2.8, mom_fatt_cutai=4.1,
        yoy_fatt_freader=15.2, yoy_fatt_cutai=24.8,
        mom_margine=2.5, yoy_margine=16.3,
        mom_contratti=1.8, yoy_contratti=12.0,
    ))

@app.route("/api/top-clients")
def api_top_clients():
    ac = all_contracts()
    rated = []
    for i, c in enumerate(ac):
        rated.append({**c, "rating": rate_client(c, ac), "index": i})
    rated.sort(key=lambda x: x["rating"], reverse=True)
    return jsonify(rated[:10])

@app.route("/api/expiring")
def api_expiring():
    ac = all_contracts()
    active = [c for c in ac if c["giorni_scadenza"] > 0]
    active.sort(key=lambda x: x["giorni_scadenza"])
    return jsonify(active[:3])


@app.route("/api/anomalies")
def api_anomalies():
    """Mockup anomalies: late payments, defaults, overdue invoices."""
    import random
    random.seed(42)
    ac = all_contracts()
    anomalies = []
    # Generate realistic mockup anomalies
    overdue = [
        dict(idx=0, tipo="insoluto", gravita="alta", cliente="Ciao", prodotto="Freader",
             desc="Fattura Q4-2025 non saldata. Importo: €10.000. Scaduta da 45 giorni.",
             importo=10000, giorni_ritardo=45, data_evento="12/02/2026"),
        dict(idx=7, tipo="ritardo_pagamento", gravita="media", cliente="Ahoj", prodotto="Freader",
             desc="Pagamento Q1-2026 ricevuto con 18 giorni di ritardo.",
             importo=7000, giorni_ritardo=18, data_evento="06/01/2026"),
        dict(idx=20, tipo="insoluto", gravita="alta", cliente="Buonasera", prodotto="CutAI",
             desc="Canone trimestrale Q1-2026 non pagato. Importo: €1.000. Scaduto da 28 giorni.",
             importo=1000, giorni_ritardo=28, data_evento="28/02/2026"),
        dict(idx=15, tipo="ritardo_pagamento", gravita="media", cliente="Buna", prodotto="Freader",
             desc="Pagamento Q4-2025 ricevuto con 32 giorni di ritardo. Pattern ricorrente.",
             importo=5000, giorni_ritardo=32, data_evento="12/01/2026"),
        dict(idx=25, tipo="mancato_pagamento", gravita="alta", cliente="Boa noite", prodotto="CutAI",
             desc="Mancato pagamento 2 trimestri consecutivi. Rischio insolvenza. Importo totale: €6.000.",
             importo=6000, giorni_ritardo=90, data_evento="18/12/2025"),
        dict(idx=9, tipo="ritardo_pagamento", gravita="bassa", cliente="Szia", prodotto="Freader",
             desc="Pagamento Q1-2026 ricevuto con 5 giorni di ritardo.",
             importo=7000, giorni_ritardo=5, data_evento="05/01/2026"),
        dict(idx=31, tipo="contestazione", gravita="media", cliente="Tere ohtust", prodotto="CutAI",
             desc="Contestazione fattura Q4-2025 per disservizio. Richiesta nota credito €360.",
             importo=360, giorni_ritardo=0, data_evento="15/01/2026"),
    ]
    return jsonify(overdue)


@app.route("/api/ai-advice")
def api_ai_advice():
    """AI agent that analyzes portfolio and gives actionable advice."""
    ac = all_contracts()
    kpi_data = api_kpi().get_json()
    anomalies = api_anomalies().get_json()

    advice = []

    # 1. Revenue concentration risk
    if kpi_data["fatt_pct_freader"] > 65:
        advice.append(dict(
            categoria="Diversificazione",
            priorita="alta",
            titolo="Concentrazione ricavi su Freader",
            desc=f"Il {kpi_data['fatt_pct_freader']}% del fatturato dipende da Freader. Accelerare l'acquisizione clienti CutAI per ridurre il rischio di concentrazione. Target: portare CutAI al 40% entro 12 mesi.",
            azione="Lanciare campagna commerciale CutAI con pricing aggressivo per i primi 6 mesi."
        ))

    # 2. Churn risk
    scaduti = kpi_data["scaduti"]
    if scaduti > 3:
        advice.append(dict(
            categoria="Retention",
            priorita="alta",
            titolo=f"{scaduti} contratti scaduti non rinnovati",
            desc="Il tasso di churn è elevato. Analizzare le cause: pricing non competitivo, SLA non rispettati, o mancanza di follow-up commerciale.",
            azione="Contattare entro 48h i clienti con contratto scaduto. Proporre rinnovo con sconto 10% e upgrade SLA."
        ))

    # 3. Payment anomalies
    alta_anomalies = [a for a in anomalies if a["gravita"] == "alta"]
    if alta_anomalies:
        tot_insoluto = sum(a["importo"] for a in alta_anomalies)
        advice.append(dict(
            categoria="Credit Risk",
            priorita="alta",
            titolo=f"€{tot_insoluto:,.0f} in insoluti critici",
            desc=f"{len(alta_anomalies)} anomalie di pagamento gravi. Rischio di perdita crediti se non gestite entro 30 giorni.",
            azione="Attivare procedura di sollecito formale. Per importi > €5.000 valutare sospensione servizio."
        ))

    # 4. Margin optimization
    if kpi_data["margine_pct_cutai"] < 20:
        advice.append(dict(
            categoria="Pricing",
            priorita="media",
            titolo="Margine CutAI sotto soglia",
            desc=f"Il margine CutAI è al {kpi_data['margine_pct_cutai']}%. I costi GPU sono elevati. Valutare ottimizzazione infrastruttura o repricing.",
            azione="Rinegoziare contratti CutAI sotto €1.500/trim al rinnovo. Valutare migrazione a GPU spot instances."
        ))

    # 5. Expiring contracts
    in_scad = kpi_data["in_scadenza_90"]
    if in_scad > 0:
        advice.append(dict(
            categoria="Pipeline",
            priorita="media",
            titolo=f"{in_scad} contratti in scadenza nei prossimi 90 giorni",
            desc="Preparare proposte di rinnovo personalizzate. I contratti in scadenza rappresentano un'opportunità di upsell.",
            azione="Schedulare call di rinnovo. Proporre upgrade a Premium dove applicabile."
        ))

    # 6. Growth opportunity
    if kpi_data["yoy_growth"] > 15:
        advice.append(dict(
            categoria="Crescita",
            priorita="bassa",
            titolo="Trend di crescita positivo",
            desc=f"YoY +{kpi_data['yoy_growth']}%. Il momentum è buono. Investire in acquisizione per capitalizzare.",
            azione="Aumentare budget marketing del 20%. Focus su referral program dai top clients."
        ))

    # 7. Contract terms risk
    risky = [c for c in ac if c["tetto_cred"] >= 15 or c["credito_uptime"] >= 10]
    if len(risky) > 3:
        advice.append(dict(
            categoria="Legal",
            priorita="media",
            titolo=f"{len(risky)} contratti con clausole penalizzanti",
            desc="Diversi contratti hanno tetti crediti o crediti uptime molto alti. Esposizione finanziaria in caso di disservizio.",
            azione="Al prossimo rinnovo, rinegoziare tetto crediti max 10% e credito uptime max 7%."
        ))

    return jsonify(advice)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
