// src/components/upload/RiskAnalysisStep.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import StatCard from '../common/StatCard';

const RiskAnalysisStep = ({ analysisResult, onBack, onFinish, onShowLoader, onHideLoader, onShowToast }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPoint, setExpandedPoint] = useState(null);
  const [modifications, setModifications] = useState({});
  const [improvingId, setImprovingId] = useState(null);

  useEffect(() => {
    runRiskAnalysis();
  }, []);

  const runRiskAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.riskAnalysis(analysisResult, '');
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setRiskData(data.data);
      } else {
        onShowToast(data.message || 'Errore analisi rischio', 'error');
      }
    } catch {
      onShowToast('Errore di rete.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async (point) => {
    setImprovingId(point.id);
    try {
      const prodotto = analysisResult.prodotto || '';
      const canone = prodotto.toLowerCase().includes('freader')
        ? analysisResult.commerciale_freader?.canone_trimestrale
        : analysisResult.commerciale_cutai?.canone_base_trimestrale;
      
      const res = await api.improveClause(
        point.testo_contratto_originale,
        point.sezione,
        `${prodotto}, canone €${canone}/trim`,
        point.valore_riferimento
      );
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setModifications(prev => ({
          ...prev,
          [point.id]: {
            testo_migliorato: data.data.clausola_migliorata,
            motivazione: data.data.motivazione,
            saved: false
          }
        }));
        onShowToast('Clausola migliorata!', 'success');
      } else {
        onShowToast(data.message || 'Errore', 'error');
      }
    } catch {
      onShowToast('Errore di rete.', 'error');
    } finally {
      setImprovingId(null);
    }
  };

  const handleManualEdit = (pointId, text) => {
    setModifications(prev => ({
      ...prev,
      [pointId]: { ...prev[pointId], testo_migliorato: text, saved: false }
    }));
  };

  const handleSaveModification = (pointId) => {
    setModifications(prev => ({
      ...prev,
      [pointId]: { ...prev[pointId], saved: true }
    }));
    onShowToast('Modifica salvata', 'success');
  };

  const handleFinish = () => {
    const savedMods = Object.entries(modifications)
      .filter(([_, m]) => m.saved)
      .reduce((acc, [id, m]) => ({ ...acc, [id]: m }), {});
    onFinish(riskData, savedMods);
  };

  if (loading) {
    return (
      <div className="step-content active" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="processing-icon" style={{ marginBottom: '1.5rem' }}>
          <div className="processing-ring"></div>
          <i className="ri-shield-check-line" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
        </div>
        <h2 style={{ color: 'var(--text-primary)' }}>Analisi Rischio in corso...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Stiamo valutando le clausole del contratto</p>
      </div>
    );
  }

  if (!riskData) return null;

  const scoreColor = riskData.risk_score < 30 ? 'green' : riskData.risk_score < 60 ? 'orange' : 'danger';

  return (
    <div className="step-content active">
      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          icon="ri-shield-check-line"
          value={`${riskData.risk_score}%`}
          label="Risk Score"
          color={scoreColor}
        />
        <StatCard
          icon="ri-error-warning-line"
          value={riskData.punti_critici.length}
          label="Punti Critici"
          color={riskData.punti_critici.length > 3 ? 'danger' : 'orange'}
        />
        <StatCard
          icon="ri-text"
          value={riskData.errori_ortografici.length}
          label="Errori Ortografici"
          color={riskData.errori_ortografici.length > 0 ? 'orange' : 'green'}
        />
      </div>

      {/* Spelling errors */}
      {riskData.errori_ortografici.length > 0 && (
        <Card style={{ marginBottom: '1rem', borderColor: 'var(--color-warning)' }}>
          <Card.Header>
            <h2 style={{ fontSize: '0.9rem' }}><i className="ri-text"></i> Errori Ortografici</h2>
          </Card.Header>
          <Card.Body>
            {riskData.errori_ortografici.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-tertiary)', minWidth: '60px' }}>{e.posizione}</span>
                <span style={{ textDecoration: 'line-through', color: 'var(--color-danger)' }}>{e.originale}</span>
                <span>→</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{e.corretto}</span>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Critical points */}
      <Card>
        <Card.Header>
          <h2 style={{ fontSize: '0.9rem' }}><i className="ri-error-warning-line"></i> Punti Critici</h2>
          <Badge variant={riskData.punti_critici.length > 3 ? 'danger' : 'warning'}>
            {riskData.punti_critici.length} trovati
          </Badge>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          {riskData.punti_critici.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <i className="ri-checkbox-circle-line" style={{ fontSize: '2rem', color: 'var(--color-success)' }}></i>
              <p>Nessun punto critico rilevato</p>
            </div>
          ) : (
            riskData.punti_critici.map((point) => {
              const isExpanded = expandedPoint === point.id;
              const mod = modifications[point.id];
              const gravColor = point.gravita === 'alta' ? 'danger' : point.gravita === 'media' ? 'warning' : 'success';
              
              return (
                <div key={point.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {/* Row */}
                  <div
                    onClick={() => setExpandedPoint(isExpanded ? null : point.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Badge variant={gravColor}>{point.gravita.toUpperCase()}</Badge>
                    <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{point.sezione}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{point.valore_attuale}</span>
                    {mod?.saved && <Badge variant="success">Modificato</Badge>}
                    <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line`} style={{ color: 'var(--text-tertiary)' }}></i>
                  </div>
                  
                  {/* Expanded popup */}
                  {isExpanded && (
                    <div style={{ padding: '0 1.25rem 1.25rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '1rem 0' }}>
                        {point.spiegazione}
                      </p>
                      
                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Testo originale</div>
                        <p style={{ fontSize: '0.85rem', margin: 0 }}>{point.testo_contratto_originale}</p>
                      </div>
                      
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Modifica proposta</div>
                        <textarea
                          value={mod?.testo_migliorato || ''}
                          onChange={e => handleManualEdit(point.id, e.target.value)}
                          placeholder="Scrivi qui la modifica o clicca 'Migliora' per generarla con AI..."
                          style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                        />
                        {mod?.motivazione && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            <i className="ri-sparkling-2-line"></i> {mod.motivazione}
                          </p>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleImprove(point)}
                          disabled={improvingId === point.id}
                        >
                          {improvingId === point.id ? (
                            <><i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite' }}></i> Miglioro...</>
                          ) : (
                            <><i className="ri-sparkling-2-line"></i> Migliora</>
                          )}
                        </Button>
                        {mod?.testo_migliorato && (
                          <Button
                            variant={mod.saved ? 'success' : 'ghost'}
                            size="sm"
                            onClick={() => handleSaveModification(point.id)}
                            disabled={mod.saved}
                          >
                            <i className={mod.saved ? 'ri-check-line' : 'ri-save-3-line'}></i>
                            {mod.saved ? 'Salvato' : 'Salva modifica'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </Card.Body>
      </Card>

      {/* FINE button */}
      <div className="step-actions" style={{ marginTop: '1.5rem' }}>
        <Button variant="ghost" onClick={onBack}>
          <i className="ri-arrow-left-line"></i> Indietro
        </Button>
        <Button variant="success" size="lg" onClick={handleFinish}>
          <i className="ri-check-double-line"></i> FINE
        </Button>
      </div>
    </div>
  );
};

export default RiskAnalysisStep;
