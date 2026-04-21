/**
 * Sidebar + search-index source of truth. The tree is static — 3 top-level
 * sections mirroring the 24 MDX pages we're porting from Vocs.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    label: "Getting started",
    items: [
      { label: "Next.js", href: "/getting-started/next" },
      { label: "Expo", href: "/getting-started/expo" },
      { label: "Vite", href: "/getting-started/vite" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Box", href: "/components/box" },
      { label: "Stack", href: "/components/stack" },
      { label: "Divider", href: "/components/divider" },
      { label: "Text", href: "/components/text" },
      { label: "Heading", href: "/components/heading" },
      { label: "Spinner", href: "/components/spinner" },
      { label: "Badge", href: "/components/badge" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Alert", href: "/components/alert" },
      { label: "Button", href: "/components/button" },
      { label: "IconButton", href: "/components/icon-button" },
      { label: "Link", href: "/components/link" },
      { label: "Modal", href: "/components/modal" },
      { label: "FormControl", href: "/components/form-control" },
      { label: "Input", href: "/components/input" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Radio", href: "/components/radio" },
      { label: "Switch", href: "/components/switch" },
      { label: "Select", href: "/components/select" },
    ],
  },
  {
    label: "Examples",
    items: [
      { label: "Login", href: "/examples/login" },
      { label: "Settings", href: "/examples/settings" },
      { label: "Form validation", href: "/examples/form-validation" },
      { label: "Theming", href: "/examples/theming" },
      { label: "Color mode", href: "/examples/color-mode" },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV.flatMap((section) => section.items);
