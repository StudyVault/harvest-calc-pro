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
      areaRetangulo: 0,
      areaTriangulo: 0,
      areaTotal: 0,
      valorTotal: 0
    });
  });

  it('should calculate rectangle area correctly', () => {
    const { result } = renderHook(() => useAreaCalculations());
    
    act(() => {
      result.current.calculateAreas(mockDimensions, 3, 20, 'rectangle');
    });

    expect(result.current.result).toEqual({
      areaRetangulo: 50, // 10 * 5
      areaTriangulo: 0,
      areaTotal: 50,
      valorTotal: 60 // 3 * 20
    });
  });

  it('should calculate triangle area correctly', () => {
    const { result } = renderHook(() => useAreaCalculations());
    const triangleDimensions = {
      ladoA: 3,
      ladoB: 4,
      ladoC: 5,
      ladoD: 0
    };
    
    act(() => {
      result.current.calculateAreas(triangleDimensions, 3, 20, 'triangle');
    });

    expect(result.current.result).toEqual({
      areaRetangulo: 0,
      areaTriangulo: 6, // área do triângulo 3-4-5
      areaTotal: 6,
      valorTotal: 60 // 3 * 20
    });
  });

  it('should handle invalid triangle dimensions', () => {
    const { result } = renderHook(() => useAreaCalculations());
    const invalidTriangleDimensions = {
      ladoA: 1,
      ladoB: 1,
      ladoC: 10, // Triângulo impossível
      ladoD: 0
    };
    
    act(() => {
      result.current.calculateAreas(invalidTriangleDimensions, 3, 20, 'triangle');
    });

    expect(result.current.result).toEqual({
      areaRetangulo: 0,
      areaTriangulo: 0,
      areaTotal: 0,
      valorTotal: 60
    });
  });

  it('should calculate financial values correctly', () => {
    const { result } = renderHook(() => useAreaCalculations());
    
    act(() => {
      result.current.calculateAreas(mockDimensions, 5, 30, 'rectangle');
    });

    expect(result.current.result.valorTotal).toBe(150); // 5 * 30
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