import { render, screen } from '@testing-library/react';
import ResultsDisplay from '../ResultsDisplay';

describe('ResultsDisplay', () => {
  const defaultProps = {
    result: {
      cubagem: 50,
      producaoKg: 85000,
      producaoTon: 85,
      valorTotal: 1000,
      ladosUsados: {
        ladoA: 10,
        ladoB: 5,
        ladoC: 8,
        ladoD: 10
      }
    },
    showResults: true,
    selectedShape: 'rectangle' as const
  };

  it('renders rectangle results correctly', () => {
    render(<ResultsDisplay {...defaultProps} />);
    
    expect(screen.getByText('Resultados:')).toBeInTheDocument();
    expect(screen.getByText('Cubagem (área):')).toBeInTheDocument();
    expect(screen.getByText(/50\.00 braças²/)).toBeInTheDocument();
    expect(screen.getByText('Produção:')).toBeInTheDocument();
    expect(screen.getByText(/85\.000 kg/)).toBeInTheDocument();
    expect(screen.getByText('Valor Total:')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 1000\.00/)).toBeInTheDocument();
  });

  it('renders triangle results correctly', () => {
    render(
      <ResultsDisplay
        {...defaultProps}
        selectedShape="triangle"
        result={{
          ...defaultProps.result,
          cubagem: 30,
          producaoKg: 51000,
          producaoTon: 51
        }}
      />
    );
    
    expect(screen.getByText('Resultados:')).toBeInTheDocument();
    expect(screen.getByText('Cubagem (área):')).toBeInTheDocument();
    expect(screen.getByText(/30\.00 braças²/)).toBeInTheDocument();
    expect(screen.getByText('Produção:')).toBeInTheDocument();
    expect(screen.getByText('Valor Total:')).toBeInTheDocument();
  });

  it('does not render when showResults is false', () => {
    render(<ResultsDisplay {...defaultProps} showResults={false} />);
    
    expect(screen.queryByText('Resultados:')).not.toBeInTheDocument();
  });

  it('formats decimal values correctly', () => {
    render(
      <ResultsDisplay
        {...defaultProps}
        result={{
          ...defaultProps.result,
          cubagem: 123.46,
          valorTotal: 1234.57
        }}
      />
    );
    
    expect(screen.getByText(/123\.46 braças²/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 1234\.57/)).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    render(
      <ResultsDisplay
        {...defaultProps}
        result={{
          ...defaultProps.result,
          cubagem: 0,
          producaoKg: 0,
          producaoTon: 0,
          valorTotal: 0
        }}
      />
    );
    
    expect(screen.getByText(/0\.00 braças²/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 0\.00/)).toBeInTheDocument();
  });
}); 