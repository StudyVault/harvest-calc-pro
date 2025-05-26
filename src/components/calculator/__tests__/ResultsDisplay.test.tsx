import { render, screen } from '@testing-library/react';
import ResultsDisplay from '../ResultsDisplay';

describe('ResultsDisplay', () => {
  const defaultProps = {
    result: {
      areaRetangulo: 50,
      areaTriangulo: 0,
      areaTotal: 50,
      valorTotal: 1000
    },
    showResults: true,
    selectedShape: 'rectangle' as const
  };

  it('renders rectangle results correctly', () => {
    render(<ResultsDisplay {...defaultProps} />);
    
    expect(screen.getByText('Resultados:')).toBeInTheDocument();
    expect(screen.getByText('Área do Retângulo:')).toBeInTheDocument();
    expect(screen.getAllByText('50.00 m²')).toHaveLength(2);
    expect(screen.getByText('Área Total:')).toBeInTheDocument();
    expect(screen.getByText('R$ 1000.00')).toBeInTheDocument();
  });

  it('renders triangle results correctly', () => {
    render(
      <ResultsDisplay
        {...defaultProps}
        selectedShape="triangle"
        result={{
          ...defaultProps.result,
          areaTriangulo: 30,
          areaTotal: 30
        }}
      />
    );
    
    expect(screen.getByText('Resultados:')).toBeInTheDocument();
    expect(screen.getByText('Área do Triângulo:')).toBeInTheDocument();
    expect(screen.getAllByText('30.00 m²')).toHaveLength(2);
    expect(screen.getByText('Área Total:')).toBeInTheDocument();
    expect(screen.getByText('R$ 1000.00')).toBeInTheDocument();
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
          areaRetangulo: 123.456,
          areaTotal: 123.456,
          valorTotal: 1234.567
        }}
      />
    );
    
    const areaValues = screen.getAllByText('123.46 m²');
    expect(areaValues).toHaveLength(2);
    expect(screen.getByText('R$ 1234.57')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    render(
      <ResultsDisplay
        {...defaultProps}
        result={{
          areaRetangulo: 0,
          areaTriangulo: 0,
          areaTotal: 0,
          valorTotal: 0
        }}
      />
    );
    
    const zeroValues = screen.getAllByText('0.00 m²');
    expect(zeroValues).toHaveLength(2);
    expect(screen.getByText('R$ 0.00')).toBeInTheDocument();
  });
}); 