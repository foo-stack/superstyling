import { defineConfig, type Config } from "vocs";

const config: Config = {
  rootDir: ".",
  title: "Superstyling",
  titleTemplate: "%s – Superstyling",
  description:
    "A Chakra-UI-shaped React component library built on Tamagui. One API, three platforms.",
  sidebar: [
    {
      text: "Getting Started",
      items: [
        { text: "Introduction", link: "/" },
        { text: "Next.js", link: "/getting-started/next" },
        { text: "Expo", link: "/getting-started/expo" },
        { text: "Vite", link: "/getting-started/vite" },
      ],
    },
    {
      text: "Layout",
      items: [
        { text: "Box", link: "/components/box" },
        { text: "Stack · HStack · VStack", link: "/components/stack" },
        { text: "Divider", link: "/components/divider" },
      ],
    },
    {
      text: "Typography",
      items: [
        { text: "Text", link: "/components/text" },
        { text: "Heading", link: "/components/heading" },
      ],
    },
    {
      text: "Feedback",
      items: [
        { text: "Spinner", link: "/components/spinner" },
        { text: "Badge", link: "/components/badge" },
        { text: "Alert", link: "/components/alert" },
      ],
    },
    {
      text: "Media",
      items: [{ text: "Avatar", link: "/components/avatar" }],
    },
    {
      text: "Interactive",
      items: [
        { text: "Button", link: "/components/button" },
        { text: "IconButton", link: "/components/icon-button" },
        { text: "Link", link: "/components/link" },
      ],
    },
    {
      text: "Overlay",
      items: [{ text: "Modal", link: "/components/modal" }],
    },
    {
      text: "Forms",
      items: [
        { text: "FormControl", link: "/components/form-control" },
        { text: "Input · Textarea", link: "/components/input" },
        { text: "Checkbox", link: "/components/checkbox" },
        { text: "Radio · RadioGroup", link: "/components/radio" },
        { text: "Switch", link: "/components/switch" },
        { text: "Select", link: "/components/select" },
      ],
    },
    {
      text: "Examples",
      collapsed: true,
      items: [
        { text: "Login form", link: "/examples/login" },
        { text: "Settings screen", link: "/examples/settings" },
        { text: "Form validation", link: "/examples/form-validation" },
        { text: "Theming walkthrough", link: "/examples/theming" },
        { text: "Color mode", link: "/examples/color-mode" },
      ],
    },
  ],
  socials: [
    {
      icon: "github",
      link: "https://github.com/natestack/superstyling",
    },
  ],
  editLink: {
    pattern: "https://github.com/natestack/superstyling/edit/main/apps/docs/pages/:path",
    text: "Edit on GitHub",
  },
  theme: {
    accentColor: "#3182CE",
  },
  vite: {
    resolve: {
      alias: {
        // Our components use `import { Platform } from "react-native"` for
        // Platform.OS branches in cross-platform-aware code (Heading,
        // FormControl). The raw react-native package is Flow-typed and can't
        // be parsed by Vocs/Vite's bundler; alias to react-native-web.
        "react-native": "react-native-web",
      },
    },
  },
};

// Vocs's `defineConfig` returns a promise with a non-portable inferred type;
// asserting `Promise<unknown>` dodges the TS2742 "inferred type not portable"
// error while letting Vocs itself resolve the value at runtime.
export default defineConfig(config) as Promise<unknown>;
