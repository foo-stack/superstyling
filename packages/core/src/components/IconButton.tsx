import { forwardRef, type ReactElement } from "react";
import { Button, type ButtonElement, type ButtonProps } from "./Button";

/**
 * IconButton — Button with icon-only content. Chakra-style API: `icon` prop
 * is the rendered icon element, and `aria-label` is REQUIRED for
 * accessibility since there is no visible text label.
 *
 * Renders as a square (width = height from the size token).
 */
export type IconButtonProps = Omit<
  ButtonProps,
  "children" | "leftIcon" | "rightIcon" | "loadingText" | "spinnerPlacement"
> & {
  icon: ReactElement;
  "aria-label": string;
};

const SQUARE_SIZE: Record<NonNullable<ButtonProps["size"]>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
};

export const IconButton = forwardRef<ButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const { icon, size = "md", ...rest } = props;
    return (
      <Button ref={ref} size={size} width={SQUARE_SIZE[size]} paddingHorizontal={0} {...rest}>
        {icon}
      </Button>
    );
  },
);
IconButton.displayName = "IconButton";
