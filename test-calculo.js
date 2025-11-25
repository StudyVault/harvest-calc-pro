/**
 * Script de validação do cálculo
 * 
 * Para executar: node test-calculo.js
 */

console.log('=== TESTE DE VALIDAÇÃO DO CÁLCULO ===\n');

// Dados de entrada
const ladoA = 16;
const ladoB = 21;
const ladoC = 27;
const ladoD = 12;
const produtividade = 1700;
const valorDigitado = 25; // O usuário digita 25

console.log('DADOS DE ENTRADA:');
console.log(`Lado A: ${ladoA} braças`);
console.log(`Lado B: ${ladoB} braças`);
console.log(`Lado C: ${ladoC} braças`);
console.log(`Lado D: ${ladoD} braças`);
console.log(`Produtividade: ${produtividade} kg/braça²`);
console.log(`Valor digitado: ${valorDigitado}`);
console.log('');

// Passo 1: Calcular cubagem
const cubagem = ((ladoA + ladoC) / 2) * ((ladoB + ladoD) / 2);
console.log('PASSO 1 - CUBAGEM:');
console.log(`Cubagem = ((${ladoA} + ${ladoC}) / 2) × ((${ladoB} + ${ladoD}) / 2)`);
console.log(`Cubagem = (${ladoA + ladoC} / 2) × (${ladoB + ladoD} / 2)`);
console.log(`Cubagem = ${(ladoA + ladoC) / 2} × ${(ladoB + ladoD) / 2}`);
console.log(`Cubagem = ${cubagem} braças²`);
console.log('');

// Passo 2: Calcular produção
const producaoKg = cubagem * produtividade;
const producaoTon = producaoKg / 1000;
console.log('PASSO 2 - PRODUÇÃO:');
console.log(`Produção (kg) = ${cubagem} × ${produtividade}`);
console.log(`Produção (kg) = ${producaoKg} kg`);
console.log(`Produção (ton) = ${producaoKg} / 1000`);
console.log(`Produção (ton) = ${producaoTon} toneladas`);
console.log('');

// Passo 3: Calcular valor total
console.log('PASSO 3 - VALOR TOTAL:');
console.log('');

// Opção 1: Multiplicar valorDigitado por 10
const valorPorToneladaReal_Opcao1 = valorDigitado * 10;
const valorTotal_Opcao1 = producaoTon * valorPorToneladaReal_Opcao1;
console.log(`OPÇÃO 1: valorDigitado × 10`);
console.log(`Valor por tonelada = ${valorDigitado} × 10 = R$ ${valorPorToneladaReal_Opcao1},00/ton`);
console.log(`Valor Total = ${producaoTon} × ${valorPorToneladaReal_Opcao1}`);
console.log(`Valor Total = ${valorTotal_Opcao1}`);
console.log(`Valor Total arredondado = R$ ${valorTotal_Opcao1.toFixed(2)}`);
console.log('');

// Opção 2: Usar valorDigitado direto
const valorTotal_Opcao2 = producaoTon * valorDigitado;
console.log(`OPÇÃO 2: valorDigitado direto`);
console.log(`Valor por tonelada = R$ ${valorDigitado},00/ton`);
console.log(`Valor Total = ${producaoTon} × ${valorDigitado}`);
console.log(`Valor Total = ${valorTotal_Opcao2}`);
console.log(`Valor Total arredondado = R$ ${valorTotal_Opcao2.toFixed(2)}`);
console.log('');

// Descobrir qual valor por tonelada dá exatamente R$ 150,76
const valorEsperado = 150.76;
const valorPorTonNecessario = valorEsperado / producaoTon;
console.log('ANÁLISE REVERSA:');
console.log(`Para obter R$ ${valorEsperado}:`);
console.log(`Valor por tonelada necessário = ${valorEsperado} / ${producaoTon}`);
console.log(`Valor por tonelada necessário = R$ ${valorPorTonNecessario.toFixed(2)}/ton`);
console.log(`Isso significa que o usuário deveria digitar: ${(valorPorTonNecessario / 10).toFixed(2)}`);
console.log('');

console.log('=== CONCLUSÃO ===');
if (Math.abs(valorTotal_Opcao1 - valorEsperado) < 0.01) {
  console.log(`✅ OPÇÃO 1 está CORRETA: R$ ${valorTotal_Opcao1.toFixed(2)} ≈ R$ ${valorEsperado}`);
} else {
  console.log(`❌ OPÇÃO 1 está ERRADA: R$ ${valorTotal_Opcao1.toFixed(2)} ≠ R$ ${valorEsperado}`);
}

if (Math.abs(valorTotal_Opcao2 - valorEsperado) < 0.01) {
  console.log(`✅ OPÇÃO 2 está CORRETA: R$ ${valorTotal_Opcao2.toFixed(2)} ≈ R$ ${valorEsperado}`);
} else {
  console.log(`❌ OPÇÃO 2 está ERRADA: R$ ${valorTotal_Opcao2.toFixed(2)} ≠ R$ ${valorEsperado}`);
}
console.log('');
