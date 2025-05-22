import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Harvest Calc Pro/i);
  expect(titleElement).toBeInTheDocument();
});
