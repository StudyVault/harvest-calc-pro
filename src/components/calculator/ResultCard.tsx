import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  VStack,
  Heading,
  Text,
  Box,
} from '@chakra-ui/react';

interface ResultCardProps {
  resultado: {
    cubagem: number;
    valorTotal: number;
    ladosUsados: {
      ladoA: number;
      ladoB: number;
      ladoC: number;
      ladoD: number;
    };
  };
  selectedShape: 'rectangle' | 'triangle';
}

const ResultCard: React.FC<ResultCardProps> = ({ resultado, selectedShape }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card bg="brand.50" mt={4}>
      <CardBody>
        <VStack spacing={3} align="stretch">
          <Heading size="md" color="brand.700" display="flex" justifyContent="space-between" alignItems="center">
            <Text>Resultados:</Text>
            <Text fontSize="sm" color="gray.500">
              {timeLeft > 0 ? `(será ocultado em ${timeLeft} segundos)` : '(ocultando...)'}
            </Text>
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
  );
};

export default ResultCard; 