---
name: ui-change
description: Run a change to the @qorpe/ui kit through the delivery cycle — a component, a token, a fix, a standard revision. Use when working in the qorpe/ui repository on anything that will end in a pull request.
---

# ui-change — the sequence, for a package every console depends on

A change here reaches every console in the family at once: goldpath's, mockifyr's, the API
portal's. That is the whole point of the kit and it is also the reason a mistake here is
expensive — the consumers find it, not you.

The sequence is `.claude/cycle.md`, the same nine steps every repository in the family runs.
This skill names what each step MEANS here and carries no rules of its own; the rules are the
README's house rules and `docs/ui-standard.md`.

## Read first

1. `.claude/cycle.md` — the nine steps
2. `README.md` — the house rules and the seven gates, G1 to G7
3. `docs/ui-standard.md` — the standard the components enforce. **It versions with the
   package**: a change to the standard and the component enforcing it land in the same pull
   request (G7), in both directions.

## What each step means here

**3 — what must not break.** The exported surface. Every consumer binds to it, and the kit is
consumed through a version range nobody wants to fight. A rename is a breaking change even
when the behaviour is identical.

**4 — prove the test.** Break the component deliberately and watch the new test go red. A
visual snapshot that passes with the component removed is not a test, it is a screenshot.

**5 — the layer that can fail.** Logic in vitest; rendered structure in the gallery demos the
gates already render; anything about LAYOUT, dark mode or RTL in the Playwright visual
baselines, because jsdom has no layout and will happily pass a component that is unreadable.
Accessibility is axe over the gallery (G3), not an opinion.

**6 — this repository's contract check.** Not an engine: the barrel and the docs map. Every
export needs a home in `gallery/docs-map.json` (G2), every dependency is exact-pinned (G6),
and a `src/` change without a changeset fails (G1). The gallery IS the documentation — same
data, same demos the gates verify — so an undocumented export is a broken contract, not a
missing nicety.

**7 — run it for real.** `pnpm gallery` and look at the component: light, dark, and RTL. Then
measure rather than squint — computed styles, the element's box, focus order under the
keyboard. A component that "looks right" in one theme is a component tested in one theme.

**8 — the as-is.** Does an existing visual baseline encode the old appearance? Update it
deliberately with `scripts/update-visual.sh` and say why in the pull request; never regenerate
baselines to make a build green. Does the standard document still describe what the component
does?

**9 — land.** The changeset is not paperwork: it is how a consumer learns what changed and
whether they must act. Write it for the reader who will bump the version, not for the log.

## The hook

`.claude/hooks/stop-gate.sh` refuses to end a turn on a red typecheck, an undocumented export
or an unpinned dependency. It runs those three because they take seconds; the visual, axe and
coverage gates need a browser or a full run and stay in CI.
