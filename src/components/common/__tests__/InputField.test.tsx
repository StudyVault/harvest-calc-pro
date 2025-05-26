import { render, fireEvent, screen } from '@testing-library/react';
import InputField from '../InputField';

jest.mock('react-currency-input-field', () => {
  return function MockCurrencyInput(props: any) {
    return (
      <input
        type="text"
        value={props.value ? `R$ ${props.value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : ''}
        onChange={(e) => props.onValueChange(e.target.value.replace('R$ ', ''))}
        {...props}
      />
    );
  };
});

describe('InputField', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'test',
    label: 'Test Label',
    value: 0,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders numeric input field correctly', () => {
    render(<InputField {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('value', '0');
  });

  it('renders currency input field correctly', () => {
    render(<InputField {...defaultProps} isCurrency />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('value', 'R$ 0,00');
  });

  it('handles numeric input changes', () => {
    render(<InputField {...defaultProps} />);
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '42' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'test',
          value: '42'
        })
      })
    );
  });

  it('handles currency input changes', () => {
    render(<InputField {...defaultProps} isCurrency />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '42,50' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      target: {
        name: 'test',
        value: '42.5'
      }
    });
  });

  it('displays error message when provided', () => {
    const error = 'This field is required';
    render(<InputField {...defaultProps} error={error} />);
    
    expect(screen.getByText(error)).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveClass('is-invalid');
  });

  it('handles empty currency input', () => {
    render(<InputField {...defaultProps} isCurrency />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      target: {
        name: 'test',
        value: '0'
      }
    });
  });

  it('handles invalid currency input', () => {
    render(<InputField {...defaultProps} isCurrency />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      target: {
        name: 'test',
        value: '0'
      }
    });
  });

  it('formats currency with correct separators', () => {
    render(<InputField {...defaultProps} isCurrency value={1234.56} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('value', 'R$ 1.234,56');
  });
}); 