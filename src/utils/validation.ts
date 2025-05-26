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

const validatePositiveSides = (sides: number[]): string[] => {
  return sides
    .map((side, index) => {
      const labels = ['A', 'B', 'C', 'D'];
      return side <= 0 ? `O lado ${labels[index]} deve ser maior que zero` : '';
    })
    .filter(Boolean);
};

const validateRectangle = (dimensions: Dimensions): string[] => {
  const { ladoA, ladoB, ladoC, ladoD } = dimensions;
  const errors = validatePositiveSides([ladoA, ladoB, ladoC, ladoD]);

  const allSidesPositive = [ladoA, ladoB, ladoC, ladoD].every(side => side > 0);
  if (allSidesPositive) {
    const oppositeSidesEqual = 
      Math.abs(ladoA - ladoC) <= 0.001 && 
      Math.abs(ladoB - ladoD) <= 0.001;
    
    if (!oppositeSidesEqual) {
      errors.push('Os lados opostos de um retângulo devem ser iguais');
    }
  }

  return errors;
};

const validateTriangle = (dimensions: Dimensions): string[] => {
  const { ladoA, ladoB, ladoC } = dimensions;
  const errors = validatePositiveSides([ladoA, ladoB, ladoC]);

  const allSidesPositive = [ladoA, ladoB, ladoC].every(side => side > 0);
  if (allSidesPositive && !validateTriangleInequality(ladoA, ladoB, ladoC)) {
    errors.push('As dimensões não formam um triângulo válido');
  }

  return errors;
};

export const validateDimensions = (dimensions: Dimensions, selectedShape: 'rectangle' | 'triangle'): {
  valid: boolean;
  errors: string[];
} => {
  const errors = selectedShape === 'rectangle' 
    ? validateRectangle(dimensions)
    : validateTriangle(dimensions);

  return {
    valid: errors.length === 0,
    errors
  };
};
