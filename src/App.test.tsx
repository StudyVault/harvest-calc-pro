import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Calculadora de Pagamento de Corte de Cana/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders main title', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { name: /harvest calc pro/i });
  expect(titleElement).toBeInTheDocument();
});

test('renders logo image', () => {
  render(<App />);
  const logoElement = screen.getByRole('img', { name: /logo/i });
  expect(logoElement).toBeInTheDocument();
  expect(logoElement).toHaveAttribute('src', './logo.svg');
});

test('renders shape selection radio buttons', () => {
  render(<App />);
  const rectangleRadio = screen.getByRole('radio', { name: /retângulo/i });
  const triangleRadio = screen.getByRole('radio', { name: /triângulo/i });
  expect(rectangleRadio).toBeInTheDocument();
  expect(triangleRadio).toBeInTheDocument();
  expect(rectangleRadio).toBeChecked();
  expect(triangleRadio).not.toBeChecked();
});

test('renders financial information section', () => {
  render(<App />);
  const financialTitle = screen.getByText(/produtividade e pagamento/i);
  expect(financialTitle).toBeInTheDocument();
  // Check for inputs by placeholder since labels aren't connected
  const produtividadeInput = screen.getByPlaceholderText('1700');
  const valorInput = screen.getByPlaceholderText('25');
  expect(produtividadeInput).toBeInTheDocument();
  expect(valorInput).toBeInTheDocument();
});
