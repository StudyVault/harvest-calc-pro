import { render, screen, act } from '@testing-library/react';
import ResultCard from '../ResultCard';

jest.useFakeTimers();

describe('ResultCard', () => {
  const defaultProps = {
    resultado: {
      cubagem: 50,
      valorTotal: 1000,
      ladosUsados: {
        ladoA: 10,
        ladoB: 5,
        ladoC: 8,
        ladoD: 10
      }
    },
    selectedShape: 'rectangle' as const
  };

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders rectangle results correctly', () => {
    render(<ResultCard {...defaultProps} />);
    
    expect(screen.getByText('Resultados:')).toBeInTheDocument();
    expect(screen.getByText('Lado A: 10 metros')).toBeInTheDocument();
    expect(screen.getByText('Lado B: 5 metros')).toBeInTheDocument();
    expect(screen.getByText('Lado C: 8 metros')).toBeInTheDocument();
    expect(screen.getByText('Lado D: 10 metros')).toBeInTheDocument();
    expect(screen.getByText('Valor da Cubação: 50.00')).toBeInTheDocument();
    expect(screen.getByText('Valor Total: R$ 1.000,00')).toBeInTheDocument();
  });

  it('renders triangle results correctly', () => {
    render(<ResultCard {...defaultProps} selectedShape="triangle" />);
    
    expect(screen.getByText('Resultados:')).toBeInTheDocument();
    expect(screen.getByText('Lado A: 10 metros')).toBeInTheDocument();
    expect(screen.getByText('Lado B: 5 metros')).toBeInTheDocument();
    expect(screen.getByText('Lado C: 8 metros')).toBeInTheDocument();
    expect(screen.queryByText('Lado D: 10 metros')).not.toBeInTheDocument();
    expect(screen.getByText('Área do Triângulo: 50.00 m²')).toBeInTheDocument();
    expect(screen.getByText('Valor Total: R$ 1.000,00')).toBeInTheDocument();
  });

  it('shows countdown timer', () => {
    render(<ResultCard {...defaultProps} />);
    
    expect(screen.getByText('(será ocultado em 60 segundos)')).toBeInTheDocument();

    // Avança 30 segundos
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    
    expect(screen.getByText('(será ocultado em 30 segundos)')).toBeInTheDocument();
  });

  it('shows "ocultando..." when timer reaches zero', () => {
    render(<ResultCard {...defaultProps} />);
    
    // Avança 60 segundos
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    
    expect(screen.getByText('(ocultando...)')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(
      <ResultCard
        {...defaultProps}
        resultado={{
          ...defaultProps.resultado,
          valorTotal: 1234.56
        }}
      />
    );
    
    expect(screen.getByText('Valor Total: R$ 1.234,56')).toBeInTheDocument();
  });

  it('formats decimal values correctly', () => {
    render(
      <ResultCard
        {...defaultProps}
        resultado={{
          ...defaultProps.resultado,
          cubagem: 123.456
        }}
      />
    );
    
    expect(screen.getByText('Valor da Cubação: 123.46')).toBeInTheDocument();
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(<ResultCard {...defaultProps} />);
    
    unmount();
    
    // Verifica se o timer foi limpo
    expect(jest.getTimerCount()).toBe(0);
  });
}); 