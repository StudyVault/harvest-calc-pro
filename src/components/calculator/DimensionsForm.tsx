import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Grid,
  VStack,
  Heading,
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
  formatInputValue: (value: number) => string;
}

const DimensionsForm: React.FC<DimensionsFormProps> = ({
  valores,
  selectedShape,
  onInputChange,
  formatInputValue,
}) => {
  return (
    <Box>
      <Heading size="md" mb={4} color="brand.700">
        Dimensões {selectedShape === 'rectangle' ? 'do Retângulo' : 'do Triângulo'}
      </Heading>
      {selectedShape === 'rectangle' ? (
        // Layout para Retângulo
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <FormControl>
            <FormLabel>Lado A (metros):</FormLabel>
            <Input
              type="number"
              name="ladoA"
              value={formatInputValue(valores.ladoA)}
              onChange={onInputChange}
              placeholder="0"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Lado B (metros):</FormLabel>
            <Input
              type="number"
              name="ladoB"
              value={formatInputValue(valores.ladoB)}
              onChange={onInputChange}
              placeholder="0"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Lado C (metros):</FormLabel>
            <Input
              type="number"
              name="ladoC"
              value={formatInputValue(valores.ladoC)}
              onChange={onInputChange}
              placeholder="0"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Lado D (metros):</FormLabel>
            <Input
              type="number"
              name="ladoD"
              value={formatInputValue(valores.ladoD)}
              onChange={onInputChange}
              placeholder="0"
            />
          </FormControl>
        </Grid>
      ) : (
        // Layout para Triângulo
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Lado A (metros):</FormLabel>
              <Input
                type="number"
                name="ladoA"
                value={formatInputValue(valores.ladoA)}
                onChange={onInputChange}
                placeholder="0"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Lado C (metros):</FormLabel>
              <Input
                type="number"
                name="ladoC"
                value={formatInputValue(valores.ladoC)}
                onChange={onInputChange}
                placeholder="0"
              />
            </FormControl>
          </VStack>

          <FormControl>
            <FormLabel>Lado B (metros):</FormLabel>
            <Input
              type="number"
              name="ladoB"
              value={formatInputValue(valores.ladoB)}
              onChange={onInputChange}
              placeholder="0"
            />
          </FormControl>
        </Grid>
      )}
    </Box>
  );
};

export default DimensionsForm; 