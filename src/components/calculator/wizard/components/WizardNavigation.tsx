// src/components/calculator/wizard/components/WizardNavigation.tsx
import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

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
      <Text
        textAlign="center"
        mt={4}
        color="gray.500"
        fontSize="lg"
        cursor="pointer"
        onClick={onBack}
      >
        ← Voltar
      </Text>
    )}
  </Box>
);

export default WizardNavigation;
