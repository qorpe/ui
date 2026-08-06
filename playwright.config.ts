import { defineConfig } from "@playwright/test";

/**
 * G4 — the visual gate. Baselines are LINUX-rendered only (system font stacks make
 * mac pixels differ): CI runs them natively; locally regenerate through the
 * Playwright container with `scripts/update-visual.sh`. Reduced motion is forced so
 * the tokens' kill-switch freezes every animation before the camera fires.
 */
export default defineConfig({
  testDir: "visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  use: {
    viewport: { width: 1000, height: 800 },
    contrast: "no-preference",
  },
  webServer: {
    command: "pnpm gallery --port 5301 --strictPort",
    port: 5301,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
