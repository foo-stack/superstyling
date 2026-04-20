import { Path } from "react-native-svg";
import { Icon } from "./Icon";
import type { CreateIconConfig, IconProps } from "./types";

export function createIcon({ displayName, paths, viewBox = "0 0 24 24" }: CreateIconConfig) {
  function IconComponent(props: IconProps) {
    return (
      <Icon viewBox={viewBox} {...props}>
        {paths.map((d, i) => (
          <Path
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            d={d}
            stroke={props.color ?? "currentColor"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </Icon>
    );
  }
  IconComponent.displayName = displayName;
  return IconComponent;
}
