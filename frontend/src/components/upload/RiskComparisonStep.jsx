// src/components/upload/RiskComparisonStep.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Card from '../common/Card';
import Button from '../common/Button';
import StatCard from '../common/StatCard';

const RiskComparisonStep = ({ analysisResult, originalRisk, modifications, onBack, onSave, onShowToast }) => {
  const [newRisk, setNewRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recalculate();
  }, []);

  const recalculate = async () => {
    setLoading(true);
    try {
      // Build modified contract data
      const modified = JSON.parse(JSON.stringify(analysisResult));
      // Apply saved modifications to SLA values where applicable
      Object.entries(modifications).forEach(([id, mod]) => {
        if (!mod.saved) return;
        if (id === 'pc_tetto' && modified.sla) {
          const match = mod.testo_migliorato?.match(/(\d+)%/);
          if (match) modified.sla.tetto_crediti = parseFloat(match[1]);
        }
        if (id === 'pc_uptime' && modified.sla) {
          const match = mod.testo_migliorato?.match(/(\d+)%/);
          if (match) modified.sla.credito_uptime = parseFloat(match[1]);
        }
        if (id === 'pc_ticketing' && modified.sla) {
          const match = mod.testo_migliorato?.match(/(\d+)%/);
          if (match) modified.sla.credito_ticketing = parseFloat(match[1]);
        }
      });

      const res = await api.recalculateRisk(modified);
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setNewRisk(data.data);
      }
    } catch {
      onShowToast('Errore ricalcolo rischio', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="step-content active" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Ricalcolo KPI in corso...</p>
      </div>
    );
  }

  const origScore = originalRisk?.risk_score || 0;
  const newScore = newRisk?.risk_score || 0;
  const origCritical = originalRisk?.punti_critici?.length || 0;
  const newCritical = newRisk?.punti_critici?.length || 0;
  const origSpelling = originalRisk?.errori_ortografici?.length || 0;
  const savedCount = Object.values(modifications).filter(m => m.saved).length;

  const rows = [
    { label: 'Risk Score', before: `${origScore}%`, after: `${newScore}%`, delta: newScore - origScore, unit: '%' },
    { label: 'Punti Critici', before: origCritical, after: newCritical, delta: newCritical - origCritical, unit: '' },
    { label: 'Errori Ortografici', before: origSpelling, after: 0, delta: -origSpelling, unit: '' },
    { label: 'Modifiche Applicate', before: 0, after: savedCount, delta: savedCount, unit: '', positive: true },
  ];

  return (
    <div className="step-content active">
      <div style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <i className="ri-bar-chart-grouped-line" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}></i>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Confronto KPI <strong style={{ color: 'var(--text-primary)' }}>prima</strong> e <strong style={{ color: 'var(--text-primary)' }}>dopo</strong> le modifiche proposte.
        </p>
      </div>

      {/* Before/After KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon="ri-shield-check-line" value={`${origScore}%`} label="Risk Score — Prima" color={origScore < 30 ? 'green' : origScore < 60 ? 'orange' : 'danger'} />
        <StatCard icon="ri-shield-check-line" value={`${newScore}%`} label="Risk Score — Dopo" color={newScore < 30 ? 'green' : newScore < 60 ? 'orange' : 'danger'} />
      </div>

      {/* Comparison table */}
      <Card>
        <Card.Header>
          <h2 style={{ fontSize: '0.9rem' }}><i className="ri-bar-chart-grouped-line"></i> Confronto Dettagliato</h2>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>KPI</th>
                <th>Prima</th>
                <th>Dopo</th>
                <th>Delta</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const improved = row.positive ? row.delta > 0 : row.delta < 0;
                const worse = row.positive ? row.delta < 0 : row.delta > 0;
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{row.label}</td>
                    <td>{row.before}{row.unit}</td>
                    <td style={{ fontWeight: 600 }}>{row.after}{row.unit}</td>
                    <td style={{ color: improved ? 'var(--color-success)' : worse ? 'var(--color-danger)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                      {row.delta > 0 ? '+' : ''}{row.delta}{row.unit}
                      {improved ? ' ↓' : worse ? ' ↑' : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card.Body>
      </Card>

      <div className="step-actions" style={{ marginTop: '1.5rem' }}>
        <Button variant="ghost" onClick={onBack}>
          <i className="ri-arrow-left-line"></i> Torna ai Punti Critici
        </Button>
        <Button variant="success" size="lg" onClick={onSave}>
          <i className="ri-save-3-line"></i> Salva Contratto
        </Button>
      </div>
    </div>
  );
};

export default RiskComparisonStep;
