/**
 * Jest config for native (React Native) component tests.
 * Files matching `*.native.test.{ts,tsx}` run via the jest-expo preset,
 * which configures the React Native test environment, transformers,
 * and module mocks.
 *
 * Web tests run on Vitest (see vitest.config.ts).
 * Playwright component tests are separate.
 */
module.exports = {
  preset: "jest-expo",
  testMatch: [
    "<rootDir>/packages/*/src/**/*.native.test.ts",
    "<rootDir>/packages/*/src/**/*.native.test.tsx",
  ],
  passWithNoTests: true,
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-clone-referenced-element|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@tamagui/.*|tamagui|moti|@legendapp/.*))",
  ],
};
