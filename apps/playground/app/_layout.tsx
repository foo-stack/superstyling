import { Slot } from "expo-router";
import { SuperStylingProvider } from "@superstyling/core";

export default function RootLayout() {
  return (
    <SuperStylingProvider>
      <Slot />
    </SuperStylingProvider>
  );
}
