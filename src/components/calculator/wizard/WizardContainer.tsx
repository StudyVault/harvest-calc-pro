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

// Formula preserved from the original CalculadoraCorteCana.calcularPagamento:
// rectangle: average of opposite sides × average of other pair (trapezoid approximation)
// triangle: average of A+B sides × half of C (base)
// Note: useAreaCalculations hook uses a different formula and was not used by the original component.
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
