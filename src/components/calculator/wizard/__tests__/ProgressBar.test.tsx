// src/components/calculator/wizard/__tests__/ProgressBar.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import ProgressBar from '../components/ProgressBar';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('ProgressBar', () => {
  it('renders 3 phase segments', () => {
    renderWithChakra(<ProgressBar currentPhase="shape" />);
    expect(screen.getByText('Terreno')).toBeInTheDocument();
    expect(screen.getByText('Medidas')).toBeInTheDocument();
    expect(screen.getByText('Pagamento')).toBeInTheDocument();
  });

  it('marks the active phase', () => {
    renderWithChakra(<ProgressBar currentPhase="measure" />);
    const medidas = screen.getByText('Medidas').closest('[data-active]');
    expect(medidas).toBeInTheDocument();
  });
});
