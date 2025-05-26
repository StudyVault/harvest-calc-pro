import { render, fireEvent, screen } from '@testing-library/react';
import InputField from '../InputField';

jest.mock('react-currency-input-field', () => {
  return function MockCurrencyInput({ value, name, onChange, onValueChange, label, ...props }: any) {
    // Format initial value for display
    let displayValue = '';
    if (props.prefix === 'R$ ') {
      displayValue = (value ?? value === 0)
        ? ('R$ ' + Number(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        : 'R$ 0,00';
    } else {
      displayValue = value?.toString() || '';
    }

    const handleChange = (e: any) => {
      let val = e.target.value;
      
      // Handle empty value
      if (!val || val === 'R$ ') {
        onValueChange?.('0');
        onChange?.({ target: { name, value: '0' } });
        return;
      }
      
      // For currency inputs
      if (props.prefix === 'R$ ') {
        // Remove R$, spaces and thousand separators
        val = val.replace(/R\$\s?/g, '').replace(/\./g, '').trim();
        
        // Check for invalid characters (excluding comma)
        if (/[^\d,]/.test(val)) {
          onValueChange?.('NaN');
          onChange?.({ target: { name, value: 'NaN' } });
          return;
        }
        
        if (val.includes(',')) {
          const [intPart = '0', decPart = ''] = val.split(',');
          // Remove leading zeros from integer part
          const cleanIntPart = intPart.replace(/^0+/, '') || '0';
          // Limit to 2 decimal places
          const cleanDecPart = decPart.slice(0, 2).padEnd(2, '0');
          const result = `${cleanIntPart}.${cleanDecPart}`;
          
          onValueChange?.(result);
          onChange?.({ target: { name, value: result } });
          return;
        }
      }
      
      // For non-currency inputs or integer currency values
      val = val.replace(/^0+/, '') || '0';
      onValueChange?.(val);
      onChange?.({ target: { name, value: val } });
    };
    
    return (
      <input
        type={props.prefix ? 'text' : 'number'}
        value={displayValue}
        onChange={handleChange}
        aria-label={label}
        {...Object.fromEntries(
          Object.entries(props).filter(([k]) => !['decimalsLimit','groupSeparator','decimalSeparator','allowNegativeValue','decimalScale','fixedDecimalLength'].includes(k))
        )}
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
    // O valor inicial pode ser string vazia se value=0
    expect(input).toHaveAttribute('value', '');
  });

  it('renders currency input field correctly', () => {
    render(<InputField {...defaultProps} isCurrency />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    // O valor inicial deve ser 'R$ 0,00' para o mock
    expect(input.getAttribute('value')).toBe('R$ 0,00');
  });


  it('handles currency input changes', () => {
    render(<InputField {...defaultProps} isCurrency />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'R$ 42,50' } });
    expect(defaultProps.onChange).toHaveBeenCalled();
    const event = defaultProps.onChange.mock.calls[0][0];
    expect(event.target.name).toBe('test');
    expect(event.target.value).toBe('42.50');
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
    expect(defaultProps.onChange).toHaveBeenCalled();
    const event = defaultProps.onChange.mock.calls[0][0];
    expect(event.target.name).toBe('test');
    expect(event.target.value).toBe('0');
  });

  it('handles invalid currency input', () => {
    render(<InputField {...defaultProps} isCurrency />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'R$ abc' } });
    // O mock retorna 'NaN' para valor inválido
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      target: {
        name: 'test',
        value: 'NaN',
      },
    });
  });

  it('formats currency with correct separators', () => {
    render(<InputField {...defaultProps} isCurrency value={1234.56} />);
    const input = screen.getByRole('textbox');
    // O mock retorna o valor formatado corretamente
    expect(input.getAttribute('value')).toBe('R$ 1.234,56');
  });

  it('handles regular numeric input changes', () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { name: 'test', value: '42' } });
    
    const event = defaultProps.onChange.mock.calls[0][0];
    expect(event.target.name).toBe('test');
    expect(event.target.value).toBe('42');
  });

  it('shows non-zero values correctly in numeric input', () => {
    render(<InputField {...defaultProps} value={42} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(42);
  });

  it('handles currency input with custom name from event', () => {
    render(<InputField {...defaultProps} isCurrency />);
    const input = screen.getByRole('textbox');
    
    // Simula uma mudança onde o nome vem do próprio evento
    fireEvent.change(input, { target: { value: 'R$ 42,50' } });
    
    const event = defaultProps.onChange.mock.calls[0][0];
    expect(event.target.name).toBe('test'); // O componente usa o name das props
    expect(event.target.value).toBe('42.50');
  });

  it('preserves id attribute in both input types', () => {
    const { rerender } = render(<InputField {...defaultProps} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('id', 'test-input');
    
    rerender(<InputField {...defaultProps} isCurrency />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
  });

  it('handles undefined value in currency input', () => {
    const props = {
      ...defaultProps,
      value: undefined as any,
      isCurrency: true
    };
    
    render(<InputField {...props} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('R$ 0,00');
  });

  it('handles undefined nameFromInput in currency change', () => {
    render(<InputField {...defaultProps} isCurrency />);
    const input = screen.getByRole('textbox');
    
    // O mock do CurrencyInput chama onValueChange sem passar o nameFromInput
    fireEvent.change(input, { target: { value: 'R$ 42,50' } });
    
    const event = defaultProps.onChange.mock.calls[0][0];
    expect(event.target.name).toBe('test'); // Usa o name das props
    expect(event.target.value).toBe('42.50');
  });

  it('handles invalid number input with value undefined', () => {
    const invalidValue = undefined as any;
    render(<InputField {...defaultProps} value={invalidValue} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(null);
  });

  it('handles currency input with large values', () => {
    render(<InputField {...defaultProps} isCurrency value={1234567.89} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('R$ 1.234.567,89');
  });

  it('maintains decimal precision for currency input', () => {
    render(<InputField {...defaultProps} isCurrency />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'R$ 42,0' } });
    
    const event = defaultProps.onChange.mock.calls[0][0];
    expect(event.target.value).toBe('42.00');
  });

  it('handles invalid currency format gracefully', () => {
    render(<InputField {...defaultProps} isCurrency />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'R$ abc,def' } });
    
    const event = defaultProps.onChange.mock.calls[0][0];
    expect(event.target.value).toBe('NaN');
  });
});