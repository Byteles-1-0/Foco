from flask import Blueprint, jsonify

dashboard_bp = Blueprint('dashboard', __name__)

# ==========================================
# 1. KPI Dashboard
# ==========================================
@dashboard_bp.route('/kpi', methods=['GET'])
def get_kpi():
    return jsonify({
        "fatturato_totale": 592000,
        "fatturato_freader": 410000,
        "fatturato_cutai": 182000,
        "fatt_pct_freader": 69,
        "fatt_pct_cutai": 31,
        "margine_totale": 338399.50,
        "margine_pct": 57.2,
        "margine_freader": 234000,
        "margine_cutai": 104399.50,
        "margine_pct_freader": 57.1,
        "margine_pct_cutai": 57.4,
        "mom_growth": 2.5,
        "yoy_growth": 15.3,
        "mom_margine": 1.8,
        "yoy_margine": 12.4,
        "mom_fatt_freader": 2.1,
        "yoy_fatt_freader": 14.8,
        "mom_fatt_cutai": 3.2,
        "yoy_fatt_cutai": 19.1,
        "attivi": 18,
        "totale_contratti": 20,
        "attivi_freader": 12,
        "attivi_cutai": 6,
        "contratti_freader": 13,
        "contratti_cutai": 7,
        "mom_contratti": 1.5,
        "yoy_contratti": 10.0,
        "scaduti": 2,
        "in_scadenza_90": 3,
        "bep_contratti": 8,
        "bep_euro": 240000,
        "avg_fatturato": 29600
    }), 200

# ==========================================
# 2. Contratti
# ==========================================
@dashboard_bp.route('/contracts', methods=['GET'])
def get_contracts():
    return jsonify([
        {
            "cliente": "Azienda XYZ",
            "prodotto": "Freader",
            "sede": "Milano",
            "canone_trim": 12500,
            "fatturato_annuo": 50000,
            "durata_mesi": 24,
            "data_firma": "2024-01-15",
            "scadenza": "2026-01-15",
            "giorni_scadenza": 120,
            "preavviso_gg": 60,
            "credito_uptime": 5,
            "credito_ticketing": 3,
            "tetto_cred": 10,
            "prezzo_f1": 15.5,
            "prezzo_f2": 12.0,
            "prezzo_f3": 8.5,
            "profilo": "Standard"
        },
        {
            "cliente": "Azienda ABC",
            "prodotto": "CutAI",
            "sede": "Roma",
            "canone_trim": 10000,
            "fatturato_annuo": 40000,
            "durata_mesi": 12,
            "data_firma": "2025-05-15",
            "scadenza": "2026-05-15",
            "giorni_scadenza": 60,
            "preavviso_gg": 30,
            "credito_uptime": 3,
            "credito_ticketing": 2,
            "tetto_cred": 5,
            "prezzo_f1": 0.0,
            "prezzo_f2": 0.0,
            "prezzo_f3": 0.0,
            "profilo": "Premium"
        }
    ]), 200

# ==========================================
# 3. Contratto Singolo
# ==========================================
@dashboard_bp.route('/contracts/<int:index>', methods=['GET'])
def get_contract(index):
    return jsonify({
        "contract": {
            "cliente": "Azienda XYZ",
            "prodotto": "Freader",
            "sede": "Milano",
            "canone_trim": 12500,
            "fatturato_annuo": 50000,
            "durata_mesi": 24,
            "data_firma": "2024-01-15",
            "scadenza": "2026-01-15",
            "giorni_scadenza": 120,
            "preavviso_gg": 60,
            "credito_uptime": 5,
            "credito_ticketing": 3,
            "tetto_cred": 10,
            "prezzo_f1": 15.5,
            "prezzo_f2": 12.0,
            "prezzo_f3": 8.5,
            "profilo": "Standard"
        },
        "issues": [
            {
                "gravita": "alta",
                "sezione": "Clausole",
                "desc": "Tetto crediti troppo alto"
            }
        ]
    }), 200

# ==========================================
# 4. Contratti in Scadenza
# ==========================================
@dashboard_bp.route('/expiring', methods=['GET'])
def get_expiring():
    return jsonify([
        {
            "cliente": "Azienda ABC",
            "prodotto": "CutAI",
            "sede": "Roma",
            "canone_trim": 10000,
            "fatturato_annuo": 40000,
            "durata_mesi": 12,
            "data_firma": "2025-05-15",
            "scadenza": "2026-05-15",
            "giorni_scadenza": 60,
            "preavviso_gg": 30,
            "credito_uptime": 3,
            "credito_ticketing": 2,
            "tetto_cred": 5,
            "prezzo_f1": 0.0,
            "prezzo_f2": 0.0,
            "prezzo_f3": 0.0,
            "profilo": "Premium"
        }
    ]), 200

