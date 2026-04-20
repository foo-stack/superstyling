/**
 * Shared docs navigation tree. Rendered by `DocsLayout` sidebar and used
 * by the page shell to highlight the current entry.
 *
 * Each entry's `href` is the route the page lives at.
 */
export interface DocsNavLink {
  title: string;
  href: string;
}
export interface DocsNavSection {
  title: string;
  items: DocsNavLink[];
}

export const DOCS_NAV: DocsNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/" },
      { title: "Installation — Next.js", href: "/getting-started/next" },
      { title: "Installation — Expo", href: "/getting-started/expo" },
      { title: "Installation — Vite", href: "/getting-started/vite" },
    ],
  },
  {
    title: "Layout",
    items: [
      { title: "Box", href: "/components/box" },
      { title: "Stack · HStack · VStack", href: "/components/stack" },
      { title: "Divider", href: "/components/divider" },
    ],
  },
  {
    title: "Typography",
    items: [
      { title: "Text", href: "/components/text" },
      { title: "Heading", href: "/components/heading" },
    ],
  },
  {
    title: "Feedback",
    items: [
      { title: "Spinner", href: "/components/spinner" },
      { title: "Badge", href: "/components/badge" },
      { title: "Alert", href: "/components/alert" },
    ],
  },
  {
    title: "Media",
    items: [{ title: "Avatar", href: "/components/avatar" }],
  },
  {
    title: "Interactive",
    items: [
      { title: "Button", href: "/components/button" },
      { title: "IconButton", href: "/components/icon-button" },
      { title: "Link", href: "/components/link" },
    ],
  },
  {
    title: "Overlay",
    items: [{ title: "Modal", href: "/components/modal" }],
  },
  {
    title: "Forms",
    items: [
      { title: "FormControl", href: "/components/form-control" },
      { title: "Input · Textarea", href: "/components/input" },
      { title: "Checkbox", href: "/components/checkbox" },
      { title: "Radio · RadioGroup", href: "/components/radio" },
      { title: "Switch", href: "/components/switch" },
      { title: "Select", href: "/components/select" },
    ],
  },
  {
    title: "Examples",
    items: [
      { title: "Showcase (all components)", href: "/components" },
      { title: "Login form", href: "/examples/login" },
      { title: "Settings screen", href: "/examples/settings" },
      { title: "Form validation", href: "/examples/form-validation" },
      { title: "Theming walkthrough", href: "/examples/theming" },
      { title: "Color mode", href: "/examples/color-mode" },
    ],
  },
];
