import { useCallback, useMemo, useState } from 'react';

type Result = [number, () => void, () => void, (step: number) => void];

const useStepper = (): Result => {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(
    () => setStep((s) => s + 1),
    []
  );

  const prevStep = useCallback(
    () => setStep((s) => s - 1),
    []
  );

  return useMemo(
    () => [step, nextStep, prevStep, setStep],
    [step, nextStep, prevStep, setStep]
  );
}

export default useStepper;
