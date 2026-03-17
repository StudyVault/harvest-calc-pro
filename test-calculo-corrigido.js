console.log('=== TESTE CORRIGIDO ===\n');

const ladoA = 16, ladoB = 21, ladoC = 27, ladoD = 12;
const produtividade = 1700;
const valorDigitado = 25;

// Cubagem
const cubagem = ((ladoA + ladoC) / 2) * ((ladoB + ladoD) / 2);
console.log(`Cubagem: ${cubagem} braças²`);

// Produção
const producaoKg = cubagem * produtividade;
const producaoTon = producaoKg / 1000;  // CORREÇÃO: dividir por 1000!
console.log(`Produção: ${producaoKg} kg = ${producaoTon} toneladas`);

// Valor
const valorPorTonReal = valorDigitado * 10;
const valorTotal = producaoTon * valorPorTonReal;
console.log(`\nValor por tonelada: R$ ${valorPorTonReal},00`);
console.log(`Valor Total: ${producaoTon} × ${valorPorTonReal} = ${valorTotal}`);
console.log(`Valor Total arredondado: R$ ${valorTotal.toFixed(2)}`);

console.log(`\n${Math.abs(valorTotal - 150.76) < 0.02 ? '✅ CORRETO!' : '❌ ERRADO!'}`);
