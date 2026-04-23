import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { Text as TamaguiText, XStack, YStack, type XStackProps, type YStackProps } from "tamagui";
import { CheckIcon } from "@superstyling/icons";

/**
 * Stepper — progress indicator for multi-step flows. Matches Chakra's
 * Stepper compound (v2.5+).
 *
 *   <Stepper index={currentStep}>
 *     <Stepper.Step>
 *       <Stepper.Indicator>
 *         <Stepper.Number />
 *       </Stepper.Indicator>
 *       <YStack>
 *         <Stepper.Title>Account</Stepper.Title>
 *         <Stepper.Description>Create your account</Stepper.Description>
 *       </YStack>
 *       <Stepper.Separator />
 *     </Stepper.Step>
 *     …
 *   </Stepper>
 */

export type StepStatus = "incomplete" | "active" | "complete";
export type StepperOrientation = "horizontal" | "vertical";

interface StepperContextValue {
  index: number;
  orientation: StepperOrientation;
  colorScheme: string;
}

const StepperContext = createContext<StepperContextValue>({
  index: 0,
  orientation: "horizontal",
  colorScheme: "blue",
});

interface StepContextValue {
  stepIndex: number;
  status: StepStatus;
}

const StepContext = createContext<StepContextValue>({ stepIndex: 0, status: "incomplete" });

function getStatus(index: number, stepIndex: number): StepStatus {
  if (stepIndex < index) return "complete";
  if (stepIndex === index) return "active";
  return "incomplete";
}

// ────────────────────────────────────────────────────────────────────────
// Root

export interface StepperProps extends XStackProps {
  /** Current step index (0-based). */
  index: number;
  orientation?: StepperOrientation;
  colorScheme?: string;
  children?: ReactNode;
}

const StepperRoot = forwardRef<unknown, StepperProps>(function Stepper(props, ref) {
  const { index, orientation = "horizontal", colorScheme = "blue", children, ...rest } = props;

  // Assign a stepIndex to each direct Step child so Indicator/Number can
  // show the right state without the caller threading it manually.
  const steps = Children.toArray(children).filter(isValidElement);

  const ctx = useMemo<StepperContextValue>(
    () => ({ index, orientation, colorScheme }),
    [index, orientation, colorScheme],
  );

  return (
    <StepperContext.Provider value={ctx}>
      <XStack
        ref={ref as never}
        flexDirection={orientation === "vertical" ? "column" : "row"}
        alignItems={orientation === "vertical" ? "stretch" : "center"}
        gap="$3"
        {...rest}
      >
        {steps.map((step, i) => (
          <StepContext.Provider key={i} value={{ stepIndex: i, status: getStatus(index, i) }}>
            {step}
          </StepContext.Provider>
        ))}
      </XStack>
    </StepperContext.Provider>
  );
});
StepperRoot.displayName = "Stepper";

// ────────────────────────────────────────────────────────────────────────
// Step

const Step = forwardRef<unknown, XStackProps>(function Step(props, ref) {
  const { orientation } = useContext(StepperContext);
  return (
    <XStack
      ref={ref as never}
      flexDirection={orientation === "vertical" ? "row" : "row"}
      alignItems="center"
      gap="$2"
      flex={1}
      {...props}
    />
  );
});
Step.displayName = "Stepper.Step";

// ────────────────────────────────────────────────────────────────────────
// Indicator — the circle holding the number or a check icon

const Indicator = forwardRef<unknown, YStackProps>(function Indicator(props, ref) {
  const { status } = useContext(StepContext);
  const bg = status === "complete" ? "$primary" : status === "active" ? "$primary" : "$color3";
  const border =
    status === "complete" ? "$primary" : status === "active" ? "$primary" : "$borderColor";

  return (
    <YStack
      ref={ref as never}
      width={32}
      height={32}
      borderRadius={16}
      alignItems="center"
      justifyContent="center"
      backgroundColor={status === "active" ? "transparent" : bg}
      borderWidth={2}
      borderColor={border}
      {...props}
    >
      {status === "complete" ? <CheckIcon size={16} color="white" /> : props.children}
    </YStack>
  );
});
Indicator.displayName = "Stepper.Indicator";

// ────────────────────────────────────────────────────────────────────────
// Number — shown inside the Indicator when incomplete/active

const StepNumber = function StepNumber() {
  const { stepIndex, status } = useContext(StepContext);
  return (
    <TamaguiText
      fontSize={14}
      fontWeight="600"
      color={status === "active" ? "$primary" : "$color11"}
    >
      {stepIndex + 1}
    </TamaguiText>
  );
};
StepNumber.displayName = "Stepper.Number";

// ────────────────────────────────────────────────────────────────────────
// Separator — line between steps. Auto-hides on the final step.

const StepSeparator = forwardRef<unknown, XStackProps>(function StepSeparator(props, ref) {
  const { status } = useContext(StepContext);
  const { orientation } = useContext(StepperContext);
  const complete = status === "complete";
  return (
    <XStack
      ref={ref as never}
      flex={1}
      {...(orientation === "vertical" ? { width: 2, minHeight: 24 } : { height: 2, minWidth: 24 })}
      backgroundColor={complete ? "$primary" : "$color4"}
      {...props}
    />
  );
});
StepSeparator.displayName = "Stepper.Separator";

// ────────────────────────────────────────────────────────────────────────
// Title / Description — text labels beside the indicator

const StepTitle = forwardRef<unknown, XStackProps>(function StepTitle(props, ref) {
  const { status } = useContext(StepContext);
  return (
    <TamaguiText
      ref={ref as never}
      fontSize={14}
      fontWeight="600"
      color={status === "incomplete" ? "$color10" : "$color"}
      {...(props as object)}
    />
  );
});
StepTitle.displayName = "Stepper.Title";

const StepDescription = forwardRef<unknown, XStackProps>(function StepDescription(props, ref) {
  return <TamaguiText ref={ref as never} fontSize={12} color="$color10" {...(props as object)} />;
});
StepDescription.displayName = "Stepper.Description";

// ────────────────────────────────────────────────────────────────────────

export const Stepper = Object.assign(StepperRoot, {
  Step,
  Indicator,
  Number: StepNumber,
  Separator: StepSeparator,
  Title: StepTitle,
  Description: StepDescription,
});

/** `useSteps` — Chakra-compatible hook for controlling a Stepper's state. */
import { useCallback, useState } from "react";
export function useSteps({ index: initialIndex = 0, count }: { index?: number; count: number }) {
  const [activeStep, setActiveStep] = useState(initialIndex);
  const goToNext = useCallback(() => setActiveStep((i) => Math.min(i + 1, count - 1)), [count]);
  const goToPrevious = useCallback(() => setActiveStep((i) => Math.max(i - 1, 0)), []);
  const reset = useCallback(() => setActiveStep(0), []);
  const setStep = setActiveStep;
  const isActiveStep = useCallback((i: number) => i === activeStep, [activeStep]);
  const isCompleteStep = useCallback((i: number) => i < activeStep, [activeStep]);
  return {
    activeStep,
    setActiveStep: setStep,
    goToNext,
    goToPrevious,
    reset,
    isActiveStep,
    isCompleteStep,
  };
}
