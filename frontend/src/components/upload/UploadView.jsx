// src/components/upload/UploadView.jsx
import React, { useState } from 'react';
import { api } from '../../utils/api';
import PipelineSteps from './PipelineSteps';
import UploadStep from './UploadStep';
import AnalysisStep from './AnalysisStep';
import RiskAnalysisStep from './RiskAnalysisStep';
import RiskComparisonStep from './RiskComparisonStep';
import ConfirmationStep from './ConfirmationStep';
import PreSignAnalysisView from '../views/PreSignAnalysisView';

const UploadView = ({ onViewChange, onShowLoader, onHideLoader, onShowToast, onContractsUpdated, initialAnalysis, onResetInitialAnalysis }) => {
  const [currentStep, setCurrentStep] = useState(initialAnalysis ? 2 : 1);
  const [files, setFiles] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(initialAnalysis?.type === 'single' ? initialAnalysis.data : null);
  const [batchResults, setBatchResults] = useState(initialAnalysis?.type === 'batch' ? initialAnalysis.data : []);
  const [savedIds, setSavedIds] = useState(null);
  const [currentFilename, setCurrentFilename] = useState(null);
  const [showPreSign, setShowPreSign] = useState(false);
  const [originalRisk, setOriginalRisk] = useState(null);
  const [riskModifications, setRiskModifications] = useState({});

  React.useEffect(() => {
    if (initialAnalysis) onResetInitialAnalysis();
  }, []);

  const handleFilesSelect = (selectedFiles) => {
    const allowed = ['pdf', 'docx', 'jpg', 'jpeg', 'png'];
    const valid = selectedFiles.filter(f => allowed.includes(f.name.split('.').pop().toLowerCase()));
    if (valid.length === 0) { onShowToast('Nessun formato supportato.', 'error'); return; }
    setFiles(valid);
  };

  const handleRemoveFile = (index) => setFiles(files.filter((_, idx) => idx !== index));

  const handleUpload = async () => {
    if (!files.length) return;
    if (files.length > 1) {
      onShowLoader(`Caricamento e analisi di ${files.length} file...`);
      try {
        const res = await api.uploadAndAnalyzeBatch(files);
        const data = await res.json();
        if (res.ok && data.status === 'success') {
          setBatchResults(data.data || []);
          setCurrentStep(2);
          onShowToast(`${data.data.length} contratti analizzati!`, 'success');
        } else { onShowToast(data.message || 'Errore batch upload', 'error'); }
      } catch { onShowToast('Impossibile contattare il server.', 'error'); }
      finally { onHideLoader(); }
      return;
    }
    onShowLoader(`Caricamento e analisi ${files[0].name}...`);
    try {
      const uploadRes = await api.uploadFile(files[0]);
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || uploadData.status !== 'success') {
        onShowToast(uploadData.message || 'Errore upload', 'error'); onHideLoader(); return;
      }
      const extractedText = uploadData.data.extracted_text;
      setCurrentFilename(uploadData.data.filename);
      const analyzeRes = await api.analyzeText(extractedText);
      const analyzeData = await analyzeRes.json();
      if (analyzeRes.ok && analyzeData.status === 'success') {
        setAnalysisResult(analyzeData.data);
        setCurrentStep(2);
        onShowToast('Analisi completata!', 'success');
      } else { onShowToast(analyzeData.message || 'Errore analisi', 'error'); }
    } catch { onShowToast('Impossibile contattare il server.', 'error'); }
    finally { onHideLoader(); }
  };

  // Step 2 → Step 3: proceed to risk analysis (single file only)
  const handleProceedToRisk = () => setCurrentStep(3);

  // Step 3 → Step 4: risk analysis done
  const handleRiskFinish = (riskData, mods) => {
    setOriginalRisk(riskData);
    setRiskModifications(mods);
    setCurrentStep(4);
  };

  // Save single contract (from step 4 comparison or step 2 for batch)
  const handleSave = async () => {
    if (!analysisResult) return;
    onShowLoader('Salvataggio contratto...');
    try {
      const res = await api.saveContract(analysisResult, currentFilename);
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSavedIds(data.contract_id);
        setCurrentStep(5);
        onShowToast('Contratto salvato!', 'success');
        onContractsUpdated();
      } else { onShowToast(data.message || 'Errore', 'error'); }
    } catch { onShowToast('Errore di rete.', 'error'); }
    finally { onHideLoader(); }
  };

  // Save batch (from step 2)
  const handleSaveAll = async () => {
    if (!batchResults.length) return;
    onShowLoader(`Salvataggio di ${batchResults.length} contratti...`);
    const savedIdsList = [];
    for (const r of batchResults) {
      try {
        const res = await api.saveContract(r.analysis, r.filename);
        const data = await res.json();
        if (res.ok && data.status === 'success') savedIdsList.push(data.contract_id);
      } catch {}
    }
    onHideLoader();
    if (savedIdsList.length > 0) {
      setSavedIds(savedIdsList);
      setCurrentStep(5);
      onShowToast(`${savedIdsList.length} contratti salvati!`, 'success');
      onContractsUpdated();
    } else { onShowToast('Errore nel salvataggio.', 'error'); }
  };

  const handleReset = () => {
    setCurrentStep(1); setFiles([]); setAnalysisResult(null); setBatchResults([]);
    setSavedIds(null); setCurrentFilename(null); setShowPreSign(false);
    setOriginalRisk(null); setRiskModifications({});
  };

  const getContractDataForPreSign = () => {
    if (!analysisResult) return null;
    const prodotto = analysisResult.prodotto;
    const ana = analysisResult.anagrafica || {};
    const det = analysisResult.dettagli_contratto || {};
    const sla = analysisResult.sla || {};
    const comm = prodotto === 'Freader' ? analysisResult.commerciale_freader || {} : analysisResult.commerciale_cutai || {};
    return {
      prodotto, cliente: ana.cliente_ragione_sociale,
      canone_trim: comm.canone_trimestrale || comm.canone_base_trimestrale,
      durata_mesi: det.durata_mesi, preavviso_gg: det.preavviso_giorni,
      tetto_cred: sla.tetto_crediti, credito_uptime: sla.credito_uptime, credito_ticketing: sla.credito_ticketing
    };
  };

  // Determine total steps: batch = 3 (upload, analysis, confirm), single = 5
  const isBatch = batchResults.length > 0;
  const totalSteps = isBatch ? 3 : 5;
  // Map internal step to display step for batch
  const displayStep = isBatch ? (currentStep >= 5 ? 3 : currentStep) : currentStep;

  return (
    <section className="view active">
      {showPreSign ? (
        <PreSignAnalysisView
          contractData={getContractDataForPreSign()}
          onBack={() => setShowPreSign(false)}
          onShowLoader={onShowLoader} onHideLoader={onHideLoader} onShowToast={onShowToast}
        />
      ) : (
        <>
          <PipelineSteps currentStep={displayStep} totalSteps={totalSteps} />

          {currentStep === 1 && (
            <UploadStep files={files} onFilesSelect={handleFilesSelect} onRemoveFile={handleRemoveFile} onUpload={handleUpload} />
          )}

          {currentStep === 2 && (
            <AnalysisStep
              analysisResult={analysisResult} batchResults={batchResults}
              onBack={() => setCurrentStep(1)}
              onSave={isBatch ? null : handleProceedToRisk}
              onSaveAll={handleSaveAll}
              onPreSignAnalysis={analysisResult && !isBatch ? () => setShowPreSign(true) : null}
              saveLabel={isBatch ? undefined : "Analisi Rischio →"}
              saveIcon={isBatch ? undefined : "ri-shield-check-line"}
            />
          )}

          {currentStep === 3 && !isBatch && (
            <RiskAnalysisStep
              analysisResult={analysisResult}
              onBack={() => setCurrentStep(2)}
              onFinish={handleRiskFinish}
              onShowLoader={onShowLoader} onHideLoader={onHideLoader} onShowToast={onShowToast}
            />
          )}

          {currentStep === 4 && !isBatch && (
            <RiskComparisonStep
              analysisResult={analysisResult}
              originalRisk={originalRisk}
              modifications={riskModifications}
              onBack={() => setCurrentStep(3)}
              onSave={handleSave}
              onShowToast={onShowToast}
              currentFilename={currentFilename}
            />
          )}

          {currentStep === 5 && (
            <ConfirmationStep savedIds={savedIds} onViewContracts={() => onViewChange('contracts')} onUploadAnother={handleReset} />
          )}
        </>
      )}
    </section>
  );
};

export default UploadView;
