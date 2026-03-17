import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

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

test('renders wizard shape selection step', () => {
  render(<App />);
  const question = screen.getByText(/como é o seu terreno/i);
  expect(question).toBeInTheDocument();
});

test('renders rectangle and triangle shape buttons', () => {
  render(<App />);
  const financialTitle = screen.getByText(/informações financeiras/i);
  const toneladasLabel = screen.getByLabelText(/quantidade de toneladas/i);
  const valorLabel = screen.getByLabelText(/valor por tonelada/i);
  expect(financialTitle).toBeInTheDocument();
  expect(toneladasLabel).toBeInTheDocument();
  expect(valorLabel).toBeInTheDocument();
});
