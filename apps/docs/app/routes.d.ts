// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: 
        | `/`
        | `/_landing/icons`
        | `/_sitemap`
        | `/components/checkbox`
        | `/components/modal`
        | `/components/radio`
        | `/components/select`
        | `/components/switch`
        | `/examples/color-mode`
        | `/examples/form-validation`
        | `/examples/login`
        | `/examples/settings`
      DynamicRoutes: 
        | `/components/${OneRouter.SingleRoutePart<T>}`
        | `/examples/${OneRouter.SingleRoutePart<T>}`
        | `/getting-started/${OneRouter.SingleRoutePart<T>}`
        | `/hooks/${OneRouter.SingleRoutePart<T>}`
        | `/migration/${OneRouter.SingleRoutePart<T>}`
        | `/theming/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate: 
        | `/components/[slug]`
        | `/examples/[slug]`
        | `/getting-started/[slug]`
        | `/hooks/[slug]`
        | `/migration/[slug]`
        | `/theming/[slug]`
      IsTyped: true
      RouteTypes: {
        '/components/[slug]': RouteInfo<{ slug: string }>
        '/examples/[slug]': RouteInfo<{ slug: string }>
        '/getting-started/[slug]': RouteInfo<{ slug: string }>
        '/hooks/[slug]': RouteInfo<{ slug: string }>
        '/migration/[slug]': RouteInfo<{ slug: string }>
        '/theming/[slug]': RouteInfo<{ slug: string }>
      }
    }
  }
}

/**
 * Helper type for route information
 */
type RouteInfo<Params = Record<string, never>> = {
  Params: Params
  LoaderProps: { path: string; search?: string; subdomain?: string; params: Params; request?: Request }
}