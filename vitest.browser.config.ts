import path from "node:path"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/components/workspace/getting-started.test.tsx"],
    browser: {
      enabled: true,
      headless: false,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      viewport: { width: 960, height: 800 },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
