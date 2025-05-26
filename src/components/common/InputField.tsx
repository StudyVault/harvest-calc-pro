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
  // Corrected handler: Parses the numeric string from onValueChange directly
  const handleCurrencyChange = (value: string | undefined, nameFromInput?: string) => {
    const numericValue = value ? parseFloat(value) : 0;
    onChange({
      target: {
        name: nameFromInput || name, // Use name from input event or component prop
        // Convert valid number to string, handle potential NaN from parseFloat
        value: isNaN(numericValue) ? 'NaN' : numericValue.toString()
      }
    } as InputChangeEvent);
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {isCurrency ? (
        <CurrencyInput
          id={id}
          name={name} // Pass name to CurrencyInput
          value={value ? value.toString() : ''}
          decimalsLimit={2}
          onValueChange={handleCurrencyChange} // Use corrected handler
          prefix="R$ "
          groupSeparator="."
          decimalSeparator=","
          className={`form-control ${error ? 'is-invalid' : ''}`}
          allowNegativeValue={false}
          // decimalScale={2} // Potentially redundant, kept for now
          // fixedDecimalLength={2} // Potentially redundant, kept for now
        />
      ) : (
        <input
          id={id}
          type="number"
          name={name}
          value={value || ''} // Keep existing logic for numeric input
          onChange={onChange} // Pass original onChange for numeric input
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;

