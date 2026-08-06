import { expect, test } from "@playwright/test";
import docsMap from "../gallery/docs-map.json" with { type: "json" };

/**
 * G4: every docs-map demo, photographed in light, dark and RTL — the same source
 * G2 gates and G3 axe-checks. A drifted pixel fails CI; a NEW demo fails until its
 * baselines are committed (regenerate: scripts/update-visual.sh).
 */
const MODES = ["light", "dark", "rtl"] as const;

for (const mode of MODES) {
  test.describe(mode, () => {
    test.use({ reducedMotion: "reduce" });

    for (const entry of docsMap.demos) {
      test(`${entry.demo} — ${mode}`, async ({ page }) => {
        await page.goto("/");
        if (mode === "dark") await page.getByRole("button", { name: "dark" }).click();
        if (mode === "rtl") await page.getByRole("button", { name: "rtl" }).click();
        const section = page.locator(`#${entry.demo}`);
        await section.scrollIntoViewIfNeeded();
        await expect(section).toHaveScreenshot(`${entry.demo}-${mode}.png`, {
          maxDiffPixels: 40,
          animations: "disabled",
        });
      });
    }
  });
}
