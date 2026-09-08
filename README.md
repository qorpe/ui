# @qorpe/ui

The qorpe family UI kit: the [ui-standard](docs/ui-standard.md) tokens, primitives and
composites every qorpe console composes from — the Goldpath console, the Mockifyr
console, and every product console that follows.

Extracted from the Goldpath monorepo's `ui/kit` on 2026-08-06 per the accepted
extraction RFC (goldpath `docs/rfc/qorpe-ui.md`): the third kit-composed console fired
the written trigger ("two consumers copy; three justify a package"). History before
the extraction lives in the goldpath repo.

## Use

```bash
pnpm add @qorpe/ui
```

```ts
import { AppShell, KeysetTable, VerbButton } from "@qorpe/ui";
import "@qorpe/ui/tokens.css";
```

Tailwind CSS v4 is a hard peer: the token file maps the vocabulary into Tailwind's
namespace, and the `.control`/`.btn-quiet` component classes it defines are part of
the kit's API. Dark mode is class-driven (`.dark` on `<html>`).

## Rules of the house

- **The standard versions with the package** — a change to `docs/ui-standard.md` and
  the component enforcing it land in the same PR.
- **Changesets** drive version + changelog (`pnpm changeset`); a PR touching `src/`
  without one fails CI (gate G1).
- **Every dependency is exact-pinned** (gate G6); peer ranges only where peers demand.
- **Coverage floor**: statements 95 / branches 90 / functions 75 / lines 95 (gate G5).
- Strings are props with English defaults — the kit ships no i18n framework; RTL via
  logical properties is an acceptance criterion for every component.

## Working in this repository

The delivery cycle is `.claude/cycle.md` — the same nine steps every repository in the family
runs, with `.claude/skills/ui-change` saying what each one means here. The stop hook refuses
to end a turn on a red typecheck, an undocumented export or an unpinned dependency; the visual,
axe and coverage gates need a browser or a full run and stay in CI.

## Gates

CI also runs on `changeset-release/**`, not only on `main` and pull requests: the version
pull request is opened by the changesets bot with `GITHUB_TOKEN`, which GitHub deliberately
does not let trigger `pull_request` workflows, so those pull requests were merging with no
checks reported at all. G1 stays pull-request-only, correctly — the release branch consumes
the changesets and has none to carry.

Live in CI: **G1** changeset (src change without a changeset fails) · **G2**
export-without-docs (`scripts/docs-gate.mjs` parses the barrel; every export needs a
home in `gallery/docs-map.json`, whose demos the tests render) · **G3** axe on every
gallery demo · **G4** visual snapshots (light + dark + RTL, 63 baselines rendered in
the same Playwright container `scripts/update-visual.sh` uses) · **G5** coverage floor ·
**G6** exact-pin · **G7** standard-sync (a `docs/ui-standard.md` change must carry the
component that enforces it, and vice versa). The gallery (`pnpm gallery`) IS the docs:
same data, same demos the gates verify.

## License

Apache-2.0.
