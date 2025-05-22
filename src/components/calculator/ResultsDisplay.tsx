import React from 'react';
import { CalculationResult } from '../../types/calculator';

interface ResultsDisplayProps {
  result: CalculationResult;
  showResults: boolean;
  selectedShape: 'rectangle' | 'triangle';
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, showResults, selectedShape }) => {
  if (!showResults) return null;
  
  return (
    <div className="result-card">
      <h3>Resultados:</h3>
      {selectedShape === 'rectangle' ? (
        <div className="result-item">
          <span>Área do Retângulo:</span>
          <span className="result-value">{result.areaRetangulo.toFixed(2)} m²</span>
        </div>
      ) : (
        <div className="result-item">
          <span>Área do Triângulo:</span>
          <span className="result-value">{result.areaTriangulo.toFixed(2)} m²</span>
        </div>
      )}
      <div className="result-item">
        <span>Área Total:</span>
        <span className="result-value">{result.areaTotal.toFixed(2)} m²</span>
      </div>
      <div className="result-item">
        <span>Valor Total:</span>
        <span className="result-value">R$ {result.valorTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ResultsDisplay;
