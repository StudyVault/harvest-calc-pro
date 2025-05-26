import { renderHook } from '@testing-library/react';
import { useCurrencyInput } from '../useCurrencyInput';

describe('useCurrencyInput', () => {
  it('should format currency values correctly', () => {
    const { result } = renderHook(() => useCurrencyInput());
    
    expect(result.current.formatCurrency(1234.56)).toBe('1.234,56');
    expect(result.current.formatCurrency(0)).toBe('0,00');
    expect(result.current.formatCurrency(1)).toBe('1,00');
    expect(result.current.formatCurrency(999999.99)).toBe('999.999,99');
  });

  it('should handle currency input changes', () => {
    const { result } = renderHook(() => useCurrencyInput());
    const mockCallback = jest.fn();

    const formattedValue = result.current.handleCurrencyChange({
      target: { value: '1234,56' }
    } as any, mockCallback);

    expect(formattedValue).toBe('1234,56');
    expect(mockCallback).toHaveBeenCalledWith(1234.56);
  });

  it('should handle empty input', () => {
    const { result } = renderHook(() => useCurrencyInput());
    const mockCallback = jest.fn();

    const formattedValue = result.current.handleCurrencyChange({
      target: { value: '' }
    } as any, mockCallback);

    expect(formattedValue).toBe('0,00');
    expect(mockCallback).toHaveBeenCalledWith(0);
  });

  it('should handle input with only decimals', () => {
    const { result } = renderHook(() => useCurrencyInput());
    const mockCallback = jest.fn();

    const formattedValue = result.current.handleCurrencyChange({
      target: { value: '0,42' }
    } as any, mockCallback);

    expect(formattedValue).toBe('0,42');
    expect(mockCallback).toHaveBeenCalledWith(0.42);
  });

  it('should handle non-numeric input', () => {
    const { result } = renderHook(() => useCurrencyInput());
    const mockCallback = jest.fn();

    const formattedValue = result.current.handleCurrencyChange({
      target: { value: 'abc' }
    } as any, mockCallback);

    expect(formattedValue).toBe('0,00');
    expect(mockCallback).toHaveBeenCalledWith(0);
  });

  it('should preserve large numbers', () => {
    const { result } = renderHook(() => useCurrencyInput());
    const mockCallback = jest.fn();

    const formattedValue = result.current.handleCurrencyChange({
      target: { value: '1000000,00' }
    } as any, mockCallback);

    expect(formattedValue).toBe('1000000,00');
    expect(mockCallback).toHaveBeenCalledWith(1000000);
  });

  it('should handle multiple decimal separators', () => {
    const { result } = renderHook(() => useCurrencyInput());
    const mockCallback = jest.fn();

    const formattedValue = result.current.handleCurrencyChange({
      target: { value: '123,45,67' }
    } as any, mockCallback);

    expect(formattedValue).toBe('12345,67');
    expect(mockCallback).toHaveBeenCalledWith(12345.67);
  });
}); 