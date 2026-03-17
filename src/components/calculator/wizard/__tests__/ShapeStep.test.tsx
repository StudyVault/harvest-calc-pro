// src/components/calculator/wizard/__tests__/ShapeStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import ShapeStep from '../steps/ShapeStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('ShapeStep', () => {
  it('renders both shape options', () => {
    renderWithChakra(<ShapeStep selected={null} onSelect={jest.fn()} />);
    expect(screen.getByText('RETÂNGULO')).toBeInTheDocument();
    expect(screen.getByText('TRIÂNGULO')).toBeInTheDocument();
  });

  it('calls onSelect with rectangle when rectangle is clicked', () => {
    const onSelect = jest.fn();
    renderWithChakra(<ShapeStep selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('RETÂNGULO'));
    expect(onSelect).toHaveBeenCalledWith('rectangle');
  });

  it('calls onSelect with triangle when triangle is clicked', () => {
    const onSelect = jest.fn();
    renderWithChakra(<ShapeStep selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('TRIÂNGULO'));
    expect(onSelect).toHaveBeenCalledWith('triangle');
  });

  it('shows PRÓXIMO button', () => {
    renderWithChakra(<ShapeStep selected="rectangle" onSelect={jest.fn()} onNext={jest.fn()} />);
    expect(screen.getByText('PRÓXIMO →')).toBeInTheDocument();
  });
});
