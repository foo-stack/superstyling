import { createSystem } from "@superstyling/core";

export const system = createSystem({});

export default system.config;

// Dogfood finding #1 (Phase 8): our Getting Started guides recommend
// `declare module "tamagui" { interface TamaguiCustomConfig extends
// typeof system.config {} }` here. Doing so tightens Tamagui v2's generic
// types and surfaces several latent strict-type errors across
// `@superstyling/core` (Alert, Badge, Avatar, Heading). Left un-augmented on
// purpose so this app builds — see README "Rough edges" for the list.
