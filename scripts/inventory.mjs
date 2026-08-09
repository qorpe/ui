// Generates docs/inventory.md from the barrel — the roster can never be re-typed, and
// therefore can never drift (ui-standard §4). CI regenerates and fails on a diff.
import { readFileSync, writeFileSync } from "node:fs";

const barrel = readFileSync("src/index.ts", "utf8");
const map = JSON.parse(readFileSync("gallery/docs-map.json", "utf8"));
const home = new Map();
for (const demo of map.demos) {
  for (const name of demo.covers) home.set(name, demo);
}

const exported = [];
for (const statement of barrel.matchAll(/export\s*\{([^}]*)\}/gs)) {
  for (const raw of statement[1].split(",")) {
    const name = raw.replace(/\btype\b/, "").trim();
    if (name && /^[A-Z]/.test(name)) exported.push(name);
  }
}

const rows = [...new Set(exported)].sort().map((name) => {
  const demo = home.get(name);
  return `| \`${name}\` | ${demo ? demo.title : "—"} | ${demo ? demo.notes.split(".")[0] + "." : "—"} |`;
});

writeFileSync(
  "docs/inventory.md",
  `# The kit's inventory — generated, never typed\n\n` +
    `Generated from \`src/index.ts\` + \`gallery/docs-map.json\` by \`scripts/inventory.mjs\`.\n` +
    `Do not edit: CI regenerates it and fails on a diff (ui-standard §4).\n\n` +
    `| Export | Demo | What it is |\n|---|---|---|\n${rows.join("\n")}\n\n` +
    `${rows.length} component exports.\n`,
);
console.log(`inventory: ${rows.length} component exports written to docs/inventory.md`);
