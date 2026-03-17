// src/components/calculator/wizard/steps/ShapeStep.tsx
import React from 'react';
import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import { Shape } from '../types';
import ProgressBar from '../components/ProgressBar';
import WizardNavigation from '../components/WizardNavigation';

interface ShapeStepProps {
  selected: Shape | null;
  onSelect: (shape: Shape) => void;
  onNext?: () => void;
}

const SHAPES: { value: Shape; label: string; subtitle: string; svgPath: string }[] = [
  {
    value: 'rectangle',
    label: 'RETÂNGULO',
    subtitle: 'Terreno com 4 lados',
    svgPath: 'M10,10 L90,10 L90,60 L10,60 Z',
  },
  {
    value: 'triangle',
    label: 'TRIÂNGULO',
    subtitle: 'Terreno com 3 lados',
    svgPath: 'M50,8 L92,65 L8,65 Z',
  },
];

const ShapeStep: React.FC<ShapeStepProps> = ({ selected, onSelect, onNext }) => (
  <Box minH="100vh" bg="green.700">
    {/* Header */}
    <Box bg="green.700" px={6} pt={8} pb={4}>
      <ProgressBar currentPhase="shape" />
      <Text color="white" fontSize="2xl" fontWeight="bold" textAlign="center">
        Como é o seu terreno?
      </Text>
    </Box>

    {/* Body */}
    <Box bg="white" borderTopRadius="2xl" px={6} pt={6} pb={8} minH="70vh">
      <VStack spacing={4} mb={6}>
        {SHAPES.map(({ value, label, subtitle, svgPath }) => {
          const isSelected = selected === value;
          return (
            <Box
              key={value}
              as="button"
              w="100%"
              border={isSelected ? '3px solid' : '2px solid'}
              borderColor={isSelected ? 'green.600' : 'gray.300'}
              borderRadius="2xl"
              p={6}
              bg={isSelected ? 'green.50' : 'gray.50'}
              onClick={() => onSelect(value)}
              cursor="pointer"
              textAlign="center"
              _hover={{ borderColor: 'green.400' }}
            >
              <Flex justify="center" mb={3}>
                <svg width="100" height="72" viewBox="0 0 100 72" aria-hidden="true">
                  <path
                    d={svgPath}
                    fill="#C8E6C9"
                    stroke={isSelected ? '#2E7D32' : '#9E9E9E'}
                    strokeWidth="3"
                  />
                </svg>
              </Flex>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={isSelected ? 'green.700' : 'gray.600'}
              >
                {label}
              </Text>
              <Text fontSize="md" color="gray.500" mt={1}>
                {subtitle}
              </Text>
            </Box>
          );
        })}
      </VStack>

      {onNext && (
        <WizardNavigation
          onNext={onNext}
          nextLabel="PRÓXIMO →"
          showBack={false}
        />
      )}
    </Box>
  </Box>
);

export default ShapeStep;
