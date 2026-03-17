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
    produtividade: '1700',
    valorCentavos: '25',
    onProdutividadeChange: jest.fn(),
    onValorCentavosChange: jest.fn(),
    onNext: jest.fn(),
    onBack: jest.fn(),
  };

  it('renders produtividade field', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/produtividade/i)).toBeInTheDocument();
  });

  it('renders valor por tonelada field', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/valor por tonelada/i)).toBeInTheDocument();
  });

  it('shows CALCULAR button', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/calcular/i)).toBeInTheDocument();
  });

  it('shows error when produtividade is zero and CALCULAR clicked', () => {
    renderWithChakra(<PaymentStep {...baseProps} produtividade="0" />);
    fireEvent.click(screen.getByText(/calcular/i));
    expect(screen.getByText('Digite a produtividade em kg por braça²')).toBeInTheDocument();
  });

  it('shows error when valorCentavos is zero and CALCULAR clicked', () => {
    renderWithChakra(<PaymentStep {...baseProps} valorCentavos="0" />);
    fireEvent.click(screen.getByText(/calcular/i));
    expect(screen.getByText('Digite o valor por tonelada em centavos')).toBeInTheDocument();
  });

  it('calls onNext when all fields are valid', () => {
    const onNext = jest.fn();
    renderWithChakra(<PaymentStep {...baseProps} onNext={onNext} />);
    fireEvent.click(screen.getByText(/calcular/i));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
