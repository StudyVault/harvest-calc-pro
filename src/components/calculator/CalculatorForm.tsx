import React, { useState } from 'react';
import InputField from '../common/InputField';
import { Dimensions, FinancialData, InputChangeEvent } from '../../types/calculator';
import { validateDimensions } from '../../utils/validation';

interface CalculatorFormProps {
  dimensions: Dimensions;
  financialData: FinancialData;
  onDimensionChange: (e: InputChangeEvent) => void;
  onFinancialChange: (e: InputChangeEvent) => void;
  onCalculate: () => void;
  selectedShape: 'rectangle' | 'triangle';
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  dimensions,
  financialData,
  onDimensionChange,
  onFinancialChange,
  onCalculate,
  selectedShape
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCalculate = () => {
    const validation = validateDimensions(dimensions, selectedShape);
    
    // Validação financeira
    const financialErrors: Record<string, string> = {};
    if (financialData.toneladas <= 0) {
      financialErrors.toneladas = 'A quantidade de toneladas deve ser maior que zero';
    }
    if (financialData.valorPorTonelada <= 0) {
      financialErrors.valorPorTonelada = 'O valor por tonelada deve ser maior que zero';
    }
    
    if (!validation.valid || Object.keys(financialErrors).length > 0) {
      const newErrors: Record<string, string> = {...financialErrors};
      
      validation.errors.forEach(error => {
        if (error.includes('lado A')) newErrors.ladoA = error;
        if (error.includes('lado B')) newErrors.ladoB = error;
        if (error.includes('lado C')) newErrors.ladoC = error;
        if (error.includes('triângulo válido')) {
          newErrors.ladoA = error;
          newErrors.ladoB = error;
          newErrors.ladoC = error;
        }
      });
      
      setErrors(newErrors);
      return;
    }
    
    // Feedback visual de processamento
    setIsSubmitting(true);
    setErrors({});
    
    // Simular um pequeno delay para feedback visual
    setTimeout(() => {
      onCalculate();
      setIsSubmitting(false);
    }, 300);
  };
  
  return (
    <div className="calculator-form card">
      <h3>Dados de Cálculo</h3>
      
      <div className="form-section">
        <h4>Informações Financeiras</h4>
        <InputField
          id="toneladas"
          name="toneladas"
          label="Quantidade de Toneladas:"
          value={financialData.toneladas}
          onChange={onFinancialChange}
          error={errors.toneladas}
        />
        
        <InputField
          id="valorPorTonelada"
          name="valorPorTonelada"
          label="Valor por Tonelada:"
          value={financialData.valorPorTonelada}
          onChange={onFinancialChange}
          error={errors.valorPorTonelada}
          isCurrency={true}
        />
      </div>
      
      <div className="form-section">
        <h4>Dimensões {selectedShape === 'rectangle' ? 'do Retângulo' : 'do Triângulo'}</h4>
        <div className="form-row">
          <InputField
            id="ladoA"
            name="ladoA"
            label="Lado A (metros):"
            value={dimensions.ladoA}
            onChange={onDimensionChange}
            error={errors.ladoA}
          />
          
          <InputField
            id="ladoB"
            name="ladoB"
            label="Lado B (metros):"
            value={dimensions.ladoB}
            onChange={onDimensionChange}
            error={errors.ladoB}
          />
        </div>
        
        <div className="form-row">
          <InputField
            id="ladoC"
            name="ladoC"
            label="Lado C (metros):"
            value={dimensions.ladoC}
            onChange={onDimensionChange}
            error={errors.ladoC}
          />
          
          {selectedShape === 'rectangle' && (
            <InputField
              id="ladoD"
              name="ladoD"
              label="Lado D (metros):"
              value={dimensions.ladoD}
              onChange={onDimensionChange}
              error={errors.ladoD}
            />
          )}
        </div>
      </div>
      
      <button 
        className={`btn btn-primary calculate-button ${isSubmitting ? 'loading' : ''}`}
        onClick={handleCalculate}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Calculando...' : 'Calcular'}
      </button>
      
      {Object.keys(errors).length > 0 && (
        <div className="validation-summary">
          <p>Por favor, corrija os erros acima antes de calcular.</p>
        </div>
      )}
    </div>
  );
};

export default CalculatorForm;
