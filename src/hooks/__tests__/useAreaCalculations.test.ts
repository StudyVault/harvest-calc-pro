import { renderHook, act } from '@testing-library/react';
import { useAreaCalculations } from '../useAreaCalculations';

describe('useAreaCalculations', () => {
  describe('Rectangle calculations', () => {
    it('should calculate rectangle area correctly', () => {
      const { result } = renderHook(() => useAreaCalculations());
      const dimensions = { ladoA: 5, ladoB: 3, ladoC: 5, ladoD: 3 };
      
      act(() => {
        result.current.calculateAreas(dimensions, 10, 20, 'rectangle');
      });
      
      expect(result.current.result.areaRetangulo).toBe(15); // 5 * 3
      expect(result.current.result.areaTotal).toBe(15);
      expect(result.current.result.valorTotal).toBe(200); // 10 * 20
    });

    it('should handle zero dimensions for rectangle', () => {
      const { result } = renderHook(() => useAreaCalculations());
      const dimensions = { ladoA: 0, ladoB: 0, ladoC: 0, ladoD: 0 };
      
      act(() => {
        result.current.calculateAreas(dimensions, 10, 20, 'rectangle');
      });
      
      expect(result.current.result.areaRetangulo).toBe(0);
      expect(result.current.result.areaTotal).toBe(0);
      expect(result.current.result.valorTotal).toBe(200);
    });
  });

  describe('Triangle calculations', () => {
    it('should calculate triangle area correctly', () => {
      const { result } = renderHook(() => useAreaCalculations());
      const dimensions = { ladoA: 3, ladoB: 4, ladoC: 5, ladoD: 0 };
      
      act(() => {
        result.current.calculateAreas(dimensions, 10, 20, 'triangle');
      });
      
      // Área do triângulo 3-4-5 é 6 (usando fórmula de Heron)
      expect(result.current.result.areaTriangulo).toBeCloseTo(6, 2);
      expect(result.current.result.areaTotal).toBeCloseTo(6, 2);
      expect(result.current.result.valorTotal).toBe(200);
    });

    it('should handle invalid triangle dimensions', () => {
      const { result } = renderHook(() => useAreaCalculations());
      const dimensions = { ladoA: 1, ladoB: 1, ladoC: 3, ladoD: 0 };
      
      act(() => {
        result.current.calculateAreas(dimensions, 10, 20, 'triangle');
      });
      
      expect(result.current.result.areaTriangulo).toBe(0);
      expect(result.current.result.areaTotal).toBe(0);
      expect(result.current.result.valorTotal).toBe(200);
    });
  });

  describe('Financial calculations', () => {
    it('should calculate total value correctly', () => {
      const { result } = renderHook(() => useAreaCalculations());
      const dimensions = { ladoA: 5, ladoB: 3, ladoC: 5, ladoD: 3 };
      
      act(() => {
        result.current.calculateAreas(dimensions, 10, 20, 'rectangle');
      });
      
      expect(result.current.result.valorTotal).toBe(200); // 10 toneladas * R$20,00
    });

    it('should handle zero values', () => {
      const { result } = renderHook(() => useAreaCalculations());
      const dimensions = { ladoA: 5, ladoB: 3, ladoC: 5, ladoD: 3 };
      
      act(() => {
        result.current.calculateAreas(dimensions, 0, 0, 'rectangle');
      });
      
      expect(result.current.result.valorTotal).toBe(0);
    });
  });
}); 