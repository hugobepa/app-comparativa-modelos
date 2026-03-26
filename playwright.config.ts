import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:4173/app-comparativa-modelos/",
    trace: "on-first-retry",
  },
  webServer: {
    command: "node tests/static-server.mjs",
    url: "http://127.0.0.1:4173/app-comparativa-modelos/",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: "mobile",
      use: devices["Pixel 5"],
    },
    {
      name: "desktop",
      use: devices["Desktop Chrome"],
    },
  ],
});
