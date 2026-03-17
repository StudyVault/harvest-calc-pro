// src/components/calculator/wizard/__tests__/ResultStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import ResultStep from '../steps/ResultStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('ResultStep', () => {
  // area=100 braças², produtividade=1700 kg/br², valorCentavos=25
  // toneladas = 100 * 1700 / 1000 = 170
  // valorTotal = 170 * 0.25 = R$ 42.50
  const baseProps = {
    valorTotal: 42.5,
    area: 100,
    produtividade: 1700,
    valorCentavos: 25,
    onNewCalculation: jest.fn(),
  };

  it('displays the formatted currency value', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.getByText(/42,50/)).toBeInTheDocument();
  });

  it('displays the area', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
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
