import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import docsMap from "./docs-map.json";
import { DEMO_RENDERERS } from "./demos";

/**
 * The other half of G2 (docs-map ↔ demos stay 1:1) and the whole of G3: every demo
 * renders and passes axe. color-contrast is disabled here — jsdom cannot compute it;
 * the ramp's measured ratios live in tokens.css comments and the consumer consoles'
 * real-browser axe gates keep it honest.
 */
describe("the living docs (G2/G3)", () => {
  it("every docs-map demo has a renderer, and nothing renders undocumented", () => {
    const mapped = docsMap.demos.map((entry) => entry.demo).sort();
    const rendered = Object.keys(DEMO_RENDERERS).sort();
    expect(rendered).toEqual(mapped);
  });

  for (const entry of docsMap.demos) {
    it(`axe: ${entry.demo}`, async () => {
      const Demo = DEMO_RENDERERS[entry.demo];
      const { container } = render(<Demo />);
      const result = await axe.run(container, {
        rules: { "color-contrast": { enabled: false } },
      });
      expect(
        result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      ).toEqual([]);
    });
  }
});
