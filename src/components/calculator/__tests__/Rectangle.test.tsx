import { render, screen } from '@testing-library/react';
import Rectangle from '../Rectangle';

describe('Rectangle component', () => {
  const validDimensions = {
    ladoA: 10,
    ladoB: 15,
    ladoC: 10,
    ladoD: 15
  };

  const invalidDimensions = {
    ladoA: 0,
    ladoB: 15,
    ladoC: 10,
    ladoD: 15
  };

  it('renders the component with valid dimensions', () => {
    render(<Rectangle dimensions={validDimensions} />);
    
    // Check if the rectangle is rendered
    const svg = screen.getByLabelText('Visualização do retângulo');
    expect(svg).toBeInTheDocument();
    
    // Check if dimensions are displayed correctly
    expect(screen.getByText(`A=${validDimensions.ladoA}m`)).toBeInTheDocument();
    expect(screen.getByText(`B=${validDimensions.ladoB}m`)).toBeInTheDocument();
    expect(screen.getByText(`C=${validDimensions.ladoC}m`)).toBeInTheDocument();
    expect(screen.getByText(`D=${validDimensions.ladoD}m`)).toBeInTheDocument();
  });

  it('renders the component with invalid dimensions', () => {
    render(<Rectangle dimensions={invalidDimensions} />);
    
    // Check if the rectangle is rendered
    const svg = screen.getByLabelText('Visualização do retângulo');
    expect(svg).toBeInTheDocument();
    
    // Check if dimensions are displayed correctly even when invalid
    expect(screen.getByText(`A=${invalidDimensions.ladoA}m`)).toBeInTheDocument();
    expect(screen.getByText(`B=${invalidDimensions.ladoB}m`)).toBeInTheDocument();
    expect(screen.getByText(`C=${invalidDimensions.ladoC}m`)).toBeInTheDocument();
    expect(screen.getByText(`D=${invalidDimensions.ladoD}m`)).toBeInTheDocument();
  });
  
  it('should apply the correct SVG path classes for valid rectangle', () => {
    const { container } = render(<Rectangle dimensions={validDimensions} />);
    
    // Find the rect element in the SVG
    const rectElement = container.querySelector('rect');
    
    // Check if it has the right classes and stroke
    expect(rectElement).toHaveClass('rectangle-path');
    expect(rectElement).not.toHaveClass('invalid');
    expect(rectElement).toHaveAttribute('stroke', '#2e7d32');
    expect(rectElement).not.toHaveAttribute('strokeDasharray', '5,5');
  });
  
  it('should apply the correct SVG path classes for invalid rectangle', () => {
    const { container } = render(<Rectangle dimensions={invalidDimensions} />);
    
    // Find the rect element in the SVG
    const rectElement = container.querySelector('rect');
    
    // Check if it has the right classes and stroke
    expect(rectElement).toHaveClass('rectangle-path');
    expect(rectElement).toHaveClass('invalid');
    expect(rectElement).toHaveAttribute('stroke', '#d32f2f');
    
    // Check if stroke-dasharray is set (check the actual SVG attribute name)
    expect(rectElement?.getAttribute('stroke-dasharray')).toBe('5,5');
  });
});
