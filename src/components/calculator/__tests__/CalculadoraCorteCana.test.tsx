import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CalculadoraCorteCana from '../CalculadoraCorteCana';
import theme from '../../../styles/theme';

// Mock the toast hook
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => jest.fn(),
}));

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider theme={theme}>
      {component}
    </ChakraProvider>
  );
};

describe('CalculadoraCorteCana', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    expect(screen.getByText('Calculadora de Pagamento de Corte de Cana')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Retângulo' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Triângulo' })).toBeInTheDocument();
  });

  it('should start with rectangle selected by default', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    const rectangleRadio = screen.getByRole('radio', { name: 'Retângulo' });
    const triangleRadio = screen.getByRole('radio', { name: 'Triângulo' });
    
    expect(rectangleRadio).toBeChecked();
    expect(triangleRadio).not.toBeChecked();
  });

  it('should switch shape when radio button is clicked', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    const triangleRadio = screen.getByRole('radio', { name: 'Triângulo' });
    const rectangleRadio = screen.getByRole('radio', { name: 'Retângulo' });
    
    // Switch to triangle
    fireEvent.click(triangleRadio);
    
    expect(triangleRadio).toBeChecked();
    expect(rectangleRadio).not.toBeChecked();
    
    // Switch back to rectangle
    fireEvent.click(rectangleRadio);
    
    expect(rectangleRadio).toBeChecked();
    expect(triangleRadio).not.toBeChecked();
  });

  it('should zero ladoD when switching from rectangle to triangle', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Find input fields using more specific selectors
    const ladoDInput = screen.getByLabelText('Lado D (metros):');
    const triangleRadio = screen.getByRole('radio', { name: 'Triângulo' });
    
    // Set a value in ladoD
    fireEvent.change(ladoDInput, { target: { name: 'ladoD', value: '10' } });
    
    // Verify the value was set
    expect(ladoDInput).toHaveValue(10);
    
    // Switch to triangle
    fireEvent.click(triangleRadio);
    
    // Verify triangle is selected
    expect(triangleRadio).toBeChecked();
    
    // Switch back to rectangle to verify ladoD was zeroed
    const rectangleRadio = screen.getByRole('radio', { name: 'Retângulo' });
    fireEvent.click(rectangleRadio);
    
    // Find ladoD input again and check it's been reset to zero (empty string display)
    const ladoDInputAfter = screen.getByLabelText('Lado D (metros):');
    // When formatInputValue returns '' for value 0, the HTML input value becomes null
    expect(ladoDInputAfter).toHaveValue(null);
  });

  it('should display correct input fields for rectangle shape', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Rectangle should show all 4 sides
    expect(screen.getByLabelText('Lado A (metros):')).toBeInTheDocument();
    expect(screen.getByLabelText('Lado B (metros):')).toBeInTheDocument();
    expect(screen.getByLabelText('Lado C (metros):')).toBeInTheDocument();
    expect(screen.getByLabelText('Lado D (metros):')).toBeInTheDocument();
  });

  it('should display correct input fields for triangle shape', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Switch to triangle
    const triangleRadio = screen.getByRole('radio', { name: 'Triângulo' });
    fireEvent.click(triangleRadio);
    
    // Triangle should show only 3 sides
    expect(screen.getByLabelText('Lado A (metros):')).toBeInTheDocument();
    expect(screen.getByLabelText('Lado B (metros):')).toBeInTheDocument();
    expect(screen.getByLabelText('Lado C (metros):')).toBeInTheDocument();
    expect(screen.queryByLabelText('Lado D (metros):')).not.toBeInTheDocument();
  });

  it('should display financial input fields', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    expect(screen.getByLabelText('Quantidade de Toneladas:')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor por Tonelada (%):')).toBeInTheDocument();
  });

  it('should have calculate button', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    expect(screen.getByRole('button', { name: /calcular/i })).toBeInTheDocument();
  });
});
