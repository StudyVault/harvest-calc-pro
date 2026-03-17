// src/components/calculator/wizard/__tests__/PaymentStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import PaymentStep from '../steps/PaymentStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('PaymentStep', () => {
  const baseProps = {
    toneladas: '3',
    valorDisplay: '20',
    onToneladasChange: jest.fn(),
    onValorChange: jest.fn(),
    onNext: jest.fn(),
    onBack: jest.fn(),
  };

  it('renders toneladas field', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/toneladas/i)).toBeInTheDocument();
  });

  it('renders valor por tonelada field', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/valor por tonelada/i)).toBeInTheDocument();
  });

  it('shows CALCULAR button', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/calcular/i)).toBeInTheDocument();
  });

  it('shows error when toneladas is zero and CALCULAR clicked', () => {
    renderWithChakra(<PaymentStep {...baseProps} toneladas="0" />);
    fireEvent.click(screen.getByText(/calcular/i));
    expect(screen.getByText('Digite a quantidade de toneladas')).toBeInTheDocument();
  });

  it('calls onNext when all fields are valid', () => {
    const onNext = jest.fn();
    renderWithChakra(<PaymentStep {...baseProps} onNext={onNext} />);
    fireEvent.click(screen.getByText(/calcular/i));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
