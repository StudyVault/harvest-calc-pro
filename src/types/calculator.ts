/**
 * Dimensões do talhão em braças
 */
export interface Dimensions {
  ladoA: number;
  ladoB: number;
  ladoC: number;
  ladoD: number;
}

/**
 * Dados financeiros e de produtividade
 */
export interface FinancialData {
  produtividade: number; // kg por braça²
  valorPorKg: number; // R$ por kg (convertido de centavos)
}

/**
 * Resultado dos cálculos
 */
export interface CalculationResult {
  cubagem: number; // área em braças²
  producaoKg: number; // produção total em kg
  producaoTon: number; // produção total em toneladas
  valorTotal: number; // valor total em R$
  ladosUsados: {
    ladoA: number;
    ladoB: number;
    ladoC: number;
    ladoD: number;
  };
}

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
