import { renderHook } from '@testing-library/react';
import { useAreaCalculations } from '../useAreaCalculations';

/**
 * TESTE DE VALIDAÇÃO OBRIGATÓRIO
 * 
 * Este teste garante que o cálculo retorna EXATAMENTE o valor esperado.
 * 
 * Dados de entrada obrigatórios:
 * - Lado A: 16 braças
 * - Lado B: 21 braças  
 * - Lado C: 27 braças
 * - Lado D: 12 braças
 * - Produtividade: 1700 kg/braça²
 * - Valor digitado: 25 (centavos, = R$ 0,25 por tonelada)
 * 
 * Resultado esperado: R$ 150,77 (arredondado de 150.76875)
 */
describe('useAreaCalculations - Validação Obrigatória do Cálculo', () => {
  it('DEVE retornar R$ 150,77 para A=16, B=21, C=27, D=12 com valor=25', () => {
    const { result } = renderHook(() => useAreaCalculations());
    
    const dimensions = {
      ladoA: 16,
      ladoB: 21,
      ladoC: 27,
      ladoD: 12
    };
    
    const produtividade = 1700;
    const valorDigitado = 25; // 25 centavos = R$ 0,25 por tonelada
    
    // Executar o cálculo
    const calculationResult = result.current.calculateAreas(
      dimensions,
      produtividade,
      valorDigitado,
      'rectangle'
    );
    
    // Cálculo esperado manual:
    // Cubagem = ((16+27)/2) × ((21+12)/2) = 21.5 × 16.5 = 354.75 braças²
    expect(calculationResult.cubagem).toBe(354.75);
    
    // Produção = 354.75 × 1700 = 603,075 kg
    expect(calculationResult.producaoKg).toBe(603075);
    
    // Produção em toneladas = 603,075 kg / 1000 = 603.075 ton
    expect(calculationResult.producaoTon).toBe(603.075);
    
    // Valor Total = 603.075 ton × R$ 0,25/ton = R$ 150.76875 ≈ R$ 150.77
    expect(calculationResult.valorTotal).toBe(150.77);
    
    console.log('\n✅ VALIDAÇÃO APROVADA:');
    console.log(`   Cubagem: ${calculationResult.cubagem} braças²`);
    console.log(`   Produção: ${calculationResult.producaoKg} kg (${calculationResult.producaoTon} ton)`);
    console.log(`   Valor Total: R$ ${calculationResult.valorTotal}`);
  });
  
  it('deve calcular corretamente o valor exato antes do arredondamento', () => {
    // Cálculo matemático puro
    const cubagem = ((16 + 27) / 2) * ((21 + 12) / 2);
    const producaoKg = cubagem * 1700;
    const producaoTon = producaoKg / 1000;
    const valorPorTonReal = 25 / 100; // R$ 0,25
    const valorTotalExato = producaoTon * valorPorTonReal;
    
    console.log('\n📊 CÁLCULO MATEMÁTICO PURO:');
    console.log(`   Cubagem: ${cubagem} braças²`);
    console.log(`   Produção: ${producaoKg} kg = ${producaoTon} ton`);
    console.log(`   Valor por tonelada: R$ ${valorPorTonReal}`);
    console.log(`   Valor total exato: R$ ${valorTotalExato}`);
    console.log(`   Valor total arredondado: R$ ${valorTotalExato.toFixed(2)}`);
    
    expect(cubagem).toBe(354.75);
    expect(producaoKg).toBe(603075);
    expect(producaoTon).toBe(603.075);
    expect(valorTotalExato).toBeCloseTo(150.76875, 5);
    expect(Number(valorTotalExato.toFixed(2))).toBe(150.77);
  });
});
