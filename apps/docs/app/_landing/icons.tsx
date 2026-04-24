import { createIcon } from "@superstyling/icons";

/**
 * Landing-page-only icons. Not part of the published `@superstyling/icons`
 * set — they exist purely to decorate feature cards on the homepage.
 * Add to the published set if a real component needs one.
 */

export { ArrowRightIcon, CheckCircleIcon } from "@superstyling/icons";

export const CodeIcon = createIcon({
  displayName: "CodeIcon",
  paths: ["M16 18l6-6-6-6", "M8 6l-6 6 6 6"],
});

export const PaletteIcon = createIcon({
  displayName: "PaletteIcon",
  paths: [
    "M12 22a10 10 0 0 1 0-20c5.5 0 10 4 10 9 0 3-2.5 4-5 4h-2a2 2 0 0 0-2 2c0 .5.2 1 .5 1.5.3.5.5 1 .5 1.5 0 1-1 2-2 2Z",
    "M7.5 11h.01",
    "M11.5 7h.01",
    "M16.5 7h.01",
    "M16.5 11h.01",
  ],
});

export const PhoneIcon = createIcon({
  displayName: "PhoneIcon",
  paths: ["M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4Z", "M11 18h2"],
});

export const SparklesIcon = createIcon({
  displayName: "SparklesIcon",
  paths: [
    "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z",
    "M19 14l.7 2.1L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.9L19 14Z",
    "M5 14l.6 1.7L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.7L5 14Z",
  ],
});

export const ZapIcon = createIcon({
  displayName: "ZapIcon",
  paths: ["M13 2L4 14h7l-1 8 9-12h-7l1-8Z"],
});
