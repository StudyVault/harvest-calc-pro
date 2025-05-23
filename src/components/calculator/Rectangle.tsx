import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface RectangleProps {
  dimensions: {
    ladoA: number;
    ladoB: number;
    ladoC: number;
    ladoD: number;
  };
}

const Rectangle: React.FC<RectangleProps> = ({ dimensions }) => {
  const { ladoA, ladoB, ladoC, ladoD } = dimensions;
  
  return (
    <Box className="shape-container">
      <Box className="shape-visualization">
        <svg 
          viewBox="0 0 300 200" 
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '250px',
          }}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Visualização do retângulo"
        >
          {/* Retângulo base com preenchimento */}
          <rect
            x="75"
            y="50"
            width="150"
            height="100"
            fill="#e8f5e9"
            stroke="#2e7d32"
            strokeWidth="2"
          />
          
          {/* Labels */}
          <g>
            {/* Label A - topo */}
            <foreignObject x="120" y="15" width="60" height="25">
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
                <Text>A={ladoA}m</Text>
              </Box>
            </foreignObject>

            {/* Label B - esquerda */}
            <foreignObject x="10" y="85" width="60" height="25">
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
                <Text>B={ladoB}m</Text>
              </Box>
            </foreignObject>

            {/* Label C - base */}
            <foreignObject x="120" y="160" width="60" height="25">
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
                <Text>C={ladoC}m</Text>
              </Box>
            </foreignObject>

            {/* Label D - direita */}
            <foreignObject x="230" y="85" width="60" height="25">
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
                <Text>D={ladoD}m</Text>
              </Box>
            </foreignObject>
          </g>
        </svg>
      </Box>
    </Box>
  );
};

export default Rectangle;
