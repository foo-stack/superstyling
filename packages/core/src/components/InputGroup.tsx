import { forwardRef, type ElementRef, type ReactNode } from "react";
import { XStack, YStack, Text as TamaguiText, type XStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";
import type { InputSize } from "./Input";

/**
 * InputGroup — composes an Input with left/right icons, addons (prefix/
 * suffix boxes), or small element overlays. Mirrors Chakra's
 * `<InputGroup>` pattern.
 *
 * Usage:
 *   <InputGroup>
 *     <InputLeftAddon>https://</InputLeftAddon>
 *     <Input placeholder="site.com" />
 *     <InputRightAddon>.io</InputRightAddon>
 *   </InputGroup>
 *
 * Elements (icons/buttons) vs Addons (text pills): elements sit INSIDE the
 * input's border box; addons sit OUTSIDE with their own border.
 */

export type InputGroupProps = Omit<XStackProps, "size"> &
  PseudoPropsMixin<Partial<XStackProps>> &
  SxPropMixin<Partial<XStackProps> & PseudoPropsMixin<Partial<XStackProps>>> & {
    size?: InputSize;
    children?: ReactNode;
  };

export type InputGroupElement = ElementRef<typeof XStack>;

export const InputGroup = forwardRef<InputGroupElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const { size = "md", children, ...rest } = props;
    const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
    return (
      <XStack
        ref={ref as never}
        alignItems="stretch"
        width="100%"
        {...({ "data-input-size": size } as object)}
        {...(translated as unknown as XStackProps)}
      >
        {children}
      </XStack>
    );
  },
);
InputGroup.displayName = "InputGroup";

const ELEMENT_SIZE_BY_INPUT: Record<InputSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
};

export type InputElementProps = {
  children?: ReactNode;
  size?: InputSize;
  placement?: "left" | "right";
  pointerEvents?: "auto" | "none";
};

function ElementImpl({ children, size = "md", placement }: InputElementProps) {
  const dim = ELEMENT_SIZE_BY_INPUT[size];
  return (
    <YStack
      position="absolute"
      {...(placement === "left" ? { left: 0 } : { right: 0 })}
      top={0}
      bottom={0}
      width={dim}
      alignItems="center"
      justifyContent="center"
      zIndex={2}
    >
      {children}
    </YStack>
  );
}

/** Icon/button overlay pinned to the input's left edge (absolute). */
export function InputLeftElement(props: Omit<InputElementProps, "placement">) {
  return <ElementImpl {...props} placement="left" />;
}
InputLeftElement.displayName = "InputLeftElement";

/** Icon/button overlay pinned to the input's right edge (absolute). */
export function InputRightElement(props: Omit<InputElementProps, "placement">) {
  return <ElementImpl {...props} placement="right" />;
}
InputRightElement.displayName = "InputRightElement";

export type InputAddonProps = {
  children?: ReactNode;
  size?: InputSize;
  placement?: "left" | "right";
};

function AddonImpl({ children, size = "md", placement }: InputAddonProps) {
  const height = ELEMENT_SIZE_BY_INPUT[size];
  const isLeft = placement === "left";
  return (
    <XStack
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$3"
      height={height}
      backgroundColor="$color3"
      borderWidth={1}
      borderColor="$borderColor"
      {...(isLeft
        ? {
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
            borderRightWidth: 0,
          }
        : {
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
            borderLeftWidth: 0,
          })}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <TamaguiText fontSize={14} color="$color10">
          {children}
        </TamaguiText>
      ) : (
        children
      )}
    </XStack>
  );
}

/** Prefix text/element with its own border. Renders outside the input box. */
export function InputLeftAddon(props: Omit<InputAddonProps, "placement">) {
  return <AddonImpl {...props} placement="left" />;
}
InputLeftAddon.displayName = "InputLeftAddon";

/** Suffix text/element with its own border. Renders outside the input box. */
export function InputRightAddon(props: Omit<InputAddonProps, "placement">) {
  return <AddonImpl {...props} placement="right" />;
}
InputRightAddon.displayName = "InputRightAddon";
