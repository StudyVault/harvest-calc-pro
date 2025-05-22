import { useState } from 'react';
import { Dimensions, CalculationResult } from '../types/calculator';

export const useAreaCalculations = () => {
  const [result, setResult] = useState<CalculationResult>({
    areaRetangulo: 0,
    areaTriangulo: 0,
    areaTotal: 0,
    valorTotal: 0
  });

  const calculateAreas = (dimensions: Dimensions, toneladas: number, valorPorTonelada: number, selectedShape: 'rectangle' | 'triangle') => {
    const { ladoA, ladoB, ladoC } = dimensions;
    
    let areaRetangulo = 0;
    let areaTriangulo = 0;
    let areaTotal = 0;
    
    if (selectedShape === 'rectangle') {
      // Cálculo da área do retângulo
      areaRetangulo = ladoA * ladoB;
      areaTotal = areaRetangulo;
    } else {
      // Fórmula de Heron para área do triângulo
      const s = (ladoA + ladoB + ladoC) / 2;
      areaTriangulo = Math.sqrt(
        s * (s - ladoA) * (s - ladoB) * (s - ladoC)
      ) || 0; // Evita NaN para triângulos inválidos
      areaTotal = areaTriangulo;
    }
    
    const valorTotal = toneladas * valorPorTonelada;

    const newResult = {
      areaRetangulo,
      areaTriangulo,
      areaTotal,
      valorTotal
    };
    
    setResult(newResult);
    return newResult;
  };

  return { result, calculateAreas };
};
