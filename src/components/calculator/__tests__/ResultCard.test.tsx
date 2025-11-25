import { render, screen, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ResultCard from '../ResultCard';
import theme from '../../../styles/theme';

jest.useFakeTimers();

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider theme={theme}>
      {component}
    </ChakraProvider>
  );
};

describe('ResultCard', () => {
  const defaultProps = {
    resultado: {
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
    selectedShape: 'rectangle' as const
  };

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders rectangle results correctly', () => {
    render(<ResultCard {...defaultProps} />);

    expect(screen.getByText('Resultado do Cálculo')).toBeInTheDocument();
    expect(screen.getByText(/Lado A:/)).toBeInTheDocument();
    expect(screen.getByText(/Lado B:/)).toBeInTheDocument();
    expect(screen.getByText(/Lado C:/)).toBeInTheDocument();
    expect(screen.getByText(/Lado D:/)).toBeInTheDocument();
    expect(screen.getByText(/Cubagem \(área do talhão\):/)).toBeInTheDocument();
    expect(screen.getByText(/Produção estimada:/)).toBeInTheDocument();
    expect(screen.getByText(/Valor total do pagamento:/)).toBeInTheDocument();
  });

  it('renders triangle results correctly', () => {
    render(<ResultCard {...defaultProps} selectedShape="triangle" />);

    expect(screen.getByText('Resultado do Cálculo')).toBeInTheDocument();
    expect(screen.getByText(/Lado A:/)).toBeInTheDocument();
    expect(screen.getByText(/Lado B:/)).toBeInTheDocument();
    expect(screen.getByText(/Lado C:/)).toBeInTheDocument();
    expect(screen.queryByText(/Lado D:/)).not.toBeInTheDocument();
    expect(screen.getByText(/Cubagem \(área do talhão\):/)).toBeInTheDocument();
    expect(screen.getByText(/Valor total do pagamento:/)).toBeInTheDocument();
  });

  it('shows countdown timer', () => {
    render(<ResultCard {...defaultProps} />);

    expect(screen.getByText(/visível por 120s/)).toBeInTheDocument();

    // Avança 30 segundos
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(screen.getByText(/visível por 90s/)).toBeInTheDocument();
  });

  it('calls onTimeExpired when timer reaches zero', () => {
    const mockOnTimeExpired = jest.fn();
    render(<ResultCard {...defaultProps} onTimeExpired={mockOnTimeExpired} />);

    // Avança 120 segundos
    act(() => {
      jest.advanceTimersByTime(120000);
    });

    expect(mockOnTimeExpired).toHaveBeenCalled();
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

    expect(screen.getByText(/R\$ 1\.234,56/)).toBeInTheDocument();
  });

  it('formats decimal values correctly', () => {
    render(
      <ResultCard
        {...defaultProps}
        resultado={{
          ...defaultProps.resultado,
          cubagem: 123.46
        }}
      />
    );

    expect(screen.getByText(/123\.46/)).toBeInTheDocument();
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(<ResultCard {...defaultProps} />);

    unmount();

    // Verifica se o timer foi limpo
    expect(jest.getTimerCount()).toBe(0);
  });
}); 