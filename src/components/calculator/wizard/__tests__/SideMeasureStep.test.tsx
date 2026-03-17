// src/components/calculator/wizard/__tests__/SideMeasureStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import SideMeasureStep from '../steps/SideMeasureStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('SideMeasureStep', () => {
  const baseProps = {
    shape: 'rectangle' as const,
    side: 'a' as const,
    value: '',
    onChange: jest.fn(),
    onNext: jest.fn(),
    onBack: jest.fn(),
  };

  it('shows the question for side a (topo)', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} side="a" />);
    expect(screen.getByText(/lado de cima/i)).toBeInTheDocument();
  });

  it('shows the question for side b (esquerda)', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} side="b" />);
    expect(screen.getByText(/lado esquerdo/i)).toBeInTheDocument();
  });

  it('shows the question for side c (base)', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} side="c" />);
    expect(screen.getByText(/lado de baixo/i)).toBeInTheDocument();
  });

  it('shows the question for side d (direita)', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} side="d" />);
    expect(screen.getByText(/lado direito/i)).toBeInTheDocument();
  });

  it('renders input with numeric mode', () => {
    const { container } = renderWithChakra(<SideMeasureStep {...baseProps} />);
    const input = container.querySelector('input[inputmode="numeric"]');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    renderWithChakra(<SideMeasureStep {...baseProps} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '50' } });
    expect(onChange).toHaveBeenCalledWith('50');
  });

  it('shows error message when next is clicked with empty value', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} value="" />);
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    expect(screen.getByText(/maior que zero/i)).toBeInTheDocument();
  });

  it('calls onNext when value is valid', () => {
    const onNext = jest.fn();
    renderWithChakra(<SideMeasureStep {...baseProps} value="50" onNext={onNext} />);
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('shows back button', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} />);
    expect(screen.getByText('← Voltar')).toBeInTheDocument();
  });
});
