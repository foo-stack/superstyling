import { Badge } from "@superstyling/core";

/**
 * Docs version switcher. Stub for v0.1 — only one version exists. When we
 * ship v0.2 this becomes a dropdown listing every semver-tagged docs build.
 */
const VERSIONS = ["v0.1.0"] as const;

export function VersionSwitcher() {
  const current = VERSIONS[0];
  return <Badge variant="outline">{current}</Badge>;
}
