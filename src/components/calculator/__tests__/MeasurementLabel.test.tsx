import { render, screen } from '@testing-library/react';
import MeasurementLabel from '../MeasurementLabel';

describe('MeasurementLabel', () => {
  const defaultProps = {
    label: 'A',
    value: 10,
    x: 100,
    y: 50
  };

  it('renders label and value correctly', () => {
    render(<svg><MeasurementLabel {...defaultProps} /></svg>);
    
    expect(screen.getByText('A=10m')).toBeInTheDocument();
  });

  it('positions the label correctly', () => {
    render(<svg><MeasurementLabel {...defaultProps} /></svg>);
    
    const foreignObject = screen.getByText('A=10m').closest('foreignObject');
    expect(foreignObject).toHaveAttribute('x', '100');
    expect(foreignObject).toHaveAttribute('y', '50');
  });

  it('renders with different label and value', () => {
    render(
      <svg>
        <MeasurementLabel
          {...defaultProps}
          label="B"
          value={20}
        />
      </svg>
    );
    
    expect(screen.getByText('B=20m')).toBeInTheDocument();
  });

  it('renders with zero value', () => {
    render(
      <svg>
        <MeasurementLabel
          {...defaultProps}
          value={0}
        />
      </svg>
    );
    
    expect(screen.getByText('A=0m')).toBeInTheDocument();
  });

  it('renders with decimal value', () => {
    render(
      <svg>
        <MeasurementLabel
          {...defaultProps}
          value={10.5}
        />
      </svg>
    );
    
    expect(screen.getByText('A=10.5m')).toBeInTheDocument();
  });
}); 