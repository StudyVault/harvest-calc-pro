import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardBody,
  VStack,
  Heading,
  Text,
  Box,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';

interface ResultCardProps {
  resultado: {
    cubagem: number;
    producaoKg: number;
    producaoTon: number;
    valorTotal: number;
    ladosUsados: {
      ladoA: number;
      ladoB: number;
      ladoC: number;
      ladoD: number;
    };
  };
  selectedShape: 'rectangle' | 'triangle';
  onTimeExpired?: () => void; // Callback quando o timer finalizar
}

/**
 * Componente para exibição dos resultados do cálculo
 * Exibe um contador regressivo de 120 segundos
 */
const ResultCard: React.FC<ResultCardProps> = ({ resultado, selectedShape, onTimeExpired }) => {
  const [timeLeft, setTimeLeft] = useState(120);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Foca no resultado quando o componente é montado
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      // Adiciona foco para acessibilidade
      resultRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Contador regressivo de 120 segundos
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Chama callback quando o timer expirar
          if (onTimeExpired) {
            onTimeExpired();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeExpired]);

  return (
    <Card 
      ref={resultRef}
      bg="green.50" 
      borderColor="green.200" 
      borderWidth="2px"
      tabIndex={-1}
      outline="none"
      _focus={{
        boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.6)'
      }}
    >
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="green.700" display="flex" justifyContent="space-between" alignItems="center">
            <Text>Resultado do Cálculo</Text>
            <Text fontSize="sm" color="gray.500" fontWeight="normal">
              {timeLeft > 0 ? `(visível por ${timeLeft}s)` : '(ocultando...)'}
            </Text>
          </Heading>

          {/* Dimensões utilizadas */}
          <Box>
            <Text fontWeight="600" mb={2} color="gray.700">
              Dimensões utilizadas (braças):
            </Text>
            <SimpleGrid columns={2} spacing={2} fontSize="sm">
              <Text>• Lado A: <strong>{resultado.ladosUsados.ladoA}</strong></Text>
              <Text>• Lado B: <strong>{resultado.ladosUsados.ladoB}</strong></Text>
              <Text>• Lado C: <strong>{resultado.ladosUsados.ladoC}</strong></Text>
              {selectedShape === 'rectangle' && (
                <Text>• Lado D: <strong>{resultado.ladosUsados.ladoD}</strong></Text>
              )}
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Resultados dos cálculos */}
          <VStack spacing={3} align="stretch">
            <Box bg="white" p={3} borderRadius="md" borderWidth="1px">
              <Text fontSize="sm" color="gray.600">
                Cubagem (área do talhão):
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="green.700">
                {resultado.cubagem.toFixed(2)} braças²
              </Text>
            </Box>

            <Box bg="white" p={3} borderRadius="md" borderWidth="1px">
              <Text fontSize="sm" color="gray.600">
                Produção estimada:
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                {resultado.producaoKg.toLocaleString('pt-BR')} kg
              </Text>
              <Text fontSize="md" color="gray.600">
                ({resultado.producaoTon.toFixed(3)} toneladas)
              </Text>
            </Box>

            <Box bg="green.100" p={4} borderRadius="md" borderWidth="2px" borderColor="green.300">
              <Text fontSize="sm" color="green.800" mb={1}>
                Valor total do pagamento:
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.700">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(resultado.valorTotal)}
              </Text>
            </Box>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ResultCard; 