import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { superstylingVitePlugin } from "@superstyling/vite";

export default defineConfig({
  plugins: [
    react(),
    ...superstylingVitePlugin({
      config: "./tamagui.config.ts",
      components: ["tamagui", "@superstyling/core"],
    }),
  ],
});
