# Wizard de Acessibilidade — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o layout de página única por um wizard passo a passo otimizado para produtores rurais idosos e semi-analfabetos usando celular no campo.

**Architecture:** WizardContainer gerencia estado e navegação entre 6–7 passos. Cada passo é um componente isolado que recebe props e callbacks. Componentes visuais reutilizáveis (ProgressBar, SideDiagram, WizardNavigation) são compartilhados entre passos. A lógica de cálculo existente é preservada intacta.

**Tech Stack:** React 18, TypeScript, Chakra UI v2, Jest + React Testing Library

---

## Mapeamento de Arquivos

### Criar

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/components/calculator/wizard/types.ts` | Tipos compartilhados do wizard (WizardState, Shape, Side) |
| `src/components/calculator/wizard/WizardContainer.tsx` | Orquestra estado e navegação entre passos |
| `src/components/calculator/wizard/steps/ShapeStep.tsx` | Passo 1: seleção da forma do terreno |
| `src/components/calculator/wizard/steps/SideMeasureStep.tsx` | Passos 2–5: medida de um lado (reutilizável) |
| `src/components/calculator/wizard/steps/PaymentStep.tsx` | Passo 6: toneladas e percentual |
| `src/components/calculator/wizard/steps/ResultStep.tsx` | Passo 7: resultado em tela cheia |
| `src/components/calculator/wizard/components/SideDiagram.tsx` | SVG do terreno com lado ativo destacado |
| `src/components/calculator/wizard/components/ProgressBar.tsx` | Barra de progresso com 3 fases |
| `src/components/calculator/wizard/components/WizardNavigation.tsx` | Botões Voltar / Próximo |
| `src/components/calculator/wizard/__tests__/ShapeStep.test.tsx` | Testes do ShapeStep |
| `src/components/calculator/wizard/__tests__/SideMeasureStep.test.tsx` | Testes do SideMeasureStep |
| `src/components/calculator/wizard/__tests__/PaymentStep.test.tsx` | Testes do PaymentStep |
| `src/components/calculator/wizard/__tests__/ResultStep.test.tsx` | Testes do ResultStep |
| `src/components/calculator/wizard/__tests__/WizardContainer.test.tsx` | Teste de integração do fluxo completo |

### Modificar

| Arquivo | O que muda |
|---------|-----------|
| `src/components/calculator/CalculadoraCorteCana.tsx` | Substituir todo o conteúdo por delegate para WizardContainer |

### Deletar (testes do componente antigo)

| Arquivo | Motivo |
|---------|--------|
| `src/components/calculator/__tests__/CalculadoraCorteCana.test.tsx` | Testa estrutura da UI antiga (radio buttons, grade 2x2). Substituído por WizardContainer.test.tsx |

---

## Sequência de Passos do Wizard

```
rectangle: shape → measure-a → measure-b → measure-c → measure-d → payment → result
triangle:  shape → measure-a → measure-b → measure-c →             payment → result
```

### Labels de lado (linguagem simples)

| Side | Pergunta | Posição no SVG |
|------|----------|----------------|
| `a` | "Qual é a medida do lado de cima? (metros)" | topo |
| `b` | "Qual é a medida do lado esquerdo? (metros)" | esquerda |
| `c` | "Qual é a medida do lado de baixo? (metros)" | base |
| `d` | "Qual é a medida do lado direito? (metros)" | direita (apenas retângulo) |

### Fórmulas de cálculo (preservadas do componente original)

```typescript
// Retângulo
area = ((a + b) / 2) * ((c + d) / 2)
// Triângulo
area = ((a + b) / 2) * (c / 2)
// Valor
valorTotal = area * toneladas * valorPorTonelada  // valorPorTonelada em decimal (0.20 = 20%)
```

---

## Helper de test (reusar em todos os arquivos de teste)

```tsx
// Copiar no topo de cada arquivo de teste
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);
```

---

## Task 1: Tipos do Wizard

**Files:**
- Create: `src/components/calculator/wizard/types.ts`

- [ ] **Step 1: Criar o arquivo de tipos**

```typescript
// src/components/calculator/wizard/types.ts
export type Shape = 'rectangle' | 'triangle';
export type Side = 'a' | 'b' | 'c' | 'd';
export type WizardPhase = 'shape' | 'measure' | 'payment';

