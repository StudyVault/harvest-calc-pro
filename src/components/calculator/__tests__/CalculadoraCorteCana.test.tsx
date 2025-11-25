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

// Helper to get input by name attribute
const getInputByName = (name: string) => {
  const allInputs = screen.getAllByRole('spinbutton');
  const input = allInputs.find(inp => (inp as HTMLInputElement).name === name);
  if (!input) throw new Error(`Input with name "${name}" not found`);
  return input as HTMLInputElement;
};

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

    // Get all numeric inputs and find ladoD (4th dimension input after A, B, C)
    const allInputs = screen.getAllByRole('spinbutton');
    const ladoDInput = allInputs.find(input => (input as HTMLInputElement).name === 'ladoD');

    if (!ladoDInput) throw new Error('ladoD input not found');

    // Set a value in ladoD
    fireEvent.change(ladoDInput, { target: { name: 'ladoD', value: '10' } });

    // Verify the value was set
    expect(ladoDInput).toHaveValue(10);

    // Switch to triangle
    const triangleRadio = screen.getByRole('radio', { name: 'Triângulo' });
    fireEvent.click(triangleRadio);

    // Verify triangle is selected
    expect(triangleRadio).toBeChecked();

    // Switch back to rectangle to verify ladoD was zeroed
    const rectangleRadio = screen.getByRole('radio', { name: 'Retângulo' });
    fireEvent.click(rectangleRadio);

    // Find ladoD input again and check it's been reset to zero (empty string display)
    const allInputsAfter = screen.getAllByRole('spinbutton');
    const ladoDInputAfter = allInputsAfter.find(input => (input as HTMLInputElement).name === 'ladoD');
    if (!ladoDInputAfter) throw new Error('ladoD input not found after switch');
    // When formatInputValue returns '' for value 0, the HTML input value becomes null
    expect(ladoDInputAfter).toHaveValue(null);
  });

  it('should display correct input fields for rectangle shape', () => {
    renderWithChakra(<CalculadoraCorteCana />);

    // Rectangle should show all 4 sides - check by text labels
    expect(screen.getByText('Lado A (braças):')).toBeInTheDocument();
    expect(screen.getByText('Lado B (braças):')).toBeInTheDocument();
    expect(screen.getByText('Lado C (braças):')).toBeInTheDocument();
    expect(screen.getByText('Lado D (braças):')).toBeInTheDocument();
  });

  it('should display correct input fields for triangle shape', () => {
    renderWithChakra(<CalculadoraCorteCana />);

    // Switch to triangle
    const triangleRadio = screen.getByRole('radio', { name: 'Triângulo' });
    fireEvent.click(triangleRadio);

    // Triangle should show only 3 sides
    expect(screen.getByText('Lado A (base 1):')).toBeInTheDocument();
    expect(screen.getByText('Lado B (base 2):')).toBeInTheDocument();
    expect(screen.getByText('Lado C (altura):')).toBeInTheDocument();
    expect(screen.queryByText('Lado D (braças):')).not.toBeInTheDocument();
  });

  it('should display financial input fields', () => {
    renderWithChakra(<CalculadoraCorteCana />);

    expect(screen.getByText('Produtividade (kg por braça²):')).toBeInTheDocument();
    expect(screen.getByText('Valor por Tonelada (centavos):')).toBeInTheDocument();
  });

  it('should handle input changes correctly', () => {
    renderWithChakra(<CalculadoraCorteCana />);

    // Test numeric input using placeholder
    const produtividadeInput = screen.getByPlaceholderText('1700');
    fireEvent.change(produtividadeInput, { target: { name: 'produtividade', value: '1700' } });
    expect(produtividadeInput).toHaveValue(1700);

    // Test percentage input using placeholder
    const valorInput = screen.getByPlaceholderText('25');
    fireEvent.change(valorInput, { target: { name: 'valorPorKg', value: '25' } });

    // Test dimensional inputs using name attribute
    const allInputs = screen.getAllByRole('spinbutton');
    const ladoAInput = allInputs.find(input => (input as HTMLInputElement).name === 'ladoA');
    if (!ladoAInput) throw new Error('ladoA input not found');

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
    const produtividadeInput = screen.getByPlaceholderText('1700');
    fireEvent.change(produtividadeInput, { target: { name: 'produtividade', value: '1700' } });

    const valorInput = screen.getByPlaceholderText('25');
    fireEvent.change(valorInput, { target: { name: 'valorPorKg', value: '25' } });

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
    const produtividadeInput = screen.getByPlaceholderText('1700');
    fireEvent.change(produtividadeInput, { target: { name: 'produtividade', value: '1700' } });

    const valorInput = screen.getByPlaceholderText('25');
    fireEvent.change(valorInput, { target: { name: 'valorPorKg', value: '25' } });

    // Try to calculate without dimensions
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);

    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Campos obrigatórios',
      status: 'error'
    }));
  });

  it('should validate produtividade value', () => {
    renderWithChakra(<CalculadoraCorteCana />);

    // Fill in all required fields but with invalid produtividade
    const produtividadeInput = screen.getByPlaceholderText('1700');
    fireEvent.change(produtividadeInput, { target: { name: 'produtividade', value: '0' } });

    const valorInput = screen.getByPlaceholderText('25');
    fireEvent.change(valorInput, { target: { name: 'valorPorKg', value: '25' } });

    fireEvent.change(getInputByName('ladoA'), { target: { name: 'ladoA', value: '10' } });
    fireEvent.change(getInputByName('ladoB'), { target: { name: 'ladoB', value: '10' } });
    fireEvent.change(getInputByName('ladoC'), { target: { name: 'ladoC', value: '10' } });
    fireEvent.change(getInputByName('ladoD'), { target: { name: 'ladoD', value: '10' } });

    // Try to calculate
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);

    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Produtividade inválida',
      status: 'error'
    }));
  });

  it('should validate valorPorKg value', () => {
    renderWithChakra(<CalculadoraCorteCana />);

    // Fill in all required fields but with invalid valor
    const produtividadeInput = screen.getByPlaceholderText('1700');
    fireEvent.change(produtividadeInput, { target: { name: 'produtividade', value: '1700' } });

    const valorInput = screen.getByPlaceholderText('25');
    fireEvent.change(valorInput, { target: { name: 'valorPorKg', value: '0' } });

    fireEvent.change(getInputByName('ladoA'), { target: { name: 'ladoA', value: '10' } });
    fireEvent.change(getInputByName('ladoB'), { target: { name: 'ladoB', value: '10' } });
    fireEvent.change(getInputByName('ladoC'), { target: { name: 'ladoC', value: '10' } });
    fireEvent.change(getInputByName('ladoD'), { target: { name: 'ladoD', value: '10' } });

    // Try to calculate
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);

    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valor por kg inválido',
      status: 'error'
    }));
  });

  it('should perform rectangle calculation correctly', async () => {
    renderWithChakra(<CalculadoraCorteCana />);

    // Fill in all fields for rectangle
    const produtividadeInput = screen.getByPlaceholderText('1700');
    fireEvent.change(produtividadeInput, { target: { name: 'produtividade', value: '1700' } });

    const valorInput = screen.getByPlaceholderText('25');
    fireEvent.change(valorInput, { target: { name: 'valorPorKg', value: '25' } });

    fireEvent.change(getInputByName('ladoA'), { target: { name: 'ladoA', value: '10' } });
    fireEvent.change(getInputByName('ladoB'), { target: { name: 'ladoB', value: '10' } });
    fireEvent.change(getInputByName('ladoC'), { target: { name: 'ladoC', value: '10' } });
    fireEvent.change(getInputByName('ladoD'), { target: { name: 'ladoD', value: '10' } });

    // Calculate
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);

    // Success toast should be shown
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cálculo realizado com sucesso',
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
    const produtividadeInput = screen.getByPlaceholderText('1700');
    fireEvent.change(produtividadeInput, { target: { name: 'produtividade', value: '1700' } });

    const valorInput = screen.getByPlaceholderText('25');
    fireEvent.change(valorInput, { target: { name: 'valorPorKg', value: '25' } });

    fireEvent.change(getInputByName('ladoA'), { target: { name: 'ladoA', value: '10' } });
    fireEvent.change(getInputByName('ladoB'), { target: { name: 'ladoB', value: '10' } });
    fireEvent.change(getInputByName('ladoC'), { target: { name: 'ladoC', value: '10' } });

    // Calculate
    const calcButton = screen.getByRole('button', { name: /calcular/i });
    fireEvent.click(calcButton);

    // Success toast should be shown
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cálculo realizado com sucesso',
      status: 'success'
    }));
  });
});
