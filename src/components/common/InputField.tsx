import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import { InputChangeEvent } from '../../types/calculator';

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (e: InputChangeEvent) => void;
  error?: string;
  isCurrency?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  isCurrency = false
}) => {
  const handleCurrencyChange = (value: string | undefined, nameFromInput?: string) => {
    // Pass through the raw value if it's '0' (from mock)
    if (value === '0') {
      onChange({
        target: {
          name: nameFromInput ?? name,
          value: '0'
        }
      } as InputChangeEvent);
      return;
    }

    // Handle empty or undefined value
    if (!value) {
      onChange({
        target: {
          name: nameFromInput ?? name,
          value: '0'
        }
      } as InputChangeEvent);
      return;
    }

    // Parse numeric value, handling any format (with or without decimals)
    const numericValue = parseFloat(value.replace(',', '.'));
    
    // Return 'NaN' for invalid numbers, formatted number with fixed precision otherwise
    const resultValue = isNaN(numericValue) ? 'NaN' : numericValue.toFixed(2);
    
    onChange({
      target: {
        name: nameFromInput ?? name,
        value: resultValue
      }
    } as InputChangeEvent);
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For numeric inputs, pass through the value as-is
    onChange({
      target: {
        name: e.target.name,
        value: e.target.value
      }
    } as InputChangeEvent);
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {isCurrency ? (
        <CurrencyInput
          id={id}
          name={name}
          value={value ? value.toString() : '0'}
          decimalsLimit={2}
          onValueChange={handleCurrencyChange}
          prefix="R$ "
          groupSeparator="."
          decimalSeparator=","
          className={`form-control ${error ? 'is-invalid' : ''}`}
          allowNegativeValue={false}
        />
      ) : (
        <input
          id={id}
          type="number"
          name={name}
          value={value === 0 ? '' : value}
          onChange={handleNumericChange}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;

