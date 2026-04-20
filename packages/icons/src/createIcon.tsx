import { Icon } from "./Icon";
import type { CreateIconConfig, IconProps } from "./types";

/**
 * Factory that turns a config (display name, viewBox, path-data strings) into
 * a typed icon component. On the web, each path becomes an `<path>` element;
 * on native, `createIcon.native.tsx` overrides this to emit `<Path>` from
 * `react-native-svg`.
 *
 * Usage (icon authors):
 * ```ts
 * export const CheckIcon = createIcon({
 *   displayName: "CheckIcon",
 *   paths: ["M5 12l5 5L20 7"],
 * });
 * ```
 */
export function createIcon({ displayName, paths, viewBox = "0 0 24 24" }: CreateIconConfig) {
  function IconComponent(props: IconProps) {
    return (
      <Icon viewBox={viewBox} {...props}>
        {paths.map((d, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <path key={i} d={d} />
        ))}
      </Icon>
    );
  }
  IconComponent.displayName = displayName;
  return IconComponent;
}
