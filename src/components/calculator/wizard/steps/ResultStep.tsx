// src/components/calculator/wizard/steps/ResultStep.tsx
import React from 'react';
import { Box, VStack, Text, Button } from '@chakra-ui/react';

interface ResultStepProps {
  valorTotal: number;
  area: number;
  toneladas: number;
  valorPorTonelada: number;
  onNewCalculation: () => void;
}

const ResultStep: React.FC<ResultStepProps> = ({
  valorTotal,
  area,
  toneladas,
  valorPorTonelada,
  onNewCalculation,
}) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valorTotal);

  return (
    <Box minH="100vh" bg="green.900" display="flex" flexDirection="column" justifyContent="center" px={6} py={10}>
      <VStack spacing={6} align="center">
        <Text color="whiteAlpha.800" fontSize="lg" textTransform="uppercase" letterSpacing="wider">
          ✅ Cálculo concluído
        </Text>

        <Text color="whiteAlpha.700" fontSize="md" textTransform="uppercase">
          VALOR A PAGAR
        </Text>

        <Text color="white" fontSize="5xl" fontWeight="bold" lineHeight="1" textAlign="center">
          {formattedValue}
        </Text>

        {/* Summary card */}
        <Box
          bg="whiteAlpha.200"
          borderRadius="xl"
          px={8}
          py={5}
          w="100%"
          mt={2}
        >
          <Text color="whiteAlpha.700" fontSize="sm" textTransform="uppercase" mb={3}>
            RESUMO
          </Text>
          <VStack align="start" spacing={1}>
            <Text color="white" fontSize="lg">Área: {area.toFixed(2)} m²</Text>
            <Text color="white" fontSize="lg">Toneladas: {toneladas}</Text>
            <Text color="white" fontSize="lg">Taxa: {(valorPorTonelada * 100).toFixed(0)}%</Text>
          </VStack>
        </Box>

        <Button
          bg="white"
          color="green.900"
          size="lg"
          height="56px"
          fontSize="xl"
          fontWeight="bold"
          width="100%"
          onClick={onNewCalculation}
          _hover={{ bg: 'gray.100' }}
        >
          🔄 NOVO CÁLCULO
        </Button>
      </VStack>
    </Box>
  );
};

export default ResultStep;
