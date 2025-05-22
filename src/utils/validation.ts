import { Dimensions } from '../types/calculator';

export const validateTriangleInequality = (
  a: number, 
  b: number, 
  c: number
): boolean => {
  return (
    a + b > c && 
    a + c > b && 
    b + c > a
  );
};

export const validateDimensions = (dimensions: Dimensions, selectedShape: 'rectangle' | 'triangle'): {
  valid: boolean;
  errors: string[];
} => {
  const { ladoA, ladoB, ladoC, ladoD } = dimensions;
  const errors: string[] = [];
  
  // Validações comuns para ambas as formas
  if (ladoA <= 0) errors.push('O lado A deve ser maior que zero');
  if (ladoB <= 0) errors.push('O lado B deve ser maior que zero');
  
  if (selectedShape === 'rectangle') {
    // Validações específicas para retângulo
    if (ladoC <= 0) errors.push('O lado C deve ser maior que zero');
    if (ladoD <= 0) errors.push('O lado D deve ser maior que zero');
    
    // Verificar se é um retângulo válido (lados opostos iguais)
    if (ladoA > 0 && ladoB > 0 && ladoC > 0 && ladoD > 0) {
      if (Math.abs(ladoA - ladoC) > 0.001 || Math.abs(ladoB - ladoD) > 0.001) {
        errors.push('Os lados opostos de um retângulo devem ser iguais');
      }
    }
  } else {
    // Validações específicas para triângulo
    if (ladoC <= 0) errors.push('O lado C deve ser maior que zero');
    
    // Verificar desigualdade triangular
    if (ladoA > 0 && ladoB > 0 && ladoC > 0) {
      if (!validateTriangleInequality(ladoA, ladoB, ladoC)) {
        errors.push('As dimensões não formam um triângulo válido');
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
