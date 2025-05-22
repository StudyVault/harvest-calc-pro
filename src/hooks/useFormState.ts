import { useState } from 'react';
import { Dimensions, FinancialData, InputChangeEvent } from '../types/calculator';

export const useFormState = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    ladoA: 0,
    ladoB: 0,
    ladoC: 0,
    ladoD: 0
  });

  const [financialData, setFinancialData] = useState<FinancialData>({
    toneladas: 3,
    valorPorTonelada: 20.00
  });

  const handleDimensionChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setDimensions(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleFinancialChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFinancialData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return {
    dimensions,
    financialData,
    setFinancialData,
    handleDimensionChange,
    handleFinancialChange
  };
};
