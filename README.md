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

## Gates roadmap

G1 changeset, G5 coverage, G6 pin are live in CI. G2 (export-without-docs), G3 (axe
per gallery demo), G4 (visual snapshots incl. dark + RTL) land with the docs-gallery
slice — tracked in the repo issues.

## License

Apache-2.0.