# ==========================================
# 5. Anomalie Pagamenti
# ==========================================
@dashboard_bp.route('/anomalies', methods=['GET'])
def get_anomalies():
    return jsonify([
        {
            "cliente": "Azienda ABC",
            "prodotto": "CutAI",
            "tipo": "ritardo_pagamento",
            "gravita": "alta",
            "desc": "Pagamento in ritardo di 45 giorni",
            "data_evento": "2026-02-15"
        }
    ]), 200

# ==========================================
# 6. Dati Mappa Geografica
# ==========================================
@dashboard_bp.route('/map-data', methods=['GET'])
def get_map_data():
    return jsonify([
        {
            "citta": "Milano",
            "lat": 45.46,
            "lng": 9.19,
            "count": 8
        },
        {
            "citta": "Roma",
            "lat": 41.90,
            "lng": 12.50,
            "count": 5
        }
    ]), 200

# ==========================================
# 7. Costi per Prodotto
# ==========================================
@dashboard_bp.route('/costs/<prodotto>', methods=['GET'])
def get_costs(prodotto):
    # Dati estratti da analisi_costi_azienda_saas2.md
    # Totale Ricavi: ~2.49M (Freader 2.13M, CutAI 0.36M)
    # Ripartizione costi su base ricavi (85.5% Freader, 14.5% CutAI) per i costi totali (1.789.000)
    
    costo_totale = 1789000
    freader_ratio = 0.855
    cutai_ratio = 0.145

    if prodotto == 'prodotto1':
        # Proporzionato per Freader
        molt = freader_ratio
    elif prodotto == 'prodotto2':
        # Proporzionato per CutAI
        molt = cutai_ratio
    else:
        # Totale
        molt = 1.0

    return jsonify({
        "tot_fissi": 1372000 * molt,
        "tot_variabili": 417000 * molt,
        "tot_diretti": 1126000 * molt,
        "tot_indiretti": 663000 * molt,
        "costo_unit_trad": 44725, # 1789000 / 40 clienti
        "costo_prodotto_freader": costo_totale * freader_ratio,
        "costo_prodotto_cutai": costo_totale * cutai_ratio,
        "fissi": [
            {
                "voce": "Personale Tecnico (CTO, AI, Backend, CS)",
                "importo": 609000 * molt,
                "tipo": "diretto"
            },
            {
                "voce": "Personale Management & Sales",
                "importo": 253000 * molt,
                "tipo": "indiretto"
            },
            {
                "voce": "Infrastruttura Cloud Fissa & DB",
                "importo": 100000 * molt,
                "tipo": "diretto"
            },
            {
                "voce": "Sales & Marketing",
                "importo": 250000 * molt,
                "tipo": "indiretto"
            },
            {
                "voce": "Spese Generali (G&A, Compliance, Tooling)",
                "importo": 160000 * molt,
                "tipo": "indiretto"
            }
        ],
        "variabili": [
            {
                "voce": "Inferenza AI (GPU)",
                "importo": 387000 * molt,
                "unita": "0.03 €/pagina",
                "tipo": "diretto"
            },
            {
                "voce": "Storage & Traffico Dati",
                "importo": 30000 * molt,
                "unita": "volume",
                "tipo": "diretto"
            }
        ]
    }), 200

# ==========================================
# 8. Top Clients
# ==========================================
@dashboard_bp.route('/top-clients', methods=['GET'])
def get_top_clients():
    return jsonify([
        {
            "index": 0,
            "cliente": "Azienda Top",
            "prodotto": "Freader",
            "sede": "Milano",
            "canone_trim": 15000,
            "durata_mesi": 36,
            "rating": 92,
            "credito_uptime": 3,
            "tetto_cred": 8,
            "preavviso_gg": 90,
            "giorni_scadenza": 180
        }
    ]), 200

# ==========================================
# 9. AI Advice
# ==========================================
@dashboard_bp.route('/ai-advice', methods=['GET'])
def get_ai_advice():
    return jsonify([
        {
            "categoria": "Diversificazione",
            "priorita": "alta",
            "titolo": "Aumenta quota CutAI",
            "desc": "La concentrazione su Freader è troppo alta",
            "azione": "Acquisire 5 nuovi clienti CutAI nei prossimi 3 mesi"
        }
    ]), 200
