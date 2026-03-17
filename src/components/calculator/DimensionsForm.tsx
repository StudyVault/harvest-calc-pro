import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Heading,
  Text,
} from '@chakra-ui/react';

interface DimensionsFormProps {
  valores: {
    ladoA: number;
    ladoB: number;
    ladoC: number;
    ladoD: number;
  };
  selectedShape: 'rectangle' | 'triangle';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Formulário para entrada das dimensões do talhão em braças
 */
const DimensionsForm: React.FC<DimensionsFormProps> = ({
  valores,
  selectedShape,
  onInputChange,
}) => {
  return (
    <Box>
      <Heading size="md" mb={2} color="brand.700">
        Dimensões do Talhão
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Informe as medidas dos lados em braças (1 braça = 2,2 metros)
      </Text>
      
      {selectedShape === 'rectangle' ? (
        // Layout para Retângulo - 4 lados
        <SimpleGrid columns={2} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Lado A (braças):</FormLabel>
            <Input
              type="number"
              name="ladoA"
              value={valores.ladoA || ''}
              onChange={onInputChange}
              placeholder="Ex: 50"
              min="0"
              step="0.1"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Lado B (braças):</FormLabel>
            <Input
              type="number"
              name="ladoB"
              value={valores.ladoB || ''}
              onChange={onInputChange}
              placeholder="Ex: 30"
              min="0"
              step="0.1"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Lado C (braças):</FormLabel>
            <Input
              type="number"
              name="ladoC"
              value={valores.ladoC || ''}
              onChange={onInputChange}
              placeholder="Ex: 50"
              min="0"
              step="0.1"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Lado D (braças):</FormLabel>
            <Input
              type="number"
              name="ladoD"
              value={valores.ladoD || ''}
              onChange={onInputChange}
              placeholder="Ex: 30"
              min="0"
              step="0.1"
            />
          </FormControl>
        </SimpleGrid>
      ) : (
        // Layout para Triângulo - 3 lados
        <SimpleGrid columns={2} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Lado A (base 1):</FormLabel>
            <Input
              type="number"
              name="ladoA"
              value={valores.ladoA || ''}
              onChange={onInputChange}
              placeholder="Ex: 50"
              min="0"
              step="0.1"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Lado B (base 2):</FormLabel>
            <Input
              type="number"
              name="ladoB"
              value={valores.ladoB || ''}
              onChange={onInputChange}
              placeholder="Ex: 40"
              min="0"
              step="0.1"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Lado C (altura):</FormLabel>
            <Input
              type="number"
              name="ladoC"
              value={valores.ladoC || ''}
              onChange={onInputChange}
              placeholder="Ex: 30"
              min="0"
              step="0.1"
            />
          </FormControl>
        </SimpleGrid>
      )}
      
      <Text fontSize="xs" color="gray.500" mt={2}>
        {selectedShape === 'rectangle' 
          ? 'A e C são lados opostos paralelos. B e D são lados opostos paralelos.'
          : 'A e B são as bases do triângulo. C é a altura.'}
      </Text>
    </Box>
  );
};

export default DimensionsForm; 