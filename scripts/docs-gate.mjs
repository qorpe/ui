// G2 — the export-without-docs gate: every name src/index.ts exports must appear in
// exactly one docs-map demo's covers[], and every covered name must still be exported.
// The export list is PARSED from the barrel, never hand-kept; the docs side lives in
// gallery/docs-map.json, whose demos gallery.test.tsx renders and axe-checks (G3).
import { readFileSync } from "node:fs";

const barrel = readFileSync("src/index.ts", "utf8");
const exported = new Set();
for (const statement of barrel.matchAll(/export\s*\{([^}]*)\}/gs)) {
  for (const raw of statement[1].split(",")) {
    const name = raw.replace(/\btype\b/, "").trim();
    if (name) exported.add(name);
  }
}

const map = JSON.parse(readFileSync("gallery/docs-map.json", "utf8"));
const covered = new Map();
for (const entry of map.demos) {
  for (const name of entry.covers) {
    if (covered.has(name)) {
      console.error(`docs-gate: "${name}" is covered by two demos (${covered.get(name)}, ${entry.demo}) — one home per export.`);
      process.exit(1);
    }
    covered.set(name, entry.demo);
  }
}

const missing = [...exported].filter((name) => !covered.has(name));
const stale = [...covered.keys()].filter((name) => !exported.has(name));

if (missing.length > 0) {
  console.error(`docs-gate: exported without docs (add to a gallery/docs-map.json demo):\n  ${missing.join("\n  ")}`);
}
if (stale.length > 0) {
  console.error(`docs-gate: documented but no longer exported (remove from docs-map):\n  ${stale.join("\n  ")}`);
}
if (missing.length > 0 || stale.length > 0) process.exit(1);
console.log(`docs-gate: ${exported.size} exports, all documented across ${map.demos.length} demos.`);
