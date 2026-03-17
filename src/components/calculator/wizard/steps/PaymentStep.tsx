// src/components/calculator/wizard/steps/PaymentStep.tsx
import React, { useState } from 'react';
import {
  Box, Text, Input, InputGroup, InputRightAddon, VStack, FormControl, FormLabel,
} from '@chakra-ui/react';
import ProgressBar from '../components/ProgressBar';
import WizardNavigation from '../components/WizardNavigation';

interface PaymentStepProps {
  produtividade: string;
  valorCentavos: string;
  onProdutividadeChange: (v: string) => void;
  onValorCentavosChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  produtividade,
  valorCentavos,
  onProdutividadeChange,
  onValorCentavosChange,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<{ produtividade?: string; valor?: string }>({});

  const handleNext = () => {
    const p = parseFloat(produtividade);
    const v = parseFloat(valorCentavos);
    const newErrors: { produtividade?: string; valor?: string } = {};

    if (!produtividade || isNaN(p) || p <= 0) {
      newErrors.produtividade = 'Digite a produtividade em kg por braça²';
    }
    if (!valorCentavos || isNaN(v) || v <= 0) {
      newErrors.valor = 'Digite o valor por tonelada em centavos';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <Box minH="100vh" bg="green.700">
      {/* Header */}
      <Box bg="green.700" px={6} pt={8} pb={4}>
        <ProgressBar currentPhase="payment" />
        <Text color="white" fontSize="2xl" fontWeight="bold" textAlign="center">
          💰 Informações do Pagamento
        </Text>
      </Box>

      {/* Body */}
      <Box bg="white" borderTopRadius="2xl" px={6} pt={6} pb={8} minH="70vh">
        <VStack spacing={6}>
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="bold">
              Produtividade (kg por braça²)
            </FormLabel>
            <InputGroup size="lg">
              <Input
                type="number"
                inputMode="numeric"
                value={produtividade}
                onChange={e => {
                  setErrors(prev => ({ ...prev, produtividade: undefined }));
                  onProdutividadeChange(e.target.value);
                }}
                placeholder="1700"
                fontSize="2xl"
                height="64px"
                borderWidth={2}
                borderColor={errors.produtividade ? 'red.400' : 'gray.300'}
                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)' }}
              />
              <InputRightAddon height="64px" fontSize="md" bg="gray.100">kg/bç²</InputRightAddon>
            </InputGroup>
            <Text fontSize="sm" color="gray.500" mt={1}>Padrão: 1700 kg/braça²</Text>
            {errors.produtividade && (
              <Text color="red.500" fontSize="md" mt={2}>{errors.produtividade}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontSize="lg" fontWeight="bold">
              Valor por Tonelada (centavos)
            </FormLabel>
            <InputGroup size="lg">
              <Input
                type="number"
                inputMode="numeric"
                value={valorCentavos}
                onChange={e => {
                  setErrors(prev => ({ ...prev, valor: undefined }));
                  onValorCentavosChange(e.target.value);
                }}
                placeholder="25"
                fontSize="2xl"
                height="64px"
                borderWidth={2}
                borderColor={errors.valor ? 'red.400' : 'gray.300'}
                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)' }}
              />
              <InputRightAddon height="64px" fontSize="xl" bg="gray.100">¢</InputRightAddon>
            </InputGroup>
            <Text fontSize="sm" color="gray.500" mt={1}>Ex: Digite 25 para R$ 0,25 por tonelada</Text>
            {errors.valor && (
              <Text color="red.500" fontSize="md" mt={2}>{errors.valor}</Text>
            )}
          </FormControl>

          <WizardNavigation
            onNext={handleNext}
            nextLabel={`🧮 CALCULAR`}
            showBack={true}
            onBack={onBack}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default PaymentStep;
