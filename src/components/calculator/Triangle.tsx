import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Dimensions } from '../../types/calculator';
import { validateTriangleInequality } from '../../utils/validation';

interface TriangleProps {
  dimensions: Dimensions;
}

const Triangle: React.FC<TriangleProps> = ({ dimensions }) => {
  const { ladoA, ladoB, ladoC } = dimensions;
  
  // Verificar se o triângulo é válido
  const isValidTriangle = ladoA > 0 && ladoB > 0 && ladoC > 0 && 
                         validateTriangleInequality(ladoA, ladoB, ladoC);
  
  // Classe adicional para triângulo inválido
  const triangleClass = isValidTriangle ? "triangle-path" : "triangle-path invalid";
  
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
            d="M150,30 L50,170 L250,170 Z"
            fill="#e8f5e9"
            stroke="#2e7d32"
            strokeWidth="2"
            className={triangleClass}
          />

          {/* Labels */}
          <g>
            {/* Label A - topo */}
            <foreignObject x="120" y="5" width="60" height="25">
              <Box
                bg="white"
                px={2}
                py={1}
                borderRadius="md"
                boxShadow="md"
                border="1px"
                borderColor="brand.200"
                textAlign="center"
                fontSize="sm"
                fontWeight="500"
                color="brand.700"
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
                borderColor="brand.200"
                textAlign="center"
                fontSize="sm"
                fontWeight="500"
                color="brand.700"
              >
                <Text>B={ladoB}m</Text>
              </Box>
            </foreignObject>

            {/* Label C - direita */}
            <foreignObject x="230" y="85" width="60" height="25">
              <Box
                bg="white"
                px={2}
                py={1}
                borderRadius="md"
                boxShadow="md"
                border="1px"
                borderColor="brand.200"
                textAlign="center"
                fontSize="sm"
                fontWeight="500"
                color="brand.700"
              >
                <Text>C={ladoC}m</Text>
              </Box>
            </foreignObject>
          </g>
          
          {/* Mensagem de validação */}
          {!isValidTriangle && ladoA > 0 && ladoB > 0 && ladoC > 0 && (
            <foreignObject x="75" y="100" width="150" height="40">
              <div className="validation-message">
                Triângulo inválido
              </div>
            </foreignObject>
          )}
        </svg>
      </Box>
    </Box>
  );
};

export default Triangle;
