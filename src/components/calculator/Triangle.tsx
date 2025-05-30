import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Dimensions } from '../../types/calculator';
import { validateTriangleInequality } from '../../utils/validation';
import '../../styles/shapes.css';

interface TriangleProps {
  dimensions: Dimensions;
}

const Triangle: React.FC<TriangleProps> = ({ dimensions }) => {
  const { ladoA, ladoB, ladoC } = dimensions;
  
  // Verificar se o triângulo é válido
  const isValidTriangle = ladoA > 0 && ladoB > 0 && ladoC > 0 && 
                         validateTriangleInequality(ladoA, ladoB, ladoC);
  
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
          aria-label="Visualização do triângulo"
        >
          {/* Triângulo base com preenchimento */}
          <path
            d="M150,50 L75,150 L225,150 Z"
            fill="#e8f5e9"
            stroke={isValidTriangle ? "#2e7d32" : "#d32f2f"}
            strokeWidth="2"
            strokeDasharray={!isValidTriangle ? "5,5" : "none"}
            className={isValidTriangle ? "triangle-path" : "triangle-path invalid"}
          />
          
          {/* Labels */}
          <g>
            {/* Label A - esquerdo */}
            <foreignObject x="35" y="85" width="60" height="25">
              <Box
                bg="white"
                px={2}
                py={1}
                borderRadius="md"
                boxShadow="md"
                border="1px"
                borderColor="green.200"
                textAlign="center"
                fontSize="11px"
                fontWeight="500"
                color="green.700"
              >
                <Text>A={ladoA}m</Text>
              </Box>
            </foreignObject>

            {/* Label B - base */}
            <foreignObject x="120" y="155" width="60" height="25">
              <Box
                bg="white"
                px={2}
                py={1}
                borderRadius="md"
                boxShadow="md"
                border="1px"
                borderColor="green.200"
                textAlign="center"
                fontSize="11px"
                fontWeight="500"
                color="green.700"
              >
                <Text>B={ladoB}m</Text>
              </Box>
            </foreignObject>

            {/* Label C - direito */}
            <foreignObject x="205" y="85" width="60" height="25">
              <Box
                bg="white"
                px={2}
                py={1}
                borderRadius="md"
                boxShadow="md"
                border="1px"
                borderColor="green.200"
                textAlign="center"
                fontSize="11px"
                fontWeight="500"
                color="green.700"
              >
                <Text>C={ladoC}m</Text>
              </Box>
            </foreignObject>
          </g>
        </svg>
      </Box>
    </Box>
  );
};

export default Triangle;
