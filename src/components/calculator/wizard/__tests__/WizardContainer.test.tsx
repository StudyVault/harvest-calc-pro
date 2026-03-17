// src/components/calculator/wizard/__tests__/WizardContainer.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import WizardContainer from '../WizardContainer';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('WizardContainer', () => {
  it('starts on the shape selection screen', () => {
    renderWithChakra(<WizardContainer />);
    expect(screen.getByText('Como é o seu terreno?')).toBeInTheDocument();
    expect(screen.getByText('RETÂNGULO')).toBeInTheDocument();
    expect(screen.getByText('TRIÂNGULO')).toBeInTheDocument();
  });

  it('advances to first measure step after selecting rectangle', () => {
    renderWithChakra(<WizardContainer />);
    fireEvent.click(screen.getByText('RETÂNGULO'));
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    expect(screen.getByText(/lado de cima/i)).toBeInTheDocument();
  });

  it('goes back from measure step to shape step', () => {
    renderWithChakra(<WizardContainer />);
    fireEvent.click(screen.getByText('RETÂNGULO'));
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    fireEvent.click(screen.getByText('← Voltar'));
    expect(screen.getByText('Como é o seu terreno?')).toBeInTheDocument();
  });

  it('completes full rectangle flow and shows result', () => {
    renderWithChakra(<WizardContainer />);

    // Step 1: select rectangle
    fireEvent.click(screen.getByText('RETÂNGULO'));
    fireEvent.click(screen.getByText('PRÓXIMO →'));

    // Steps 2-5: fill each side
    const sides = ['a', 'b', 'c', 'd'];
    for (const _ of sides) {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.click(screen.getByText('PRÓXIMO →'));
    }

    // Step 6: payment — fill both fields explicitly
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3' } });
    const valorInput = screen.getByRole('textbox');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '20' } });
    fireEvent.click(screen.getByText(/calcular/i));

    // Step 7: result
    expect(screen.getByText(/novo cálculo/i)).toBeInTheDocument();
    expect(screen.getByText(/valor a pagar/i)).toBeInTheDocument();
  });

  it('resets to shape step after NOVO CÁLCULO', () => {
    renderWithChakra(<WizardContainer />);

    // Quick flow to result
    fireEvent.click(screen.getByText('RETÂNGULO'));
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    const sides = ['a', 'b', 'c', 'd'];
    for (const _ of sides) {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.click(screen.getByText('PRÓXIMO →'));
    }
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3' } });
    const valorInput = screen.getByRole('textbox');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '20' } });
    fireEvent.click(screen.getByText(/calcular/i));

    // Reset
    fireEvent.click(screen.getByText(/novo cálculo/i));
    expect(screen.getByText('Como é o seu terreno?')).toBeInTheDocument();
  });
});
