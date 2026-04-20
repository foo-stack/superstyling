import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SuperStylingProvider } from "@superstyling/core";
import { App } from "./App";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("root element missing");

createRoot(rootEl).render(
  <StrictMode>
    <SuperStylingProvider>
      <App />
    </SuperStylingProvider>
  </StrictMode>,
);
