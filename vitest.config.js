import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["test/javascript/**/*.spec.js"],
    environment: "jsdom",
    globals: false,
  },
})
