import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface MeasurementLabelProps {
  label: string;
  value: number;
  x: number;
  y: number;
}

const MeasurementLabel: React.FC<MeasurementLabelProps> = ({ label, value, x, y }) => {
  return (
    <foreignObject x={x} y={y} width={60} height={25}>
      <Box
        bg="white"
        px={2}
        py={1}
        borderRadius="md"
        boxShadow="md"
        border="1px"
        borderColor="green.200"
        textAlign="center"
        fontSize="sm"
        fontWeight="500"
        color="green.700"
      >
        <Text>{label}={value}m</Text>
      </Box>
    </foreignObject>
  );
};

export default MeasurementLabel; 