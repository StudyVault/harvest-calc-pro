import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  RadioGroup,
  Radio,
  Text,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Divider,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useFormState } from '../../hooks/useFormState';
import { useAreaCalculations } from '../../hooks/useAreaCalculations';
import { useCurrencyInput } from '../../hooks/useCurrencyInput';
import Rectangle from './Rectangle';
import Triangle from './Triangle';

type ShapeType = 'rectangle' | 'triangle';

const CalculadoraCorteCana: React.FC = () => {
  const { dimensions, financialData, handleDimensionChange, handleFinancialChange, setFinancialData } = useFormState();
  const { formatCurrency, handleCurrencyChange } = useCurrencyInput();
  const { result, calculateAreas } = useAreaCalculations();
  const [showResults, setShowResults] = useState(false);
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle');
  const [displayValue, setDisplayValue] = useState(formatCurrency(financialData.valorPorTonelada));
  const toast = useToast();

  const handleCurrencyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = handleCurrencyChange(e, (value) => {
      setFinancialData(prev => ({ ...prev, valorPorTonelada: value }));
    });
    setDisplayValue(formattedValue);
  };

  const handleCalculate = () => {
    // Validar se todos os campos necessários estão preenchidos
    if (!financialData.toneladas || !financialData.valorPorTonelada) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos financeiros.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!dimensions.ladoA || !dimensions.ladoB || !dimensions.ladoC || 
        (selectedShape === 'rectangle' && !dimensions.ladoD)) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todas as dimensões necessárias.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    calculateAreas(dimensions, financialData.toneladas, financialData.valorPorTonelada, selectedShape);
    setShowResults(true);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center" color="brand.700" size="xl">
          Calculadora de Pagamento de Corte de Cana
        </Heading>

        <Card variant="outline" p={4}>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <RadioGroup
                value={selectedShape}
                onChange={(value: ShapeType) => {
                  setSelectedShape(value);
                  setShowResults(false);
                }}
              >
                <Box display="flex" justifyContent="center" gap={8}>
                  <Radio value="rectangle" colorScheme="green">
                    <Text fontSize="lg">Retângulo</Text>
                  </Radio>
                  <Radio value="triangle" colorScheme="green">
                    <Text fontSize="lg">Triângulo</Text>
                  </Radio>
                </Box>
              </RadioGroup>

              <Box>
                {selectedShape === 'rectangle' ? (
                  <Rectangle dimensions={dimensions} />
                ) : (
                  <Triangle dimensions={dimensions} />
                )}
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4} color="brand.700">
                  Dados de Cálculo
                </Heading>

                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="sm" mb={4} color="gray.600">
                      Informações Financeiras
                    </Heading>
                    <FormControl>
                      <FormLabel>Quantidade de Toneladas:</FormLabel>
                      <Input
                        type="number"
                        name="toneladas"
                        value={financialData.toneladas || ''}
                        onChange={handleFinancialChange}
                        placeholder="Digite a quantidade de toneladas"
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel>Valor por Tonelada (R$):</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>R$</InputLeftAddon>
                        <Input
                          type="text"
                          name="valorPorTonelada"
                          value={displayValue}
                          onChange={handleCurrencyInputChange}
                          onFocus={(e) => e.target.select()}
                          placeholder="0,00"
                          inputMode="numeric"
                        />
                      </InputGroup>
                    </FormControl>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={4} color="gray.600">
                      Dimensões {selectedShape === 'rectangle' ? 'do Retângulo' : 'do Triângulo'}
                    </Heading>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Lado A (metros):</FormLabel>
                        <Input
                          type="number"
                          name="ladoA"
                          value={dimensions.ladoA || ''}
                          onChange={handleDimensionChange}
                          placeholder="Digite o comprimento do lado A"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Lado B (metros):</FormLabel>
                        <Input
                          type="number"
                          name="ladoB"
                          value={dimensions.ladoB || ''}
                          onChange={handleDimensionChange}
                          placeholder="Digite o comprimento do lado B"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Lado C (metros):</FormLabel>
                        <Input
                          type="number"
                          name="ladoC"
                          value={dimensions.ladoC || ''}
                          onChange={handleDimensionChange}
                          placeholder="Digite o comprimento do lado C"
                        />
                      </FormControl>

                      {selectedShape === 'rectangle' && (
                        <FormControl>
                          <FormLabel>Lado D (metros):</FormLabel>
                          <Input
                            type="number"
                            name="ladoD"
                            value={dimensions.ladoD || ''}
                            onChange={handleDimensionChange}
                            placeholder="Digite o comprimento do lado D"
                          />
                        </FormControl>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              <Button
                colorScheme="green"
                size="lg"
                width="100%"
                onClick={handleCalculate}
              >
                Calcular
              </Button>

              {showResults && (
                <Card bg="brand.50" mt={4}>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Heading size="md" color="brand.700">
                        Resultados:
                      </Heading>
                      {selectedShape === 'rectangle' ? (
                        <Text>
                          Área do Retângulo: {result.areaRetangulo.toFixed(2)} m²
                        </Text>
                      ) : (
                        <Text>
                          Área do Triângulo: {result.areaTriangulo.toFixed(2)} m²
                        </Text>
                      )}
                      <Text>Área Total: {result.areaTotal.toFixed(2)} m²</Text>
                      <Text fontWeight="bold" color="brand.700">
                        Valor Total: R$ {result.valorTotal.toFixed(2)}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default CalculadoraCorteCana;
