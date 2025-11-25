import React from 'react';
import { CalculationResult } from '../../types/calculator';

interface ResultsDisplayProps {
  result: CalculationResult;
  showResults: boolean;
  selectedShape?: 'rectangle' | 'triangle'; // Opcional para compatibilidade
}

/**
 * Componente de exibição de resultados (legado - use ResultCard ao invés)
 * @deprecated Use ResultCard para melhor visualização
 */
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, showResults }) => {
  if (!showResults) return null;
  
  return (
    <div className="result-card">
      <h3>Resultados:</h3>
      <div className="result-item">
        <span>Cubagem (área):</span>
        <span className="result-value">{result.cubagem.toFixed(2)} braças²</span>
      </div>
      <div className="result-item">
        <span>Produção:</span>
        <span className="result-value">{result.producaoKg.toLocaleString('pt-BR')} kg ({result.producaoTon.toFixed(3)} ton)</span>
      </div>
      <div className="result-item">
        <span>Valor Total:</span>
        <span className="result-value">R$ {result.valorTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ResultsDisplay;
