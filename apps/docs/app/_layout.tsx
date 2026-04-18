import { Slot } from "one";
import { SuperStylingProvider } from "@superstyling/core";

export default function Layout() {
  return (
    <SuperStylingProvider>
      <Slot />
    </SuperStylingProvider>
  );
}
