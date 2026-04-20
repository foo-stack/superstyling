// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from "one";

declare module "one" {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes:
        | `/`
        | `/_sitemap`
        | `/components`
        | `/components/alert`
        | `/components/avatar`
        | `/components/badge`
        | `/components/box`
        | `/components/button`
        | `/components/checkbox`
        | `/components/divider`
        | `/components/form-control`
        | `/components/heading`
        | `/components/icon-button`
        | `/components/input`
        | `/components/link`
        | `/components/modal`
        | `/components/radio`
        | `/components/select`
        | `/components/spinner`
        | `/components/stack`
        | `/components/switch`
        | `/components/text`
        | `/examples/color-mode`
        | `/examples/form-validation`
        | `/examples/login`
        | `/examples/settings`
        | `/examples/theming`
        | `/getting-started/expo`
        | `/getting-started/next`
        | `/getting-started/vite`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
      IsTyped: true;
    }
  }
}
