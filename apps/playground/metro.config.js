// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch all workspace packages so changes hot-reload here.
config.watchFolders = [workspaceRoot];

// Ensure Metro resolves dependencies from both the app's own node_modules and
// the hoisted workspace root node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Force resolution of transitive deps from the root (avoids duplicate React
// instances when workspace packages import React).
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
