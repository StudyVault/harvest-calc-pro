import { renderHook, act } from '@testing-library/react';
import { usePercentageInput } from '../usePercentageInput';

describe('usePercentageInput', () => {
  it('should initialize with correct display value', () => {
    const { result } = renderHook(() => usePercentageInput(0.2));
    expect(result.current.displayValue).toBe('20');
  });

  it('should handle percentage input changes', () => {
    const { result } = renderHook(() => usePercentageInput(0));
    const mockCallback = jest.fn();

    act(() => {
      result.current.handlePercentageChange({
        target: { value: '50' }
      } as any, mockCallback);
    });

    expect(result.current.displayValue).toBe('50');
    expect(mockCallback).toHaveBeenCalledWith(0.5);
  });

  it('should handle empty input', () => {
    const { result } = renderHook(() => usePercentageInput(0));
    const mockCallback = jest.fn();

    act(() => {
      result.current.handlePercentageChange({
        target: { value: '' }
      } as any, mockCallback);
    });

    expect(result.current.displayValue).toBe('');
    expect(mockCallback).toHaveBeenCalledWith(0);
  });

  it('should limit input to 100%', () => {
    const { result } = renderHook(() => usePercentageInput(0));
    const mockCallback = jest.fn();

    act(() => {
      result.current.handlePercentageChange({
        target: { value: '150' }
      } as any, mockCallback);
    });

    expect(result.current.displayValue).toBe('100');
    expect(mockCallback).toHaveBeenCalledWith(1);
  });

  it('should handle non-numeric input', () => {
    const { result } = renderHook(() => usePercentageInput(0));
    const mockCallback = jest.fn();

    act(() => {
      result.current.handlePercentageChange({
        target: { value: 'abc' }
      } as any, mockCallback);
    });

    expect(result.current.displayValue).toBe('');
    expect(mockCallback).toHaveBeenCalledWith(0);
  });

  it('should allow setting display value directly', () => {
    const { result } = renderHook(() => usePercentageInput(0));

    act(() => {
      result.current.setDisplayValue('75');
    });

    expect(result.current.displayValue).toBe('75');
  });

  it('should handle decimal input by removing decimal point', () => {
    const { result } = renderHook(() => usePercentageInput(0));
    const mockCallback = jest.fn();

    act(() => {
      result.current.handlePercentageChange({
        target: { value: '12.5' }
      } as any, mockCallback);
    });

    expect(result.current.displayValue).toBe('100');
    expect(mockCallback).toHaveBeenCalledWith(1);
  });
}); 