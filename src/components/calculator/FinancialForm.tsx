import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  Heading,
} from '@chakra-ui/react';

interface FinancialFormProps {
  produtividade: number;
  valorPorKg: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Formulário para configuração de produtividade e valor de pagamento
 */
const FinancialForm: React.FC<FinancialFormProps> = ({
  produtividade,
  valorPorKg,
  onInputChange,
}) => {
  return (
    <Box>
      <Heading size="md" mb={2} color="brand.700">
        Produtividade e Pagamento
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Configure a produtividade esperada e o valor do pagamento
      </Text>

      <SimpleGrid columns={2} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Produtividade (kg por braça²):</FormLabel>
          <Input
            type="number"
            name="produtividade"
            value={produtividade || ''}
            onChange={onInputChange}
            placeholder="1700"
            min="0"
            step="1"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Padrão: 1700 kg/braça²
          </Text>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Valor por Tonelada (centavos):</FormLabel>
          <Input
            type="number"
            name="valorPorKg"
            value={valorPorKg || ''}
            onChange={onInputChange}
            placeholder="25"
            min="0"
            step="1"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Ex: Digite 25 para R$ 0,25 por tonelada
          </Text>
        </FormControl>
      </SimpleGrid>
    </Box>
  );
};

export default FinancialForm; 