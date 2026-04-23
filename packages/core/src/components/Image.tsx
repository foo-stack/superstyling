import { forwardRef, useEffect, useState, type ReactNode } from "react";
import { Image as TamaguiImage, type ImageProps as TamaguiImageProps } from "tamagui";

/**
 * Image — Tamagui Image wrapper with Chakra's `fallback` / `fallbackSrc` /
 * `objectFit` shape. On web, renders a real `<img>`; on native, Tamagui's
 * Image component which composes RN's `Image`.
 *
 * Fallback strategy (matches Chakra):
 *   1. If `src` loads: show it
 *   2. If `src` errors AND `fallbackSrc` is set: swap to fallbackSrc
 *   3. If both error (or no `src` ever provided) AND `fallback` is a
 *      ReactNode: render that node (e.g., initials, icon)
 */

export type ImageObjectFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export type ImageProps = Omit<TamaguiImageProps, "source" | "src" | "objectFit"> & {
  src?: string;
  alt?: string;
  /** URL used when the primary src errors. */
  fallbackSrc?: string;
  /** React node shown when src + fallbackSrc both error (or neither is set). */
  fallback?: ReactNode;
  /** How the image fits inside its box. Default `cover`. */
  objectFit?: ImageObjectFit;
  width?: number | string;
  height?: number | string;
};

/** Tamagui's Image isn't ref-forwardable at the type level in rc.41; opaque. */
export type ImageElement = unknown;

type LoadState = "initial" | "loaded" | "errored-primary" | "errored-fallback";

export const Image = forwardRef<ImageElement, ImageProps>(function Image(props, _ref) {
  const { src, alt, fallbackSrc, fallback, objectFit = "cover", ...rest } = props;
  const [state, setState] = useState<LoadState>(src ? "initial" : "errored-fallback");

  useEffect(() => {
    setState(src ? "initial" : "errored-fallback");
  }, [src]);

  // No src + fallback node → render the fallback directly
  if (!src || state === "errored-fallback") {
    return fallback ? <>{fallback}</> : null;
  }

  const effectiveSrc = state === "errored-primary" && fallbackSrc ? fallbackSrc : src;

  return (
    <TamaguiImage
      source={{ uri: effectiveSrc }}
      alt={alt}
      {...({ objectFit } as unknown as TamaguiImageProps)}
      onError={() => {
        if (state === "initial" && fallbackSrc) setState("errored-primary");
        else setState("errored-fallback");
      }}
      {...(rest as TamaguiImageProps)}
    />
  );
});
Image.displayName = "Image";
