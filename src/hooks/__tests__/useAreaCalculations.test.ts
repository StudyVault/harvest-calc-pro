import { renderHook, act } from '@testing-library/react';
import { useAreaCalculations } from '../useAreaCalculations';

describe('useAreaCalculations', () => {
  const mockDimensions = {
    ladoA: 10,
    ladoB: 5,
    ladoC: 8,
    ladoD: 0
  };

  it('should initialize with zero values', () => {
    const { result } = renderHook(() => useAreaCalculations());
    
    expect(result.current.result).toEqual({
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
  });

  it('should calculate rectangle area correctly', () => {
    const { result } = renderHook(() => useAreaCalculations());
    
    act(() => {
      result.current.calculateAreas(mockDimensions, 1700, 25, 'rectangle');
    });

    // Cubagem: ((10+8)/2) * ((5+0)/2) = 9 * 2.5 = 22.5
    // Produção: 22.5 * 1700 = 38250 kg = 38.25 ton
    // Valor: 38.25 * 0.25 = 9.5625 ≈ 9.56
    expect(result.current.result.cubagem).toBe(22.5);
    expect(result.current.result.producaoKg).toBe(38250);
    expect(result.current.result.producaoTon).toBe(38.25);
    expect(result.current.result.valorTotal).toBe(9.56);
    expect(result.current.result.ladosUsados).toEqual({
      ladoA: 10,
      ladoB: 5,
      ladoC: 8,
      ladoD: 0
    });
  });

  it('should calculate triangle area correctly', () => {
    const { result } = renderHook(() => useAreaCalculations());
    const triangleDimensions = {
      ladoA: 10,
      ladoB: 10,
      ladoC: 10,
      ladoD: 0
    };
    
    act(() => {
      result.current.calculateAreas(triangleDimensions, 1700, 25, 'triangle');
    });

    // Cubagem: ((10+10)/2) * (10/2) = 10 * 5 = 50
    // Produção: 50 * 1700 = 85000 kg = 85 ton
    // Valor: 85 * 0.25 = 21.25
    expect(result.current.result.cubagem).toBe(50);
    expect(result.current.result.producaoKg).toBe(85000);
    expect(result.current.result.producaoTon).toBe(85);
    expect(result.current.result.valorTotal).toBe(21.25);
    expect(result.current.result.ladosUsados).toEqual({
      ladoA: 10,
      ladoB: 10,
      ladoC: 10,
      ladoD: 0
    });
  });

  it('should handle zero dimensions', () => {
    const { result } = renderHook(() => useAreaCalculations());
    const zeroDimensions = {
      ladoA: 0,
      ladoB: 0,
      ladoC: 0,
      ladoD: 0
    };
    
    act(() => {
      result.current.calculateAreas(zeroDimensions, 1700, 25, 'triangle');
    });

    expect(result.current.result.cubagem).toBe(0);
    expect(result.current.result.producaoKg).toBe(0);
    expect(result.current.result.producaoTon).toBe(0);
    expect(result.current.result.valorTotal).toBe(0);
  });

  it('should calculate financial values correctly', () => {
    const { result } = renderHook(() => useAreaCalculations());
    const dims = {
      ladoA: 16,
      ladoB: 21,
      ladoC: 27,
      ladoD: 12
    };
    
    act(() => {
      result.current.calculateAreas(dims, 1700, 25, 'rectangle');
    });

    // Cubagem: ((16+27)/2) * ((21+12)/2) = 21.5 * 16.5 = 354.75
    // Produção: 354.75 * 1700 = 603075 kg = 603.075 ton
    // Valor: 603.075 * 0.25 = 150.76875 ≈ 150.77
    expect(result.current.result.valorTotal).toBe(150.77);
  });

  it('should return calculation results', () => {
    const { result } = renderHook(() => useAreaCalculations());
    
    let returnedResult;
    act(() => {
      returnedResult = result.current.calculateAreas(mockDimensions, 3, 20, 'rectangle');
    });

    expect(returnedResult).toEqual(result.current.result);
  });
}); 