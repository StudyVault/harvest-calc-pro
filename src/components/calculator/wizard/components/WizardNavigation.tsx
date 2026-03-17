// src/components/calculator/wizard/components/WizardNavigation.tsx
import React from 'react';
import { Box, Button } from '@chakra-ui/react';

interface WizardNavigationProps {
  onNext: () => void;
  nextLabel: string;
  showBack: boolean;
  onBack?: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onNext,
  nextLabel,
  showBack,
  onBack,
}) => (
  <Box mt={6}>
    <Button
      colorScheme="green"
      size="lg"
      width="100%"
      height="56px"
      fontSize="xl"
      fontWeight="bold"
      onClick={onNext}
    >
      {nextLabel}
    </Button>
    {showBack && (
      <Button
        variant="ghost"
        width="100%"
        mt={4}
        color="gray.500"
        fontSize="lg"
        onClick={onBack}
      >
        ← Voltar
      </Button>
    )}
  </Box>
);

export default WizardNavigation;
