// src/components/calculator/wizard/steps/PaymentStep.tsx
import React, { useState } from 'react';
import {
  Box, Text, Input, InputGroup, InputRightAddon, VStack, FormControl, FormLabel,
} from '@chakra-ui/react';
import ProgressBar from '../components/ProgressBar';
import WizardNavigation from '../components/WizardNavigation';

interface PaymentStepProps {
  toneladas: string;
  valorDisplay: string; // display value from usePercentageInput (e.g. "20")
  onToneladasChange: (v: string) => void;
  onValorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  toneladas,
  valorDisplay,
  onToneladasChange,
  onValorChange,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<{ toneladas?: string; valor?: string }>({});

  const handleNext = () => {
    const t = parseFloat(toneladas);
    const v = parseFloat(valorDisplay);
    const newErrors: { toneladas?: string; valor?: string } = {};

    if (!toneladas || isNaN(t) || t <= 0) {
      newErrors.toneladas = 'Digite a quantidade de toneladas';
    }
    if (!valorDisplay || isNaN(v) || v <= 0) {
      newErrors.valor = 'Digite o valor por tonelada';
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
              Quantas toneladas foram cortadas?
            </FormLabel>
            <Input
              type="number"
              inputMode="numeric"
              value={toneladas}
              onChange={e => {
                setErrors(prev => ({ ...prev, toneladas: undefined }));
                onToneladasChange(e.target.value);
              }}
              placeholder="0"
              fontSize="2xl"
              height="64px"
              borderWidth={2}
              borderColor={errors.toneladas ? 'red.400' : 'gray.300'}
              _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)' }}
            />
            {errors.toneladas && (
              <Text color="red.500" fontSize="md" mt={2}>{errors.toneladas}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontSize="lg" fontWeight="bold">
              Valor por tonelada (%)
            </FormLabel>
            <InputGroup size="lg">
              <Input
                type="text"
                name="valorPorTonelada"
                value={valorDisplay}
                onChange={e => {
                  setErrors(prev => ({ ...prev, valor: undefined }));
                  onValorChange(e);
                }}
                placeholder="20"
                fontSize="2xl"
                height="64px"
                borderWidth={2}
                borderColor={errors.valor ? 'red.400' : 'gray.300'}
                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)' }}
              />
              <InputRightAddon height="64px" fontSize="xl" bg="gray.100">%</InputRightAddon>
            </InputGroup>
            <Text fontSize="sm" color="gray.500" mt={1}>Ex: Digite 20 para 20%</Text>
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
