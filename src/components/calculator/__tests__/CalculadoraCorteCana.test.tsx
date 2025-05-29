import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CalculadoraCorteCana from '../CalculadoraCorteCana';
import theme from '../../../styles/theme';

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => mockToast,
}));

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

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

  it('should handle input changes correctly', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Test numeric input
    const toneladasInput = screen.getByLabelText('Quantidade de Toneladas:');
    fireEvent.change(toneladasInput, { target: { name: 'toneladas', value: '5' } });
    expect(toneladasInput).toHaveValue(5);
    
    // Test percentage input
    const valorInput = screen.getByLabelText('Valor por Tonelada (%):');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '0.25' } });
    
    // Test dimensional inputs
    const ladoAInput = screen.getByLabelText('Lado A (metros):');
    fireEvent.change(ladoAInput, { target: { name: 'ladoA', value: '10' } });
    expect(ladoAInput).toHaveValue(10);
    
    // Test empty input handling
    fireEvent.change(ladoAInput, { target: { name: 'ladoA', value: '' } });
    expect(ladoAInput).toHaveValue(null); // null when empty string
  });
  
  it('should have calculate button', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    expect(screen.getByRole('button', { name: /calcular/i })).toBeInTheDocument();
  });
  
  it('should show toast error when fields are missing for rectangle calculation', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Don't fill in all required fields for rectangle
    const toneladasInput = screen.getByLabelText('Quantidade de Toneladas:');
    fireEvent.change(toneladasInput, { target: { name: 'toneladas', value: '5' } });
    
    const valorInput = screen.getByLabelText('Valor por Tonelada (%):');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '0.25' } });
    
    // Try to calculate without dimensions
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);
    
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Campos obrigatórios',
      status: 'error'
    }));
  });
  
  it('should show toast error when fields are missing for triangle calculation', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Switch to triangle shape
    const triangleRadio = screen.getByRole('radio', { name: 'Triângulo' });
    fireEvent.click(triangleRadio);
    
    // Don't fill in all required fields for triangle
    const toneladasInput = screen.getByLabelText('Quantidade de Toneladas:');
    fireEvent.change(toneladasInput, { target: { name: 'toneladas', value: '5' } });
    
    const valorInput = screen.getByLabelText('Valor por Tonelada (%):');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '0.25' } });
    
    // Try to calculate without dimensions
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);
    
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Campos obrigatórios',
      status: 'error'
    }));
  });
  
  it('should validate toneladas value', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Fill in all required fields but with invalid toneladas
    const toneladasInput = screen.getByLabelText('Quantidade de Toneladas:');
    fireEvent.change(toneladasInput, { target: { name: 'toneladas', value: '0' } });
    
    const valorInput = screen.getByLabelText('Valor por Tonelada (%):');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '0.25' } });
    
    const ladoAInput = screen.getByLabelText('Lado A (metros):');
    fireEvent.change(ladoAInput, { target: { name: 'ladoA', value: '10' } });
    
    const ladoBInput = screen.getByLabelText('Lado B (metros):');
    fireEvent.change(ladoBInput, { target: { name: 'ladoB', value: '10' } });
    
    const ladoCInput = screen.getByLabelText('Lado C (metros):');
    fireEvent.change(ladoCInput, { target: { name: 'ladoC', value: '10' } });
    
    const ladoDInput = screen.getByLabelText('Lado D (metros):');
    fireEvent.change(ladoDInput, { target: { name: 'ladoD', value: '10' } });
    
    // Try to calculate
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);
    
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Quantidade de toneladas inválida',
      status: 'error'
    }));
  });
  
  it('should validate valorPorTonelada value', () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Fill in all required fields but with invalid valor
    const toneladasInput = screen.getByLabelText('Quantidade de Toneladas:');
    fireEvent.change(toneladasInput, { target: { name: 'toneladas', value: '5' } });
    
    const valorInput = screen.getByLabelText('Valor por Tonelada (%):');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '0' } });
    
    const ladoAInput = screen.getByLabelText('Lado A (metros):');
    fireEvent.change(ladoAInput, { target: { name: 'ladoA', value: '10' } });
    
    const ladoBInput = screen.getByLabelText('Lado B (metros):');
    fireEvent.change(ladoBInput, { target: { name: 'ladoB', value: '10' } });
    
    const ladoCInput = screen.getByLabelText('Lado C (metros):');
    fireEvent.change(ladoCInput, { target: { name: 'ladoC', value: '10' } });
    
    const ladoDInput = screen.getByLabelText('Lado D (metros):');
    fireEvent.change(ladoDInput, { target: { name: 'ladoD', value: '10' } });
    
    // Try to calculate
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);
    
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valor por tonelada inválido',
      status: 'error'
    }));
  });
  
  it('should perform rectangle calculation correctly', async () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Fill in all fields for rectangle
    const toneladasInput = screen.getByLabelText('Quantidade de Toneladas:');
    fireEvent.change(toneladasInput, { target: { name: 'toneladas', value: '5' } });
    
    const valorInput = screen.getByLabelText('Valor por Tonelada (%):');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '0.25' } });
    
    const ladoAInput = screen.getByLabelText('Lado A (metros):');
    fireEvent.change(ladoAInput, { target: { name: 'ladoA', value: '10' } });
    
    const ladoBInput = screen.getByLabelText('Lado B (metros):');
    fireEvent.change(ladoBInput, { target: { name: 'ladoB', value: '10' } });
    
    const ladoCInput = screen.getByLabelText('Lado C (metros):');
    fireEvent.change(ladoCInput, { target: { name: 'ladoC', value: '10' } });
    
    const ladoDInput = screen.getByLabelText('Lado D (metros):');
    fireEvent.change(ladoDInput, { target: { name: 'ladoD', value: '10' } });
    
    // Calculate
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);
    
    // Success toast should be shown
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cálculo realizado',
      status: 'success'
    }));
    
    // Advance timer to test hiding results
    jest.advanceTimersByTime(60000);
  });
  
  it('should perform triangle calculation correctly', async () => {
    renderWithChakra(<CalculadoraCorteCana />);
    
    // Switch to triangle
    const triangleRadio = screen.getByRole('radio', { name: 'Triângulo' });
    fireEvent.click(triangleRadio);
    
    // Fill in all fields for triangle
    const toneladasInput = screen.getByLabelText('Quantidade de Toneladas:');
    fireEvent.change(toneladasInput, { target: { name: 'toneladas', value: '5' } });
    
    const valorInput = screen.getByLabelText('Valor por Tonelada (%):');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '0.25' } });
    
    const ladoAInput = screen.getByLabelText('Lado A (metros):');
    fireEvent.change(ladoAInput, { target: { name: 'ladoA', value: '10' } });
    
    const ladoBInput = screen.getByLabelText('Lado B (metros):');
    fireEvent.change(ladoBInput, { target: { name: 'ladoB', value: '10' } });
    
    const ladoCInput = screen.getByLabelText('Lado C (metros):');
    fireEvent.change(ladoCInput, { target: { name: 'ladoC', value: '10' } });
    
    // Calculate
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);
    
    // Success toast should be shown
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cálculo realizado',
      status: 'success'
    }));
  });
});
