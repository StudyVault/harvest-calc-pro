import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  useToast,
  RadioGroup,
  Radio,
  Divider,
} from '@chakra-ui/react';
import { BsCalculator } from 'react-icons/bs';
import Rectangle from './Rectangle';
import Triangle from './Triangle';
import FinancialForm from './FinancialForm';
import DimensionsForm from './DimensionsForm';
import ResultCard from './ResultCard';
import { useAreaCalculations } from '../../hooks/useAreaCalculations';

/**
 * Componente principal da calculadora de corte de cana-de-açúcar
 * 
 * Permite o cálculo de cubagem, produção e pagamento baseado em:
 * - Dimensões do talhão (em braças)
 * - Produtividade (kg por braça²)
 * - Valor de pagamento (R$ por tonelada)
 */
const CalculadoraCorteCana: React.FC = () => {
  // Estado para dimensões do talhão
  const [dimensoes, setDimensoes] = useState({
    ladoA: 0,
    ladoB: 0,
    ladoC: 0,
    ladoD: 0
  });

  // Estado para produtividade e valores financeiros
  const [produtividade, setProdutividade] = useState(1700); // kg por braça²
  const [valorPorKg, setValorPorKg] = useState(25); // centavos por tonelada (25 = R$ 0,25/ton)

  // Estado para controle de exibição do resultado
  const [showResult, setShowResult] = useState(false);

  // Estado para seleção de forma geométrica
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'triangle'>('rectangle');

  // Hook para cálculos
  const { result, calculateAreas } = useAreaCalculations();

  const toast = useToast();

  // Efeito para ocultar automaticamente o resultado após 120 segundos
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showResult) {
      timer = setTimeout(() => {
        setShowResult(false);
      }, 120000); // 120 segundos
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showResult]);

  /**
   * Limpa os inputs quando o timer expirar
   */
  const handleTimeExpired = () => {
    setDimensoes({
      ladoA: 0,
      ladoB: 0,
      ladoC: 0,
      ladoD: 0
    });
    setShowResult(false);
  };

  /**
   * Manipula mudanças de forma (retângulo/triângulo)
   */
  const handleShapeChange = (value: 'rectangle' | 'triangle') => {
    setSelectedShape(value);
    
    // Se mudando para triângulo, zerar o ladoD
    if (value === 'triangle') {
      setDimensoes(prev => ({
        ...prev,
        ladoD: 0
      }));
    }
  };

  /**
   * Manipula mudanças nos campos de entrada
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : parseFloat(value);

    // Valida se é um número válido
    if (isNaN(numericValue)) return;

    // Atualiza o estado apropriado
    if (name === 'produtividade') {
      setProdutividade(numericValue);
    } else if (name === 'valorPorKg') {
      setValorPorKg(numericValue);
    } else {
      setDimensoes(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
  };

  /**
   * Valida os campos antes de calcular
   */
  const validarCampos = (): boolean => {
    // Validação para retângulo
    if (selectedShape === 'rectangle') {
      if (!dimensoes.ladoA || !dimensoes.ladoB || !dimensoes.ladoC || !dimensoes.ladoD) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os 4 lados do retângulo.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }

    // Validação para triângulo
    if (selectedShape === 'triangle') {
      if (!dimensoes.ladoA || !dimensoes.ladoB || !dimensoes.ladoC) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Por favor, preencha os 3 lados do triângulo (A e B como bases, C como altura).',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }

    // Validação de produtividade
    if (!produtividade || produtividade <= 0) {
      toast({
        title: 'Produtividade inválida',
        description: 'Por favor, insira uma produtividade maior que zero.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Validação de valor por kg
    if (!valorPorKg || valorPorKg <= 0) {
      toast({
        title: 'Valor por kg inválido',
        description: 'Por favor, insira um valor por kg maior que zero.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  /**
   * Executa o cálculo de cubagem e pagamento
   */
  const calcularPagamento = () => {
    // Valida os campos
    if (!validarCampos()) return;

    // Executa o cálculo (valorPorKg será convertido para R$/kg no hook)
    calculateAreas(dimensoes, produtividade, valorPorKg, selectedShape);

    // Exibe o resultado
    setShowResult(true);

    // Feedback de sucesso
    toast({
      title: 'Cálculo realizado com sucesso',
      description: 'Confira os resultados abaixo.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Título */}
        <Heading textAlign="center" color="brand.700" size="xl">
          Calculadora de Pagamento de Corte de Cana
        </Heading>

        {/* Seleção de forma */}
        <Box>
          <RadioGroup
            value={selectedShape}
            onChange={(value: 'rectangle' | 'triangle') => handleShapeChange(value)}
          >
            <Box display="flex" justifyContent="center" gap={8}>
              <Radio value="rectangle" colorScheme="green">
                Retângulo
              </Radio>
              <Radio value="triangle" colorScheme="green">
                Triângulo
              </Radio>
            </Box>
          </RadioGroup>

          {/* Visualização da forma */}
          <Box mt={4}>
            {selectedShape === 'rectangle' ? (
              <Rectangle dimensions={dimensoes} />
            ) : (
              <Triangle dimensions={dimensoes} />
            )}
          </Box>

          <Divider my={6} />

          {/* Formulários */}
          <VStack spacing={6} align="stretch">
            {/* A. Dimensões do Talhão */}
            <DimensionsForm
              valores={dimensoes}
              selectedShape={selectedShape}
              onInputChange={handleInputChange}
            />

            <Divider />

            {/* B. Produtividade e C. Valor do Pagamento */}
            <FinancialForm
              produtividade={produtividade}
              valorPorKg={valorPorKg}
              onInputChange={handleInputChange}
            />

            {/* Botão de cálculo */}
            <Button
              colorScheme="green"
              size="lg"
              width="100%"
              onClick={calcularPagamento}
              leftIcon={<BsCalculator />}
            >
              Calcular Pagamento
            </Button>

            {/* D. Resultado */}
            {showResult && (
              <ResultCard
                resultado={result}
                selectedShape={selectedShape}
                onTimeExpired={handleTimeExpired}
              />
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CalculadoraCorteCana;
