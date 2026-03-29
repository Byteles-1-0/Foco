// src/components/upload/PipelineSteps.jsx
import React from 'react';

const PipelineSteps = ({ currentStep, totalSteps = 3 }) => {
  const allSteps = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'Analisi AI' },
    { number: 3, label: 'Risk Analysis' },
    { number: 4, label: 'Confronto' },
    { number: 5, label: 'Conferma' }
  ];

  const steps = allSteps.slice(0, totalSteps);

  return (
    <div className="pipeline-steps">
      {steps.map((step, idx) => (
        <React.Fragment key={step.number}>
          <div className={`step ${
            step.number < currentStep ? 'done' : 
            step.number === currentStep ? 'active' : ''
          }`}>
            <div className="step-number">{step.number}</div>
            <span>{step.label}</span>
          </div>
          {idx < steps.length - 1 && <div className="step-connector"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PipelineSteps;
