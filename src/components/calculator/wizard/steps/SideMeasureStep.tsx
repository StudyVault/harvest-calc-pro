// src/components/calculator/wizard/steps/SideMeasureStep.tsx
import React, { useState } from 'react';
import { Box, Text, Input, InputGroup, InputRightAddon, VStack } from '@chakra-ui/react';
import { Shape, Side } from '../types';
import SideDiagram from '../components/SideDiagram';
import ProgressBar from '../components/ProgressBar';
import WizardNavigation from '../components/WizardNavigation';

interface SideMeasureStepProps {
  shape: Shape;
  side: Side;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const SIDE_LABELS: Record<Side, string> = {
  a: 'Qual é a medida do lado de cima? (braças)',
  b: 'Qual é a medida do lado esquerdo? (braças)',
  c: 'Qual é a medida do lado de baixo? (braças)',
  d: 'Qual é a medida do lado direito? (braças)',
};

const SideMeasureStep: React.FC<SideMeasureStepProps> = ({
  shape,
  side,
  value,
  onChange,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState('');

  const handleNext = () => {
    const num = parseFloat(value);
    if (!value || isNaN(num) || num <= 0) {
      setError('Digite um número maior que zero');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <Box minH="100vh" bg="green.700">
      {/* Header */}
      <Box bg="green.700" px={6} pt={8} pb={4}>
        <ProgressBar currentPhase="measure" />
        <Text color="white" fontSize="xl" fontWeight="bold" textAlign="center">
          {SIDE_LABELS[side]}
        </Text>
      </Box>

      {/* Body */}
      <Box bg="white" borderTopRadius="2xl" px={6} pt={6} pb={8} minH="70vh">
        <VStack spacing={6}>
          {/* Diagram */}
          <Box display="flex" justifyContent="center" py={2}>
            <SideDiagram shape={shape} activeSide={side} />
          </Box>

          {/* Input */}
          <Box w="100%">
            <InputGroup size="lg">
              <Input
                type="number"
                inputMode="numeric"
                value={value}
                onChange={e => {
                  setError('');
                  onChange(e.target.value);
                }}
                placeholder="0"
                fontSize="2xl"
                height="64px"
                borderWidth={2}
                borderColor={error ? 'red.400' : 'gray.300'}
                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)' }}
              />
              <InputRightAddon height="64px" fontSize="xl" bg="gray.100">
                br
              </InputRightAddon>
            </InputGroup>
            {error && (
              <Text color="red.500" fontSize="md" mt={2}>
                {error}
              </Text>
            )}
          </Box>

          <WizardNavigation
            onNext={handleNext}
            nextLabel="PRÓXIMO →"
            showBack={true}
            onBack={onBack}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default SideMeasureStep;
