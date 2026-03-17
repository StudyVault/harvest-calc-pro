import { useState } from 'react';
import { Dimensions, CalculationResult } from '../types/calculator';

/**
 * Hook para cálculos de cubagem e produtividade de corte de cana
 */
export const useAreaCalculations = () => {
  const [result, setResult] = useState<CalculationResult>({
    cubagem: 0,
    producaoKg: 0,
    producaoTon: 0,
    valorTotal: 0,
    ladosUsados: {
      ladoA: 0,
      ladoB: 0,
      ladoC: 0,
      ladoD: 0
    }
  });

  /**
   * Calcula a cubagem, produção e valor total
   * @param dimensions - Dimensões do talhão em braças
   * @param produtividade - Produtividade em kg por braça²
   * @param valorDigitado - Valor digitado em centavos (será convertido para R$/kg)
   * @param selectedShape - Forma do talhão ('rectangle' ou 'triangle')
   */
  const calculateAreas = (
    dimensions: Dimensions, 
    produtividade: number, 
    valorDigitado: number, 
    selectedShape: 'rectangle' | 'triangle'
  ) => {
    const { ladoA, ladoB, ladoC, ladoD } = dimensions;
    
    let cubagem = 0;
    
    if (selectedShape === 'rectangle') {
      // Fórmula correta para retângulo irregular (trapézio generalizado)
      // Média dos lados opostos A e C, vezes média dos lados opostos B e D
      cubagem = ((ladoA + ladoC) / 2) * ((ladoB + ladoD) / 2);
    } else {
      // Fórmula para talhão triangular
      // A e B são as bases, C é a altura
      // Média das bases × metade da altura
      cubagem = ((ladoA + ladoB) / 2) * (ladoC / 2);
    }
    
    // Cálculo da produção baseado na cubagem e produtividade
    const producaoKg = cubagem * produtividade;
    const producaoTon = producaoKg / 1000;
    
    // Cálculo do valor total
    // valorDigitado representa CENTAVOS por tonelada
    // Ex: usuário digita 25 = 25 centavos = R$ 0,25 por tonelada
    // Valor total = toneladas × (valorDigitado / 100)
    // Ex: 603.075 ton × R$ 0,25/ton = R$ 150,76875 ≈ R$ 150,77
    const valorPorToneladaEmReais = valorDigitado / 100;
    const valorTotal = producaoTon * valorPorToneladaEmReais;

    const newResult: CalculationResult = {
      cubagem: Number(cubagem.toFixed(2)),
      producaoKg: Number(producaoKg.toFixed(2)),
      producaoTon: Number(producaoTon.toFixed(3)),
      valorTotal: Number(valorTotal.toFixed(2)),
      ladosUsados: {
        ladoA,
        ladoB,
        ladoC,
        ladoD: selectedShape === 'rectangle' ? ladoD : 0
      }
    };
    
    setResult(newResult);
    return newResult;
  };

  return { result, calculateAreas };
};
