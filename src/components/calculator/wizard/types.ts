// src/components/calculator/wizard/types.ts
export type Shape = 'rectangle' | 'triangle';
export type Side = 'a' | 'b' | 'c' | 'd';
export type WizardPhase = 'shape' | 'measure' | 'payment';

export interface WizardSides {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface WizardResult {
  area: number;
  valorTotal: number;
}

export interface WizardState {
  shape: Shape | null;
  sides: WizardSides;
  toneladas: number;
  valorPorTonelada: number; // decimal: 0.20 para 20%
  result: WizardResult | null;
}
