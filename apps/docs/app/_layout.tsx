import { Slot } from "one";
import { SuperStylingProvider } from "@superstyling/core";
import { docsSystem } from "../tamagui.config";

const TITLE = "Superstyling — Chakra-shaped UI on Tamagui";
const DESCRIPTION =
  "Cross-platform React component library with Chakra UI's developer experience and Tamagui's web + iOS + Android engine. Drop-in migration from Chakra v2 with a built-in codemod.";
const SITE_URL = "https://superstyling.dev";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function Layout() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* Google Fonts — Inter (body/heading) + JetBrains Mono (code). Loaded
            blocking on first paint to avoid FOUT on the landing hero. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />

        {/* Open Graph */}
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </head>
      <body>
        <SuperStylingProvider system={docsSystem}>
          <Slot />
        </SuperStylingProvider>
      </body>
    </html>
  );
}
