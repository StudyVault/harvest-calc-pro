// src/components/calculator/wizard/__tests__/ResultStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import ResultStep from '../steps/ResultStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('ResultStep', () => {
  const baseProps = {
    valorTotal: 1260.0,
    area: 210,
    toneladas: 3,
    valorPorTonelada: 0.2,
    onNewCalculation: jest.fn(),
  };

  it('displays the formatted currency value', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.getByText(/1\.260,00/)).toBeInTheDocument();
  });

  it('displays the area', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.getByText(/210/)).toBeInTheDocument();
  });

  it('shows NOVO CÁLCULO button', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.getByText(/novo cálculo/i)).toBeInTheDocument();
  });

  it('calls onNewCalculation when button clicked', () => {
    const onNewCalculation = jest.fn();
    renderWithChakra(<ResultStep {...baseProps} onNewCalculation={onNewCalculation} />);
    fireEvent.click(screen.getByText(/novo cálculo/i));
    expect(onNewCalculation).toHaveBeenCalledTimes(1);
  });

  it('does not have a countdown timer', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.queryByText(/segundo/i)).not.toBeInTheDocument();
  });
});
