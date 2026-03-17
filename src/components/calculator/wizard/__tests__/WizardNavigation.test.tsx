// src/components/calculator/wizard/__tests__/WizardNavigation.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import WizardNavigation from '../components/WizardNavigation';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('WizardNavigation', () => {
  it('renders next button with label', () => {
    renderWithChakra(
      <WizardNavigation onNext={jest.fn()} nextLabel="PRÓXIMO" showBack={false} />
    );
    expect(screen.getByText('PRÓXIMO')).toBeInTheDocument();
  });

  it('hides back button when showBack is false', () => {
    renderWithChakra(
      <WizardNavigation onNext={jest.fn()} nextLabel="PRÓXIMO" showBack={false} />
    );
    expect(screen.queryByText('← Voltar')).not.toBeInTheDocument();
  });

  it('shows back button when showBack is true', () => {
    renderWithChakra(
      <WizardNavigation onNext={jest.fn()} nextLabel="PRÓXIMO" showBack={true} onBack={jest.fn()} />
    );
    expect(screen.getByText('← Voltar')).toBeInTheDocument();
  });

  it('calls onNext when next button clicked', () => {
    const onNext = jest.fn();
    renderWithChakra(
      <WizardNavigation onNext={onNext} nextLabel="PRÓXIMO" showBack={false} />
    );
    fireEvent.click(screen.getByText('PRÓXIMO'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button clicked', () => {
    const onBack = jest.fn();
    renderWithChakra(
      <WizardNavigation onNext={jest.fn()} nextLabel="PRÓXIMO" showBack={true} onBack={onBack} />
    );
    fireEvent.click(screen.getByText('← Voltar'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
