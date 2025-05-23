import { useState } from 'react';

export const usePercentageInput = (initialValue: number) => {
  // Converte o valor decimal inicial para percentual (0.2 -> "20")
  const [displayValue, setDisplayValue] = useState(String(initialValue * 100));

  const handlePercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    
    if (input === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const numericValue = parseInt(input, 10);
    
    // Limita o valor a 100%
    if (numericValue > 100) {
      setDisplayValue('100');
      onChange(1);
      return;
    }

    setDisplayValue(input);
    onChange(numericValue / 100);
  };

  return {
    displayValue,
    setDisplayValue,
    handlePercentageChange
  };
}; 