export interface WizardSides {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface WizardResult {
  area: number;
  valorTotal: number;
}

export interface WizardState {
  shape: Shape | null;
  sides: WizardSides;
  toneladas: number;
  valorPorTonelada: number; // decimal: 0.20 para 20%
  result: WizardResult | null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/calculator/wizard/types.ts
git commit -m "feat: add wizard types"
```

---

## Task 2: ProgressBar

**Files:**
- Create: `src/components/calculator/wizard/components/ProgressBar.tsx`
- Test: `src/components/calculator/wizard/__tests__/ProgressBar.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// src/components/calculator/wizard/__tests__/ProgressBar.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import ProgressBar from '../components/ProgressBar';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('ProgressBar', () => {
  it('renders 3 phase segments', () => {
    renderWithChakra(<ProgressBar currentPhase="shape" />);
    expect(screen.getByText('Terreno')).toBeInTheDocument();
    expect(screen.getByText('Medidas')).toBeInTheDocument();
    expect(screen.getByText('Pagamento')).toBeInTheDocument();
  });

  it('marks the active phase', () => {
    renderWithChakra(<ProgressBar currentPhase="measure" />);
    const medidas = screen.getByText('Medidas').closest('[data-active]');
    expect(medidas).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/ProgressBar.test.tsx
```
Esperado: FAIL — "Cannot find module '../components/ProgressBar'"

- [ ] **Step 3: Implementar ProgressBar**

```tsx
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
```

- [ ] **Step 4: Rodar e confirmar passou**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/ProgressBar.test.tsx
```
Esperado: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/calculator/wizard/components/ProgressBar.tsx \
        src/components/calculator/wizard/__tests__/ProgressBar.test.tsx
git commit -m "feat: add ProgressBar component"
```

---

## Task 3: WizardNavigation

**Files:**
- Create: `src/components/calculator/wizard/components/WizardNavigation.tsx`
- Test: `src/components/calculator/wizard/__tests__/WizardNavigation.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// src/components/calculator/wizard/__tests__/WizardNavigation.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import WizardNavigation from '../components/WizardNavigation';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('WizardNavigation', () => {
  it('renders next button with label', () => {
    renderWithChakra(
      <WizardNavigation onNext={jest.fn()} nextLabel="PRÓXIMO" showBack={false} />
    );
    expect(screen.getByText('PRÓXIMO')).toBeInTheDocument();
  });

  it('hides back button when showBack is false', () => {
    renderWithChakra(
      <WizardNavigation onNext={jest.fn()} nextLabel="PRÓXIMO" showBack={false} />
    );
    expect(screen.queryByText('← Voltar')).not.toBeInTheDocument();
  });

  it('shows back button when showBack is true', () => {
    renderWithChakra(
      <WizardNavigation onNext={jest.fn()} nextLabel="PRÓXIMO" showBack={true} onBack={jest.fn()} />
    );
    expect(screen.getByText('← Voltar')).toBeInTheDocument();
  });

  it('calls onNext when next button clicked', () => {
    const onNext = jest.fn();
    renderWithChakra(
      <WizardNavigation onNext={onNext} nextLabel="PRÓXIMO" showBack={false} />
    );
    fireEvent.click(screen.getByText('PRÓXIMO'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button clicked', () => {
    const onBack = jest.fn();
    renderWithChakra(
      <WizardNavigation onNext={jest.fn()} nextLabel="PRÓXIMO" showBack={true} onBack={onBack} />
    );
    fireEvent.click(screen.getByText('← Voltar'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/WizardNavigation.test.tsx
```
Esperado: FAIL

- [ ] **Step 3: Implementar WizardNavigation**

```tsx
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
```

- [ ] **Step 4: Rodar e confirmar passou**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/WizardNavigation.test.tsx
```
Esperado: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/calculator/wizard/components/WizardNavigation.tsx \
        src/components/calculator/wizard/__tests__/WizardNavigation.test.tsx
git commit -m "feat: add WizardNavigation component"
```

---

## Task 4: SideDiagram

**Files:**
- Create: `src/components/calculator/wizard/components/SideDiagram.tsx`
- Test: `src/components/calculator/wizard/__tests__/SideDiagram.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// src/components/calculator/wizard/__tests__/SideDiagram.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import SideDiagram from '../components/SideDiagram';

describe('SideDiagram', () => {
  it('renders an SVG element', () => {
    const { container } = render(<SideDiagram shape="rectangle" activeSide="a" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders for triangle shape', () => {
    const { container } = render(<SideDiagram shape="triangle" activeSide="a" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders for each side without crashing', () => {
    const sides = ['a', 'b', 'c', 'd'] as const;
    sides.forEach(side => {
      const { container } = render(<SideDiagram shape="rectangle" activeSide={side} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/SideDiagram.test.tsx
```
Esperado: FAIL

- [ ] **Step 3: Implementar SideDiagram**

```tsx
// src/components/calculator/wizard/components/SideDiagram.tsx
import React from 'react';
import { Shape, Side } from '../types';

interface SideDiagramProps {
  shape: Shape;
  activeSide: Side;
}

const ACTIVE_COLOR = '#FF6F00';
const NORMAL_COLOR = '#9E9E9E';
const FILL_COLOR = '#C8E6C9';
const STROKE_WIDTH = 3;
const ACTIVE_WIDTH = 6;

const RectangleDiagram: React.FC<{ activeSide: Side }> = ({ activeSide }) => (
  <svg width="220" height="140" viewBox="0 0 220 140" aria-hidden="true">
    {/* Fill */}
    <rect x="40" y="20" width="140" height="100" rx="4" fill={FILL_COLOR} />
    {/* Side A — topo */}
    <line x1="40" y1="20" x2="180" y2="20"
      stroke={activeSide === 'a' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'a' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side B — esquerda */}
    <line x1="40" y1="20" x2="40" y2="120"
      stroke={activeSide === 'b' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'b' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side C — base */}
    <line x1="40" y1="120" x2="180" y2="120"
      stroke={activeSide === 'c' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'c' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side D — direita */}
    <line x1="180" y1="20" x2="180" y2="120"
      stroke={activeSide === 'd' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'd' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
  </svg>
);

const TriangleDiagram: React.FC<{ activeSide: Side }> = ({ activeSide }) => (
  <svg width="220" height="140" viewBox="0 0 220 140" aria-hidden="true">
    {/* Fill */}
    <polygon points="110,15 195,125 25,125" fill={FILL_COLOR} />
    {/* Side A — topo-esquerda */}
    <line x1="110" y1="15" x2="25" y2="125"
      stroke={activeSide === 'a' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'a' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side B — topo-direita */}
    <line x1="110" y1="15" x2="195" y2="125"
      stroke={activeSide === 'b' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'b' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side C — base */}
    <line x1="25" y1="125" x2="195" y2="125"
      stroke={activeSide === 'c' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'c' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
  </svg>
);

const SideDiagram: React.FC<SideDiagramProps> = ({ shape, activeSide }) =>
  shape === 'rectangle'
    ? <RectangleDiagram activeSide={activeSide} />
    : <TriangleDiagram activeSide={activeSide} />;

export default SideDiagram;
```

- [ ] **Step 4: Rodar e confirmar passou**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/SideDiagram.test.tsx
```
Esperado: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/calculator/wizard/components/SideDiagram.tsx \
        src/components/calculator/wizard/__tests__/SideDiagram.test.tsx
git commit -m "feat: add SideDiagram SVG component"
```

---

## Task 5: ShapeStep

**Files:**
- Create: `src/components/calculator/wizard/steps/ShapeStep.tsx`
- Test: `src/components/calculator/wizard/__tests__/ShapeStep.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// src/components/calculator/wizard/__tests__/ShapeStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import ShapeStep from '../steps/ShapeStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('ShapeStep', () => {
  it('renders both shape options', () => {
    renderWithChakra(<ShapeStep selected={null} onSelect={jest.fn()} />);
    expect(screen.getByText('RETÂNGULO')).toBeInTheDocument();
    expect(screen.getByText('TRIÂNGULO')).toBeInTheDocument();
  });

  it('calls onSelect with rectangle when rectangle is clicked', () => {
    const onSelect = jest.fn();
    renderWithChakra(<ShapeStep selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('RETÂNGULO'));
    expect(onSelect).toHaveBeenCalledWith('rectangle');
  });

  it('calls onSelect with triangle when triangle is clicked', () => {
    const onSelect = jest.fn();
    renderWithChakra(<ShapeStep selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('TRIÂNGULO'));
    expect(onSelect).toHaveBeenCalledWith('triangle');
  });

  it('shows PRÓXIMO button', () => {
    renderWithChakra(<ShapeStep selected="rectangle" onSelect={jest.fn()} />);
    expect(screen.getByText('PRÓXIMO →')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/ShapeStep.test.tsx
```
Esperado: FAIL

- [ ] **Step 3: Implementar ShapeStep**

```tsx
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
```

- [ ] **Step 4: Rodar e confirmar passou**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/ShapeStep.test.tsx
```
Esperado: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/calculator/wizard/steps/ShapeStep.tsx \
        src/components/calculator/wizard/__tests__/ShapeStep.test.tsx
git commit -m "feat: add ShapeStep wizard component"
```

---

## Task 6: SideMeasureStep

**Files:**
- Create: `src/components/calculator/wizard/steps/SideMeasureStep.tsx`
- Test: `src/components/calculator/wizard/__tests__/SideMeasureStep.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// src/components/calculator/wizard/__tests__/SideMeasureStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import SideMeasureStep from '../steps/SideMeasureStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('SideMeasureStep', () => {
  const baseProps = {
    shape: 'rectangle' as const,
    side: 'a' as const,
    value: '',
    onChange: jest.fn(),
    onNext: jest.fn(),
    onBack: jest.fn(),
  };

  it('shows the question for side a (topo)', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} side="a" />);
    expect(screen.getByText(/lado de cima/i)).toBeInTheDocument();
  });

  it('shows the question for side b (esquerda)', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} side="b" />);
    expect(screen.getByText(/lado esquerdo/i)).toBeInTheDocument();
  });

  it('shows the question for side c (base)', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} side="c" />);
    expect(screen.getByText(/lado de baixo/i)).toBeInTheDocument();
  });

  it('shows the question for side d (direita)', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} side="d" />);
    expect(screen.getByText(/lado direito/i)).toBeInTheDocument();
  });

  it('renders input with numeric mode', () => {
    const { container } = renderWithChakra(<SideMeasureStep {...baseProps} />);
    const input = container.querySelector('input[inputmode="numeric"]');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    renderWithChakra(<SideMeasureStep {...baseProps} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '50' } });
    expect(onChange).toHaveBeenCalledWith('50');
  });

  it('shows error message when next is clicked with empty value', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} value="" />);
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    expect(screen.getByText(/maior que zero/i)).toBeInTheDocument();
  });

  it('calls onNext when value is valid', () => {
    const onNext = jest.fn();
    renderWithChakra(<SideMeasureStep {...baseProps} value="50" onNext={onNext} />);
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('shows back button', () => {
    renderWithChakra(<SideMeasureStep {...baseProps} />);
    expect(screen.getByText('← Voltar')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/SideMeasureStep.test.tsx
```
Esperado: FAIL

- [ ] **Step 3: Implementar SideMeasureStep**

```tsx
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
  a: 'Qual é a medida do lado de cima? (metros)',
  b: 'Qual é a medida do lado esquerdo? (metros)',
  c: 'Qual é a medida do lado de baixo? (metros)',
  d: 'Qual é a medida do lado direito? (metros)',
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
                m
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
```

- [ ] **Step 4: Rodar e confirmar passou**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/SideMeasureStep.test.tsx
```
Esperado: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/calculator/wizard/steps/SideMeasureStep.tsx \
        src/components/calculator/wizard/__tests__/SideMeasureStep.test.tsx
git commit -m "feat: add SideMeasureStep wizard component"
```

---

## Task 7: PaymentStep

**Files:**
- Create: `src/components/calculator/wizard/steps/PaymentStep.tsx`
- Test: `src/components/calculator/wizard/__tests__/PaymentStep.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// src/components/calculator/wizard/__tests__/PaymentStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import PaymentStep from '../steps/PaymentStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('PaymentStep', () => {
  const baseProps = {
    toneladas: '3',
    valorDisplay: '20',
    onToneladasChange: jest.fn(),
    onValorChange: jest.fn(),
    onNext: jest.fn(),
    onBack: jest.fn(),
  };

  it('renders toneladas field', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/toneladas/i)).toBeInTheDocument();
  });

  it('renders valor por tonelada field', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/valor por tonelada/i)).toBeInTheDocument();
  });

  it('shows CALCULAR button', () => {
    renderWithChakra(<PaymentStep {...baseProps} />);
    expect(screen.getByText(/calcular/i)).toBeInTheDocument();
  });

  it('shows error when toneladas is zero and CALCULAR clicked', () => {
    renderWithChakra(<PaymentStep {...baseProps} toneladas="0" />);
    fireEvent.click(screen.getByText(/calcular/i));
    expect(screen.getByText(/toneladas/i)).toBeInTheDocument();
  });

  it('calls onNext when all fields are valid', () => {
    const onNext = jest.fn();
    renderWithChakra(<PaymentStep {...baseProps} onNext={onNext} />);
    fireEvent.click(screen.getByText(/calcular/i));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/PaymentStep.test.tsx
```
Esperado: FAIL

- [ ] **Step 3: Implementar PaymentStep**

```tsx
// src/components/calculator/wizard/steps/PaymentStep.tsx
import React, { useState } from 'react';
import {
  Box, Text, Input, InputGroup, InputRightAddon, VStack, FormControl, FormLabel,
} from '@chakra-ui/react';
import { BsCalculator } from 'react-icons/bs';
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
```

- [ ] **Step 4: Rodar e confirmar passou**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/PaymentStep.test.tsx
```
Esperado: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/calculator/wizard/steps/PaymentStep.tsx \
        src/components/calculator/wizard/__tests__/PaymentStep.test.tsx
git commit -m "feat: add PaymentStep wizard component"
```

---

## Task 8: ResultStep

**Files:**
- Create: `src/components/calculator/wizard/steps/ResultStep.tsx`
- Test: `src/components/calculator/wizard/__tests__/ResultStep.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// src/components/calculator/wizard/__tests__/ResultStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import ResultStep from '../steps/ResultStep';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('ResultStep', () => {
  const baseProps = {
    valorTotal: 1260.0,
    area: 210,
    toneladas: 3,
    valorPorTonelada: 0.2,
    onNewCalculation: jest.fn(),
  };

  it('displays the formatted currency value', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.getByText(/1\.260,00/)).toBeInTheDocument();
  });

  it('displays the area', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.getByText(/210/)).toBeInTheDocument();
  });

  it('shows NOVO CÁLCULO button', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.getByText(/novo cálculo/i)).toBeInTheDocument();
  });

