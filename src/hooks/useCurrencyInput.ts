import { ChangeEvent } from 'react';

export const useCurrencyInput = () => {
  const formatCurrency = (value: number): string => {
    if (isNaN(value)) return '0,00';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const parseCurrencyInput = (input: string): string => {
    // Remove tudo que não é número
    const numbers = input.replace(/\D/g, '');
    
    // Se não houver números, retorna zero formatado
    if (!numbers) return '0,00';
    
    // Pega os últimos dígitos para os centavos (até 2 dígitos)
    const centavos = numbers.slice(-2).padStart(2, '0');
    
    // Pega o resto para os reais, removendo zeros à esquerda
    const reais = numbers.slice(0, -2);
    const reaisFormatted = reais ? parseInt(reais, 10).toString() : '0';
    
    // Formata com a vírgula
    return `${reaisFormatted},${centavos}`;
  };

  const handleCurrencyChange = (
    e: ChangeEvent<HTMLInputElement>,
    callback: (value: number) => void
  ) => {
    // Pega apenas os números do input
    const inputValue = e.target.value.replace(/\D/g, '');
    
    // Formata o valor
    const formattedValue = parseCurrencyInput(inputValue);
    
    // Converte para número para o callback
    const numericValue = parseFloat(formattedValue.replace(',', '.'));
    
    // Atualiza o estado com o valor numérico
    callback(numericValue);
    
    // Retorna o valor formatado para atualizar o input
    return formattedValue;
  };

  return {
    formatCurrency,
    handleCurrencyChange,
  };
}; 