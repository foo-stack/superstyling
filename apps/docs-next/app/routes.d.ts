// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: 
        | `/`
        | `/_sitemap`
      DynamicRoutes: 
        | `/components/${OneRouter.SingleRoutePart<T>}`
        | `/examples/${OneRouter.SingleRoutePart<T>}`
        | `/getting-started/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate: 
        | `/components/[slug]`
        | `/examples/[slug]`
        | `/getting-started/[slug]`
      IsTyped: true
      RouteTypes: {
        '/components/[slug]': RouteInfo<{ slug: string }>
        '/examples/[slug]': RouteInfo<{ slug: string }>
        '/getting-started/[slug]': RouteInfo<{ slug: string }>
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