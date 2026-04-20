import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ComponentProps,
  type ElementRef,
  type ReactNode,
} from "react";
import { Text as TamaguiText, Theme, XStack, YStack, type XStackProps } from "tamagui";
import { CheckCircleIcon, ErrorIcon, InfoIcon, WarningIcon } from "@superstyling/icons";
import { Spinner } from "./Spinner";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

export type AlertStatus = "info" | "success" | "warning" | "error" | "loading";
export type AlertVariant = "subtle" | "solid" | "left-accent" | "top-accent";

const STATUS_COLOR_SCHEME: Record<AlertStatus, string> = {
  info: "blue",
  success: "green",
  warning: "orange",
  error: "red",
  loading: "blue",
};

const STATUS_ICON: Record<AlertStatus, (props: ComponentProps<typeof InfoIcon>) => ReactNode> = {
  info: (p) => <InfoIcon {...p} />,
  success: (p) => <CheckCircleIcon {...p} />,
  warning: (p) => <WarningIcon {...p} />,
  error: (p) => <ErrorIcon {...p} />,
  loading: () => <Spinner size="small" color="$primary" />,
};

// ────────────────────────────────────────────────────────────────────────
// Context — shared by Root / Icon / Title / Description

interface AlertContextValue {
  status: AlertStatus;
  variant: AlertVariant;
}

const AlertContext = createContext<AlertContextValue | null>(null);

function useAlertContext(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("[superstyling] Alert subcomponents must be rendered inside <Alert>");
  }
  return ctx;
}

// ────────────────────────────────────────────────────────────────────────
// Root

type XStackPropsBase = Omit<XStackProps, "size">;

export type AlertProps = XStackPropsBase &
  PseudoPropsMixin<Partial<XStackPropsBase>> &
  SxPropMixin<Partial<XStackPropsBase> & PseudoPropsMixin<Partial<XStackPropsBase>>> & {
    status?: AlertStatus;
    variant?: AlertVariant;
  };

export type AlertElement = ElementRef<typeof XStack>;

const AlertRoot = forwardRef<AlertElement, AlertProps>(function Alert(props, ref) {
  const { status = "info", variant = "subtle", children, ...rest } = props;
  const colorScheme = STATUS_COLOR_SCHEME[status];
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  const contextValue = useMemo<AlertContextValue>(() => ({ status, variant }), [status, variant]);

  const variantStyle = buildVariantStyle(variant);

  return (
    <AlertContext.Provider value={contextValue}>
      <Theme name={colorScheme}>
        <XStack
          ref={ref as never}
          role="alert"
          alignItems="flex-start"
          gap={12}
          padding={12}
          borderRadius={6}
          {...variantStyle}
          {...(translated as unknown as XStackProps)}
        >
          {children}
        </XStack>
      </Theme>
    </AlertContext.Provider>
  );
});
AlertRoot.displayName = "Alert";

function buildVariantStyle(variant: AlertVariant): Partial<XStackProps> {
  switch (variant) {
    case "solid":
      return { backgroundColor: "$primary" } as Partial<XStackProps>;
    case "left-accent":
      return {
        backgroundColor: "$primaryMuted",
        borderLeftWidth: 4,
        borderLeftColor: "$primary",
      } as Partial<XStackProps>;
    case "top-accent":
      return {
        backgroundColor: "$primaryMuted",
        borderTopWidth: 4,
        borderTopColor: "$primary",
      } as Partial<XStackProps>;
    case "subtle":
    default:
      return { backgroundColor: "$primaryMuted" } as Partial<XStackProps>;
  }
}

// ────────────────────────────────────────────────────────────────────────
// Subcomponents

interface AlertIconProps {
  /** Override icon; defaults to a status-appropriate glyph. */
  children?: ReactNode;
  size?: number;
}

function AlertIcon({ children, size = 20 }: AlertIconProps) {
  const { status, variant } = useAlertContext();
  if (children !== undefined && children !== null) {
    return <>{children}</>;
  }
  const color = variant === "solid" ? "$primaryContrast" : "$primary";
  const renderIcon = STATUS_ICON[status];
  return <>{renderIcon({ size, color })}</>;
}

interface AlertTextProps {
  children?: ReactNode;
}

function AlertTitle({ children }: AlertTextProps) {
  const { variant } = useAlertContext();
  const color = variant === "solid" ? "$primaryContrast" : "$primary";
  return (
    <TamaguiText fontWeight="700" color={color}>
      {children}
    </TamaguiText>
  );
}

function AlertDescription({ children }: AlertTextProps) {
  const { variant } = useAlertContext();
  const color = variant === "solid" ? "$primaryContrast" : "$foreground";
  return (
    <TamaguiText color={color} opacity={variant === "solid" ? 0.9 : 1}>
      {children}
    </TamaguiText>
  );
}

function AlertContent({ children }: { children?: ReactNode }) {
  return (
    <YStack flex={1} gap={2}>
      {children}
    </YStack>
  );
}

// ────────────────────────────────────────────────────────────────────────

export const Alert = Object.assign(AlertRoot, {
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
  Content: AlertContent,
});
