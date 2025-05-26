import { renderHook, act } from '@testing-library/react';
import { useFormState } from '../useFormState';

describe('useFormState', () => {
  const initialDimensions = {
    ladoA: 0,
    ladoB: 0,
    ladoC: 0,
    ladoD: 0
  };

  const initialFinancialData = {
    toneladas: 3,
    valorPorTonelada: 20.00
  };

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFormState());
    
    expect(result.current.dimensions).toEqual(initialDimensions);
    expect(result.current.financialData).toEqual(initialFinancialData);
  });

  it('should update dimension values', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.handleDimensionChange({
        target: { name: 'ladoA', value: '10' }
      } as any);
    });

    expect(result.current.dimensions).toEqual({
      ...initialDimensions,
      ladoA: 10
    });
  });

  it('should handle invalid dimension values', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.handleDimensionChange({
        target: { name: 'ladoA', value: '' }
      } as any);
    });

    expect(result.current.dimensions).toEqual({
      ...initialDimensions,
      ladoA: 0
    });
  });

  it('should update financial data', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.handleFinancialChange({
        target: { name: 'toneladas', value: '5' }
      } as any);
    });

    expect(result.current.financialData).toEqual({
      ...initialFinancialData,
      toneladas: 5
    });
  });

  it('should handle invalid financial values', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.handleFinancialChange({
        target: { name: 'valorPorTonelada', value: '' }
      } as any);
    });

    expect(result.current.financialData).toEqual({
      ...initialFinancialData,
      valorPorTonelada: 0
    });
  });

  it('should update multiple dimensions', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.handleDimensionChange({
        target: { name: 'ladoA', value: '10' }
      } as any);
      result.current.handleDimensionChange({
        target: { name: 'ladoB', value: '20' }
      } as any);
    });

    expect(result.current.dimensions).toEqual({
      ...initialDimensions,
      ladoA: 10,
      ladoB: 20
    });
  });

  it('should allow setting financial data directly', () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setFinancialData({
        toneladas: 10,
        valorPorTonelada: 30
      });
    });

    expect(result.current.financialData).toEqual({
      toneladas: 10,
      valorPorTonelada: 30
    });
  });
}); 