  it('calls onNewCalculation when button clicked', () => {
    const onNewCalculation = jest.fn();
    renderWithChakra(<ResultStep {...baseProps} onNewCalculation={onNewCalculation} />);
    fireEvent.click(screen.getByText(/novo cálculo/i));
    expect(onNewCalculation).toHaveBeenCalledTimes(1);
  });

  it('does not have a countdown timer', () => {
    renderWithChakra(<ResultStep {...baseProps} />);
    expect(screen.queryByText(/segundo/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/ResultStep.test.tsx
```
Esperado: FAIL

- [ ] **Step 3: Implementar ResultStep**

```tsx
// src/components/calculator/wizard/steps/ResultStep.tsx
import React from 'react';
import { Box, VStack, Text, Button } from '@chakra-ui/react';

interface ResultStepProps {
  valorTotal: number;
  area: number;
  toneladas: number;
  valorPorTonelada: number;
  onNewCalculation: () => void;
}

const ResultStep: React.FC<ResultStepProps> = ({
  valorTotal,
  area,
  toneladas,
  valorPorTonelada,
  onNewCalculation,
}) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valorTotal);

  return (
    <Box minH="100vh" bg="green.900" display="flex" flexDirection="column" justifyContent="center" px={6} py={10}>
      <VStack spacing={6} align="center">
        <Text color="whiteAlpha.800" fontSize="lg" textTransform="uppercase" letterSpacing="wider">
          ✅ Cálculo concluído
        </Text>

        <Text color="whiteAlpha.700" fontSize="md" textTransform="uppercase">
          VALOR A PAGAR
        </Text>

        <Text color="white" fontSize="5xl" fontWeight="bold" lineHeight="1" textAlign="center">
          {formattedValue}
        </Text>

        {/* Summary card */}
        <Box
          bg="whiteAlpha.200"
          borderRadius="xl"
          px={8}
          py={5}
          w="100%"
          mt={2}
        >
          <Text color="whiteAlpha.700" fontSize="sm" textTransform="uppercase" mb={3}>
            RESUMO
          </Text>
          <VStack align="start" spacing={1}>
            <Text color="white" fontSize="lg">Área: {area.toFixed(2)} m²</Text>
            <Text color="white" fontSize="lg">Toneladas: {toneladas}</Text>
            <Text color="white" fontSize="lg">Taxa: {(valorPorTonelada * 100).toFixed(0)}%</Text>
          </VStack>
        </Box>

        <Button
          bg="white"
          color="green.900"
          size="lg"
          height="56px"
          fontSize="xl"
          fontWeight="bold"
          width="100%"
          onClick={onNewCalculation}
          _hover={{ bg: 'gray.100' }}
        >
          🔄 NOVO CÁLCULO
        </Button>
      </VStack>
    </Box>
  );
};

export default ResultStep;
```

- [ ] **Step 4: Rodar e confirmar passou**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/ResultStep.test.tsx
```
Esperado: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/calculator/wizard/steps/ResultStep.tsx \
        src/components/calculator/wizard/__tests__/ResultStep.test.tsx
git commit -m "feat: add ResultStep — full-screen result with no timer"
```

---

## Task 9: WizardContainer

**Files:**
- Create: `src/components/calculator/wizard/WizardContainer.tsx`
- Test: `src/components/calculator/wizard/__tests__/WizardContainer.test.tsx`

- [ ] **Step 1: Escrever o teste de integração que falha**

```tsx
// src/components/calculator/wizard/__tests__/WizardContainer.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../../../styles/theme';
import WizardContainer from '../WizardContainer';

const renderWithChakra = (component: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{component}</ChakraProvider>);

describe('WizardContainer', () => {
  it('starts on the shape selection screen', () => {
    renderWithChakra(<WizardContainer />);
    expect(screen.getByText('Como é o seu terreno?')).toBeInTheDocument();
    expect(screen.getByText('RETÂNGULO')).toBeInTheDocument();
    expect(screen.getByText('TRIÂNGULO')).toBeInTheDocument();
  });

  it('advances to first measure step after selecting rectangle', () => {
    renderWithChakra(<WizardContainer />);
    fireEvent.click(screen.getByText('RETÂNGULO'));
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    expect(screen.getByText(/lado de cima/i)).toBeInTheDocument();
  });

  it('goes back from measure step to shape step', () => {
    renderWithChakra(<WizardContainer />);
    fireEvent.click(screen.getByText('RETÂNGULO'));
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    fireEvent.click(screen.getByText('← Voltar'));
    expect(screen.getByText('Como é o seu terreno?')).toBeInTheDocument();
  });

  it('completes full rectangle flow and shows result', () => {
    renderWithChakra(<WizardContainer />);

    // Step 1: select rectangle
    fireEvent.click(screen.getByText('RETÂNGULO'));
    fireEvent.click(screen.getByText('PRÓXIMO →'));

    // Steps 2-5: fill each side
    const sides = ['a', 'b', 'c', 'd'];
    for (const _ of sides) {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.click(screen.getByText('PRÓXIMO →'));
    }

    // Step 6: payment — fill both fields explicitly to be independent of hook init state
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3' } });
    const valorInput = screen.getByRole('textbox');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '20' } });
    fireEvent.click(screen.getByText(/calcular/i));

    // Step 7: result
    expect(screen.getByText(/novo cálculo/i)).toBeInTheDocument();
    expect(screen.getByText(/valor a pagar/i)).toBeInTheDocument();
  });

  it('resets to shape step after NOVO CÁLCULO', () => {
    renderWithChakra(<WizardContainer />);

    // Quick flow to result
    fireEvent.click(screen.getByText('RETÂNGULO'));
    fireEvent.click(screen.getByText('PRÓXIMO →'));
    const sides = ['a', 'b', 'c', 'd'];
    for (const _ of sides) {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.click(screen.getByText('PRÓXIMO →'));
    }
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3' } });
    const valorInput = screen.getByRole('textbox');
    fireEvent.change(valorInput, { target: { name: 'valorPorTonelada', value: '20' } });
    fireEvent.click(screen.getByText(/calcular/i));

    // Reset
    fireEvent.click(screen.getByText(/novo cálculo/i));
    expect(screen.getByText('Como é o seu terreno?')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/WizardContainer.test.tsx
```
Esperado: FAIL

- [ ] **Step 3: Implementar WizardContainer**

```tsx
// src/components/calculator/wizard/WizardContainer.tsx
import React, { useState } from 'react';
import { Shape, Side, WizardState } from './types';
import { usePercentageInput } from '../../../hooks/usePercentageInput';
import ShapeStep from './steps/ShapeStep';
import SideMeasureStep from './steps/SideMeasureStep';
import PaymentStep from './steps/PaymentStep';
import ResultStep from './steps/ResultStep';

type WizardStep =
  | { type: 'shape' }
  | { type: 'measure'; side: Side }
  | { type: 'payment' }
  | { type: 'result' };

const RECTANGLE_STEPS: WizardStep[] = [
  { type: 'shape' },
  { type: 'measure', side: 'a' },
  { type: 'measure', side: 'b' },
  { type: 'measure', side: 'c' },
  { type: 'measure', side: 'd' },
  { type: 'payment' },
  { type: 'result' },
];

const TRIANGLE_STEPS: WizardStep[] = [
  { type: 'shape' },
  { type: 'measure', side: 'a' },
  { type: 'measure', side: 'b' },
  { type: 'measure', side: 'c' },
  { type: 'payment' },
  { type: 'result' },
];

const INITIAL_STATE: WizardState = {
  shape: null,
  sides: { a: 0, b: 0, c: 0, d: 0 },
  toneladas: 3,
  valorPorTonelada: 0.2,
  result: null,
};

const calculateResult = (state: WizardState): { area: number; valorTotal: number } => {
  const { a, b, c, d } = state.sides;
  const area =
    state.shape === 'rectangle'
      ? ((a + b) / 2) * ((c + d) / 2)
      : ((a + b) / 2) * (c / 2);
  const valorTotal = area * state.toneladas * state.valorPorTonelada;
  return { area, valorTotal };
};

const WizardContainer: React.FC = () => {
  const [wizardState, setWizardState] = useState<WizardState>(INITIAL_STATE);
  const [stepIndex, setStepIndex] = useState(0);
  const [sideInputs, setSideInputs] = useState<Record<Side, string>>({
    a: '', b: '', c: '', d: '',
  });
  const [toneladasInput, setToneladasInput] = useState('3');

  const { displayValue, handlePercentageChange } = usePercentageInput(
    wizardState.valorPorTonelada
  );

  const steps = wizardState.shape === 'triangle' ? TRIANGLE_STEPS : RECTANGLE_STEPS;
  const currentStep = steps[stepIndex];

  const goNext = () => setStepIndex(i => Math.min(i + 1, steps.length - 1));
  const goBack = () => setStepIndex(i => Math.max(i - 1, 0));

  const handleShapeSelect = (shape: Shape) => {
    setWizardState(prev => ({ ...prev, shape }));
    // Reset side inputs when shape changes
    setSideInputs({ a: '', b: '', c: '', d: '' });
  };

  const handleSideChange = (side: Side, value: string) => {
    setSideInputs(prev => ({ ...prev, [side]: value }));
  };

  const handleSideNext = (side: Side) => {
    const num = parseFloat(sideInputs[side]);
    setWizardState(prev => ({
      ...prev,
      sides: { ...prev.sides, [side]: num },
    }));
    goNext();
  };

  const handlePaymentNext = () => {
    const toneladas = parseFloat(toneladasInput);
    const updatedState: WizardState = {
      ...wizardState,
      toneladas,
    };
    const result = calculateResult(updatedState);
    setWizardState({ ...updatedState, result });
    goNext();
  };

  const handleNewCalculation = () => {
    setWizardState(INITIAL_STATE);
    setSideInputs({ a: '', b: '', c: '', d: '' });
    setToneladasInput('3');
    setStepIndex(0);
  };

  if (currentStep.type === 'shape') {
    return (
      <ShapeStep
        selected={wizardState.shape}
        onSelect={handleShapeSelect}
        onNext={wizardState.shape ? goNext : undefined}
      />
    );
  }

  if (currentStep.type === 'measure') {
    const { side } = currentStep;
    return (
      <SideMeasureStep
        shape={wizardState.shape!}
        side={side}
        value={sideInputs[side]}
        onChange={value => handleSideChange(side, value)}
        onNext={() => handleSideNext(side)}
        onBack={goBack}
      />
    );
  }

  if (currentStep.type === 'payment') {
    return (
      <PaymentStep
        toneladas={toneladasInput}
        valorDisplay={displayValue}
        onToneladasChange={setToneladasInput}
        onValorChange={e =>
          handlePercentageChange(e, newValue =>
            setWizardState(prev => ({ ...prev, valorPorTonelada: newValue }))
          )
        }
        onNext={handlePaymentNext}
        onBack={goBack}
      />
    );
  }

  // result
  const result = wizardState.result ?? { area: 0, valorTotal: 0 };
  return (
    <ResultStep
      valorTotal={result.valorTotal}
      area={result.area}
      toneladas={wizardState.toneladas}
      valorPorTonelada={wizardState.valorPorTonelada}
      onNewCalculation={handleNewCalculation}
    />
  );
};

export default WizardContainer;
```

- [ ] **Step 4: Rodar e confirmar passou**

```bash
npx jest --no-cache src/components/calculator/wizard/__tests__/WizardContainer.test.tsx
```
Esperado: PASS

- [ ] **Step 5: Rodar toda a suite**

```bash
npx jest --no-cache
```
Esperado: PASS em todos

- [ ] **Step 6: Commit**

```bash
git add src/components/calculator/wizard/WizardContainer.tsx \
        src/components/calculator/wizard/__tests__/WizardContainer.test.tsx
git commit -m "feat: add WizardContainer — orchestrates full step-by-step flow"
```

---

## Task 10: Substituir CalculadoraCorteCana

**Files:**
- Modify: `src/components/calculator/CalculadoraCorteCana.tsx`
- Delete: `src/components/calculator/__tests__/CalculadoraCorteCana.test.tsx`

- [ ] **Step 1: Substituir o conteúdo do componente principal**

```tsx
// src/components/calculator/CalculadoraCorteCana.tsx
import React from 'react';
import WizardContainer from './wizard/WizardContainer';

const CalculadoraCorteCana: React.FC = () => <WizardContainer />;

export default CalculadoraCorteCana;
```

- [ ] **Step 2: Deletar o arquivo de teste antigo**

```bash
rm src/components/calculator/__tests__/CalculadoraCorteCana.test.tsx
```

- [ ] **Step 3: Rodar toda a suite de testes**

```bash
npx jest --no-cache
```
Esperado: PASS em todos os testes restantes. Nenhum teste deve referenciar os radio buttons ou o grid antigo.

- [ ] **Step 4: Rodar o build para garantir que não há erros de TypeScript**

```bash
npm run build
```
Esperado: compilação sem erros.

- [ ] **Step 5: Testar manualmente no browser**

```bash
npm run dev
```
Verificar manualmente:
- Tela 1: dois botões de forma aparecem, seleção funciona, PRÓXIMO ativa apenas após selecionar
- Telas 2–5 (rect) / 2–4 (tri): diagrama aparece com lado destacado, validação de campo vazio funciona, Voltar funciona
- Tela 6: campos de toneladas e % funcionam, validação funciona
- Tela 7: valor aparece formatado em BRL, sem timer, NOVO CÁLCULO reseta tudo

- [ ] **Step 6: Commit final**

```bash
git add src/components/calculator/CalculadoraCorteCana.tsx
git commit -m "feat: wire WizardContainer into main calculator component

Replaces single-page layout with step-by-step wizard optimized for
elderly semi-literate users on mobile. Removes 60s result timer,
adds visual side diagrams, plain language throughout."
```

---

## Verificação Final

- [ ] `npx jest --no-cache` — todos os testes passando
- [ ] `npm run build` — build sem erros TypeScript
- [ ] `npm run lint` — sem erros de lint
- [ ] Testar fluxo retângulo manualmente do início ao fim
- [ ] Testar fluxo triângulo manualmente do início ao fim
- [ ] Verificar no mobile (DevTools > device emulation) que teclado numérico abre nos inputs de medida
