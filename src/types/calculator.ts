export interface Dimensions {
  ladoA: number;
  ladoB: number;
  ladoC: number;
  ladoD: number;
}

export interface FinancialData {
  toneladas: number;
  valorPorTonelada: number;
}

export interface CalculationResult {
  areaRetangulo: number;
  areaTriangulo: number;
  areaTotal: number;
  valorTotal: number;
}

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
