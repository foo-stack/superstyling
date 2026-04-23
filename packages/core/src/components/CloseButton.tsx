import { forwardRef } from "react";
import { IconButton, type IconButtonProps } from "./IconButton";
import { CloseIcon } from "@superstyling/icons";

/**
 * CloseButton — preset IconButton wrapping an `<CloseIcon>`. Ghost variant
 * by default so it blends into overlays. Size matches Chakra's sm/md/lg.
 */
export type CloseButtonProps = Omit<IconButtonProps, "icon" | "aria-label"> & {
  "aria-label"?: string;
};

export const CloseButton = forwardRef<unknown, CloseButtonProps>(function CloseButton(props, ref) {
  const { "aria-label": ariaLabel = "Close", variant = "ghost", size = "sm", ...rest } = props;
  return (
    <IconButton
      ref={ref as never}
      aria-label={ariaLabel}
      icon={<CloseIcon />}
      variant={variant}
      size={size}
      {...rest}
    />
  );
});
CloseButton.displayName = "CloseButton";
