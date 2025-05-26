import { validateTriangleInequality, validateDimensions } from '../validation';

describe('validateTriangleInequality', () => {
  it('should return true for a valid triangle', () => {
    expect(validateTriangleInequality(3, 4, 5)).toBe(true);
    expect(validateTriangleInequality(5, 5, 5)).toBe(true);
  });

  it('should return false for an invalid triangle', () => {
    expect(validateTriangleInequality(1, 1, 3)).toBe(false);
    expect(validateTriangleInequality(1, 10, 1)).toBe(false);
  });
});

describe('validateDimensions', () => {
  describe('Rectangle validation', () => {
    it('should validate a valid rectangle', () => {
      const dimensions = { ladoA: 5, ladoB: 3, ladoC: 5, ladoD: 3 };
      const result = validateDimensions(dimensions, 'rectangle');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate rectangle with unequal opposite sides', () => {
      const dimensions = { ladoA: 5, ladoB: 3, ladoC: 4, ladoD: 3 };
      const result = validateDimensions(dimensions, 'rectangle');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Os lados opostos de um retângulo devem ser iguais');
    });

    it('should invalidate rectangle with zero or negative sides', () => {
      const dimensions = { ladoA: 0, ladoB: -1, ladoC: 5, ladoD: 3 };
      const result = validateDimensions(dimensions, 'rectangle');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('O lado A deve ser maior que zero');
      expect(result.errors).toContain('O lado B deve ser maior que zero');
    });
  });

  describe('Triangle validation', () => {
    it('should validate a valid triangle', () => {
      const dimensions = { ladoA: 3, ladoB: 4, ladoC: 5, ladoD: 0 };
      const result = validateDimensions(dimensions, 'triangle');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate triangle that violates triangle inequality', () => {
      const dimensions = { ladoA: 1, ladoB: 1, ladoC: 3, ladoD: 0 };
      const result = validateDimensions(dimensions, 'triangle');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('As dimensões não formam um triângulo válido');
    });

    it('should invalidate triangle with zero or negative sides', () => {
      const dimensions = { ladoA: 0, ladoB: -1, ladoC: 5, ladoD: 0 };
      const result = validateDimensions(dimensions, 'triangle');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('O lado A deve ser maior que zero');
      expect(result.errors).toContain('O lado B deve ser maior que zero');
    });
  });
}); 