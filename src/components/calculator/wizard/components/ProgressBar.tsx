// src/components/calculator/wizard/components/ProgressBar.tsx
import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { WizardPhase } from '../types';

interface ProgressBarProps {
  currentPhase: WizardPhase;
}

const PHASES: { key: WizardPhase; label: string }[] = [
  { key: 'shape', label: 'Terreno' },
  { key: 'measure', label: 'Medidas' },
  { key: 'payment', label: 'Pagamento' },
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPhase }) => {
  const currentIndex = PHASES.findIndex(p => p.key === currentPhase);

  return (
    <Flex gap={1} justify="center" mb={4}>
      {PHASES.map((phase, i) => {
        const isActive = phase.key === currentPhase;
        const isDone = i < currentIndex;
        return (
          <Box key={phase.key} flex={1} data-active={isActive ? '' : undefined}>
            <Box
              h="6px"
              borderRadius="full"
              bg={isActive || isDone ? 'white' : 'whiteAlpha.400'}
              mb={1}
            />
            <Text
              fontSize="11px"
              color={isActive ? 'white' : 'whiteAlpha.600'}
              textAlign="center"
              fontWeight={isActive ? 'bold' : 'normal'}
            >
              {phase.label}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};

export default ProgressBar;
