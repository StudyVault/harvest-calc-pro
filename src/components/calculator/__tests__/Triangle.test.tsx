import { render, screen } from '@testing-library/react';
import Triangle from '../Triangle';
import * as validation from '../../../utils/validation';

// Spy on the validation function
jest.spyOn(validation, 'validateTriangleInequality');

describe('Triangle component', () => {
  const validDimensions = {
    ladoA: 3,
    ladoB: 4,
    ladoC: 5,
    ladoD: 0 // Not used for triangles
  };

  const invalidDimensions = {
    ladoA: 1,
    ladoB: 1,
    ladoC: 10, // Violates triangle inequality
    ladoD: 0
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Set default return value for validation
    (validation.validateTriangleInequality as jest.Mock).mockImplementation(
      (a, b, c) => a + b > c && a + c > b && b + c > a
    );
  });

  it('renders the component with valid dimensions', () => {
    render(<Triangle dimensions={validDimensions} />);
    
    // Check if the triangle is rendered
    const svg = screen.getByLabelText('Visualização do triângulo');
    expect(svg).toBeInTheDocument();
    
    // Check if dimensions are displayed correctly
    expect(screen.getByText(`A=${validDimensions.ladoA}m`)).toBeInTheDocument();
    expect(screen.getByText(`B=${validDimensions.ladoB}m`)).toBeInTheDocument();
    expect(screen.getByText(`C=${validDimensions.ladoC}m`)).toBeInTheDocument();
    
    // Validate that the validation function was called
    expect(validation.validateTriangleInequality).toHaveBeenCalledWith(
      validDimensions.ladoA,
      validDimensions.ladoB,
      validDimensions.ladoC
    );
  });

  it('renders the component with invalid dimensions', () => {
    render(<Triangle dimensions={invalidDimensions} />);
    
    // Check if the triangle is still rendered despite being invalid
    const svg = screen.getByLabelText('Visualização do triângulo');
    expect(svg).toBeInTheDocument();
    
    // Check if dimensions are displayed correctly even when invalid
    expect(screen.getByText(`A=${invalidDimensions.ladoA}m`)).toBeInTheDocument();
    expect(screen.getByText(`B=${invalidDimensions.ladoB}m`)).toBeInTheDocument();
    expect(screen.getByText(`C=${invalidDimensions.ladoC}m`)).toBeInTheDocument();
  });
  
  it('should apply the correct SVG path classes for valid triangle', () => {
    const { container } = render(<Triangle dimensions={validDimensions} />);
    
    // Find the path element in the SVG
    const pathElement = container.querySelector('path');
    
    // Check if it has the right classes and stroke
    expect(pathElement).toHaveClass('triangle-path');
    expect(pathElement).not.toHaveClass('invalid');
    expect(pathElement).toHaveAttribute('stroke', '#2e7d32');
    expect(pathElement).not.toHaveAttribute('strokeDasharray', '5,5');
  });
  
  it('should apply the correct SVG path classes for invalid triangle', () => {
    const { container } = render(<Triangle dimensions={invalidDimensions} />);
    
    // Find the path element in the SVG
    const pathElement = container.querySelector('path');
    
    // Check if it has the right classes and stroke
    expect(pathElement).toHaveClass('triangle-path');
    expect(pathElement).toHaveClass('invalid');
    expect(pathElement).toHaveAttribute('stroke', '#d32f2f');
    
    // Check if stroke-dasharray is set (check the actual SVG attribute name)
    expect(pathElement?.getAttribute('stroke-dasharray')).toBe('5,5');
  });
});
