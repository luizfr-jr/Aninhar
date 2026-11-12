import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: [
    {
      command: "node scripts/e2e-api.mjs",
      url: "http://127.0.0.1:4301/api/auth/session",
      reuseExistingServer: false,
    },
    {
      command: "npm run dev:ui -- --host 127.0.0.1 --port 4173 --strictPort",
      env: { API_TARGET: "http://127.0.0.1:4301" },
      url: "http://127.0.0.1:4173",
      reuseExistingServer: false,
    },
  ],
});
