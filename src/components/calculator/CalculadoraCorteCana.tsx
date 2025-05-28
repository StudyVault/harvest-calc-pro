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
import { usePercentageInput } from '../../hooks/usePercentageInput';

const CalculadoraCorteCana: React.FC = () => {
  const [valores, setValores] = useState({
    toneladas: 3,
    valorPorTonelada: 0.20,
    ladoA: 0,
    ladoB: 0,
    ladoC: 0,
    ladoD: 0
  });

  const [showResult, setShowResult] = useState(false);
  const { displayValue, handlePercentageChange } = usePercentageInput(valores.valorPorTonelada);

  const [resultado, setResultado] = useState({
    cubagem: 0,
    valorTotal: 0,
    areaRetangulo: 0,
    areaTriangulo: 0,
    areaTotal: 0,
    ladosUsados: {
      ladoA: 0,
      ladoB: 0,
      ladoC: 0,
      ladoD: 0
    }
  });

  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'triangle'>('rectangle');

  const toast = useToast();

  // Função para lidar com a mudança de forma
  const handleShapeChange = (value: 'rectangle' | 'triangle') => {
    setSelectedShape(value);
    
    // Se mudando de retângulo para triângulo, zerar o ladoD
    if (value === 'triangle') {
      setValores(prev => ({
        ...prev,
        ladoD: 0
      }));
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showResult && resultado.valorTotal > 0) {
      console.log('Iniciando timer de 60 segundos...');
      timer = setTimeout(() => {
        console.log('Timer finalizado, ocultando resultado...');
        setShowResult(false);
        setResultado(prev => ({
          ...prev,
          valorTotal: 0
        }));
      }, 60000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showResult, resultado.valorTotal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'valorPorTonelada') {
      handlePercentageChange(e, (newValue) => {
        setValores(prev => ({
          ...prev,
          valorPorTonelada: newValue
        }));
      });
      return;
    }

    if (value === '') {
      setValores(prev => ({
        ...prev,
        [name]: 0
      }));
    } else {
      const numericValue = parseFloat(value.replace(/^0+/, ''));
      setValores(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
  };

  const formatInputValue = (value: number) => {
    return value === 0 ? '' : value.toString();
  };

  const calcularPagamento = () => {
    if (selectedShape === 'rectangle' && (!valores.ladoA || !valores.ladoB || !valores.ladoC || !valores.ladoD)) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos necessários para o retângulo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (selectedShape === 'triangle' && (!valores.ladoA || !valores.ladoB || !valores.ladoC)) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos necessários para o triângulo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!valores.toneladas || valores.toneladas <= 0) {
      toast({
        title: 'Quantidade de toneladas inválida',
        description: 'Por favor, insira uma quantidade de toneladas maior que zero.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!valores.valorPorTonelada || valores.valorPorTonelada <= 0) {
      toast({
        title: 'Valor por tonelada inválido',
        description: 'Por favor, insira um valor por tonelada maior que zero.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setShowResult(false);
    
    let cubagem = 0;
    let valorTotal = 0;

    const ladosUsados = {
      ladoA: valores.ladoA,
      ladoB: valores.ladoB,
      ladoC: valores.ladoC,
      ladoD: valores.ladoD
    };

    if (selectedShape === 'rectangle') {
      cubagem = ((valores.ladoA + valores.ladoB) / 2) * ((valores.ladoC + valores.ladoD) / 2);
    } else {
      cubagem = ((valores.ladoA + valores.ladoB) / 2) * (valores.ladoC / 2);
    }

    const valorPorToneladaTotal = valores.toneladas * valores.valorPorTonelada;
    valorTotal = cubagem * valorPorToneladaTotal;

    setResultado({
      cubagem,
      valorTotal,
      areaRetangulo: selectedShape === 'rectangle' ? cubagem : 0,
      areaTriangulo: selectedShape === 'triangle' ? cubagem : 0,
      areaTotal: cubagem,
      ladosUsados
    });

    setTimeout(() => {
      setShowResult(true);
    }, 0);

    setValores(prev => ({
      ...prev,
      ladoA: 0,
      ladoB: 0,
      ladoC: 0,
      ladoD: 0
    }));

    toast({
      title: 'Cálculo realizado',
      description: 'Os valores foram calculados com sucesso. O resultado será exibido por 60 segundos.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center" color="brand.700" size="xl">
          Calculadora de Pagamento de Corte de Cana
        </Heading>

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

          <Box>
            {selectedShape === 'rectangle' ? (
              <Rectangle dimensions={valores} />
            ) : (
              <Triangle dimensions={valores} />
            )}
          </Box>

          <Divider my={6} />

          <VStack spacing={6} align="stretch">
            <FinancialForm
              toneladas={valores.toneladas}
              displayValue={displayValue}
              onInputChange={handleInputChange}
              formatInputValue={formatInputValue}
            />

            <DimensionsForm
              valores={valores}
              selectedShape={selectedShape}
              onInputChange={handleInputChange}
              formatInputValue={formatInputValue}
            />

            <Button
              colorScheme="green"
              size="lg"
              width="100%"
              onClick={calcularPagamento}
              leftIcon={<BsCalculator />}
            >
              Calcular
            </Button>

            {showResult && resultado.valorTotal > 0 && (
              <ResultCard
                resultado={resultado}
                selectedShape={selectedShape}
              />
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CalculadoraCorteCana;
