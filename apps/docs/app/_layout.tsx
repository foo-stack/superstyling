import { Slot } from "one";
import { SuperStylingProvider, defaultSystem } from "@superstyling/core";

export default function Layout() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Superstyling docs</title>
      </head>
      <body>
        <SuperStylingProvider system={defaultSystem}>
          <Slot />
        </SuperStylingProvider>
      </body>
    </html>
  );
}
