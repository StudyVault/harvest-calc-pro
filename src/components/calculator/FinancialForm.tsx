import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  Heading,
} from '@chakra-ui/react';

interface FinancialFormProps {
  toneladas: number;
  displayValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatInputValue: (value: number) => string;
}

const FinancialForm: React.FC<FinancialFormProps> = ({
  toneladas,
  displayValue,
  onInputChange,
  formatInputValue,
}) => {
  return (
    <Box>
      <Heading size="sm" mb={4} color="gray.600">
        Informações Financeiras
      </Heading>
      <FormControl>
        <FormLabel>Quantidade de Toneladas:</FormLabel>
        <Input
          type="number"
          name="toneladas"
          value={formatInputValue(toneladas)}
          onChange={onInputChange}
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
            onChange={onInputChange}
            placeholder="20"
          />
          <InputRightAddon>%</InputRightAddon>
        </InputGroup>
        <Text fontSize="sm" color="gray.600" mt={1}>
          Ex: Digite 20 para 20%
        </Text>
      </FormControl>
    </Box>
  );
};

export default FinancialForm; 