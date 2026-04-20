/* oxlint-disable react-perf/jsx-no-jsx-as-prop -- perf rules are noise in tests */
import { describe, expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ColorModeScript as AppColorModeScript } from "./app";
import { ColorModeScript as PagesColorModeScript } from "./pages";

describe("app/ColorModeScript", () => {
  test("renders as a <script> with inline JS", () => {
    const html = renderToStaticMarkup(<AppColorModeScript />);
    expect(html.startsWith("<script>")).toBe(true);
    expect(html).toContain("localStorage");
  });

  test("embeds custom storageKey", () => {
    const html = renderToStaticMarkup(<AppColorModeScript storageKey="my-app-mode" />);
    expect(html).toContain("my-app-mode");
  });

  test("embeds initialMode=dark", () => {
    const html = renderToStaticMarkup(<AppColorModeScript initialMode="dark" />);
    expect(html).toContain('"dark"');
  });
});

describe("pages/ColorModeScript", () => {
  test("renders as a <script> with inline JS", () => {
    const html = renderToStaticMarkup(<PagesColorModeScript />);
    expect(html.startsWith("<script>")).toBe(true);
    expect(html).toContain("localStorage");
  });

  test("same FOUC-prevention body as App Router helper (parity check)", () => {
    const appHtml = renderToStaticMarkup(<AppColorModeScript storageKey="k" initialMode="dark" />);
    const pagesHtml = renderToStaticMarkup(
      <PagesColorModeScript storageKey="k" initialMode="dark" />,
    );
    expect(appHtml).toBe(pagesHtml);
  });
});
