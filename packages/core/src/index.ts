export { SuperStylingProvider, type SuperStylingProviderProps } from "./SuperStylingProvider";
export { createSystem, type CreateSystemInput, type System } from "./createSystem";
export { defaultSuperStylingConfig, type SuperStylingConfig } from "./config";

// Primitive re-exports from Tamagui v2. `Stack` (polymorphic direction) is a
// Superstyling-owned component we'll author in Phase 2; Tamagui only ships
// `YStack` / `XStack` directly.
export { XStack, YStack, Text, H1, H2, H3, H4, H5, H6 } from "tamagui";
