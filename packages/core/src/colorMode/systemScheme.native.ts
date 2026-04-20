/**
 * Native system color-scheme watcher using React Native's `Appearance` API.
 * Metro resolves this file on iOS and Android.
 */
import { Appearance } from "react-native";
import type { ColorMode, SystemSchemeWatcher } from "./types";

export const systemSchemeWatcher: SystemSchemeWatcher = {
  getCurrent: () => {
    const scheme = Appearance.getColorScheme();
    return scheme === "dark" ? "dark" : "light";
  },
  subscribe: (listener) => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      listener(colorScheme === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  },
};

export type { ColorMode };
