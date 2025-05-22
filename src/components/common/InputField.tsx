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
  const handleCurrencyChange = (value: string | undefined) => {
    // Convert the currency string to number and trigger the onChange
    const numericValue = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
    onChange({
      target: {
        name,
        value: numericValue.toString()
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
          value={value ? value.toString() : ''}
          decimalsLimit={2}
          onValueChange={handleCurrencyChange}
          prefix="R$ "
          groupSeparator="."
          decimalSeparator=","
          className={`form-control ${error ? 'is-invalid' : ''}`}
          allowNegativeValue={false}
          decimalScale={2}
          fixedDecimalLength={2}
        />
      ) : (
        <input
          id={id}
          type="number"
          name={name}
          value={value || ''}
          onChange={onChange}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;
