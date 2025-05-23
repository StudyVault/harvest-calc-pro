import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  RadioGroup,
  Radio,
  Divider,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import Rectangle from './Rectangle';
import Triangle from './Triangle';
import '../../styles/shapes.css';
import { usePercentageInput } from '../../hooks/usePercentageInput';

const CalculadoraCorteCana: React.FC = () => {
  const [valores, setValores] = useState({
    toneladas: 3,
    valorPorTonelada: 0.20, // 20% - valor padrão conforme cálculo original
    ladoA: 0,
    ladoB: 0,
    ladoC: 0,
    ladoD: 0
  });

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

    // Trata inputs numéricos (lados e toneladas)
    if (value === '') {
      // Se o campo ficar vazio, define como 0
      setValores(prev => ({
        ...prev,
        [name]: 0
      }));
    } else {
      // Remove zeros à esquerda e converte para número
      const numericValue = parseFloat(value.replace(/^0+/, ''));
      setValores(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
  };

  // Função para formatar o valor exibido no input
  const formatInputValue = (value: number) => {
    // Retorna string vazia se for zero (para permitir digitação fácil)
    return value === 0 ? '' : value.toString();
  };

  const calcularPagamento = () => {
    // Validação dos campos
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

    let cubagem = 0;
    let valorTotal = 0;

    // Guarda os valores dos lados antes de resetar
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

    // Log detalhado para debug
    console.log('Valores do cálculo:', {
      shape: selectedShape,
      lados: { A: valores.ladoA, B: valores.ladoB, C: valores.ladoC, D: valores.ladoD },
      mediaAB: (valores.ladoA + valores.ladoB) / 2,
      baseC: selectedShape === 'triangle' ? valores.ladoC / 2 : (valores.ladoC + valores.ladoD) / 2,
      cubagem,
      valorPorTonelada: valores.valorPorTonelada,
      toneladas: valores.toneladas,
      valorPorToneladaTotal,
      valorTotal,
      debug: {
        calculo1: valores.toneladas * valores.valorPorTonelada,
        calculo2: cubagem * (valores.toneladas * valores.valorPorTonelada)
      }
    });

    setResultado({
      cubagem,
      valorTotal,
      areaRetangulo: selectedShape === 'rectangle' ? cubagem : 0,
      areaTriangulo: selectedShape === 'triangle' ? cubagem : 0,
      areaTotal: cubagem,
      ladosUsados
    });

    // Reset dos valores dos lados, mantendo toneladas e valorPorTonelada
    setValores(prev => ({
      ...prev,
      ladoA: 0,
      ladoB: 0,
      ladoC: 0,
      ladoD: 0
    }));

    // Feedback visual do cálculo realizado
    toast({
      title: 'Cálculo realizado',
      description: 'Os valores foram calculados com sucesso.',
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

        <Card variant="outline" p={4}>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <RadioGroup
                value={selectedShape}
                onChange={(value: 'rectangle' | 'triangle') => setSelectedShape(value)}
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
                  <Rectangle dimensions={valores} />
                ) : (
                  <Triangle dimensions={valores} />
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
                        value={formatInputValue(valores.toneladas)}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel>Valor por Tonelada (%):</FormLabel>
                      <InputGroup>
                        <Input
                          type="text"
                          name="valorPorTonelada"
                          value={displayValue}
                          onChange={handleInputChange}
                          placeholder="20"
                        />
                        <InputRightAddon>%</InputRightAddon>
                      </InputGroup>
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        Ex: Digite 20 para 20%
                      </Text>
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
                          value={formatInputValue(valores.ladoA)}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Lado B (metros):</FormLabel>
                        <Input
                          type="number"
                          name="ladoB"
                          value={formatInputValue(valores.ladoB)}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Lado C (metros):</FormLabel>
                        <Input
                          type="number"
                          name="ladoC"
                          value={formatInputValue(valores.ladoC)}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </FormControl>

                      {selectedShape === 'rectangle' && (
                        <FormControl>
                          <FormLabel>Lado D (metros):</FormLabel>
                          <Input
                            type="number"
                            name="ladoD"
                            value={formatInputValue(valores.ladoD)}
                            onChange={handleInputChange}
                            placeholder="0"
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
                onClick={calcularPagamento}
              >
                Calcular
              </Button>

              {resultado.valorTotal > 0 && (
                <Card bg="brand.50" mt={4}>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Heading size="md" color="brand.700">
                        Resultados:
                      </Heading>
                      <Box borderWidth="1px" borderRadius="md" p={3} bg="white">
                        <Text fontWeight="500" mb={2}>Valores utilizados:</Text>
                        <Text>Lado A: {resultado.ladosUsados.ladoA} metros</Text>
                        <Text>Lado B: {resultado.ladosUsados.ladoB} metros</Text>
                        <Text>Lado C: {resultado.ladosUsados.ladoC} metros</Text>
                        {selectedShape === 'rectangle' && (
                          <Text>Lado D: {resultado.ladosUsados.ladoD} metros</Text>
                        )}
                      </Box>
                      {selectedShape === 'rectangle' ? (
                        <>
                          <Text>Valor da Cubação: {resultado.cubagem.toFixed(2)}</Text>
                          <Text fontWeight="bold" color="green.700">
                            Valor Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.valorTotal)}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text>Área do Triângulo: {resultado.cubagem.toFixed(2)} m²</Text>
                          <Text fontWeight="bold" color="green.700">
                            Valor Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.valorTotal)}
                          </Text>
                        </>
                      )}
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
