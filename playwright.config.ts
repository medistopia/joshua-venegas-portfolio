import { defineConfig } from "@playwright/test";

const port = 3200;

/** Runs against a production build, per docs/implementation-plan.md (Verification for Milestone 1). */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${port}`,
    browserName: "chromium",
  },
  webServer: {
    command: `npm run build && npm run start -- --port ${port}`,
    url: `http://localhost:${port}`,
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
  },
});
