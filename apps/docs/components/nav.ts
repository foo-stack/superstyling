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
    label: "Layout",
    items: [
      { label: "Box", href: "/components/box" },
      { label: "Stack", href: "/components/stack" },
      { label: "Flex", href: "/components/flex" },
      { label: "Center", href: "/components/center" },
      { label: "Container", href: "/components/container" },
      { label: "Spacer", href: "/components/spacer" },
      { label: "AspectRatio", href: "/components/aspect-ratio" },
      { label: "Grid · GridItem", href: "/components/grid" },
      { label: "SimpleGrid", href: "/components/simple-grid" },
      { label: "Wrap · WrapItem", href: "/components/wrap" },
      { label: "Divider", href: "/components/divider" },
    ],
  },
  {
    label: "Typography",
    items: [
      { label: "Text", href: "/components/text" },
      { label: "Heading", href: "/components/heading" },
      { label: "Code", href: "/components/code" },
      { label: "Kbd", href: "/components/kbd" },
    ],
  },
  {
    label: "Data display",
    items: [
      { label: "Badge", href: "/components/badge" },
      { label: "Tag", href: "/components/tag" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Image", href: "/components/image" },
      { label: "List", href: "/components/list" },
      { label: "Spinner", href: "/components/spinner" },
    ],
  },
  {
    label: "Feedback",
    items: [{ label: "Alert", href: "/components/alert" }],
  },
  {
    label: "Overlay",
    items: [
      { label: "Modal", href: "/components/modal" },
      { label: "Drawer", href: "/components/drawer" },
      { label: "AlertDialog", href: "/components/alert-dialog" },
      { label: "Popover", href: "/components/popover" },
      { label: "Tooltip", href: "/components/tooltip" },
      { label: "Menu", href: "/components/menu" },
      { label: "Toast", href: "/components/toast" },
    ],
  },
  {
    label: "Interactive",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "ButtonGroup", href: "/components/button-group" },
      { label: "IconButton", href: "/components/icon-button" },
      { label: "CloseButton", href: "/components/close-button" },
      { label: "Link", href: "/components/link" },
    ],
  },
  {
    label: "Forms",
    items: [
      { label: "FormControl", href: "/components/form-control" },
      { label: "Input", href: "/components/input" },
      { label: "InputGroup", href: "/components/input-group" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "CheckboxGroup", href: "/components/checkbox-group" },
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
