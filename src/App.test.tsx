import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Calculadora de Pagamento de Corte de Cana/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders logo link', () => {
  render(<App />);
  const logoElement = screen.getByRole('link', { name: /harvest calc pro/i });
  expect(logoElement).toBeInTheDocument();
  expect(logoElement).toHaveAttribute('href', '/');
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
  const financialTitle = screen.getByText(/informações financeiras/i);
  const toneladasLabel = screen.getByLabelText(/quantidade de toneladas/i);
  const valorLabel = screen.getByLabelText(/valor por tonelada/i);
  expect(financialTitle).toBeInTheDocument();
  expect(toneladasLabel).toBeInTheDocument();
  expect(valorLabel).toBeInTheDocument();
});
