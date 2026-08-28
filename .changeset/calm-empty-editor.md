---
"@qorpe/ui": patch
---

fix(json-editor): an empty document is never a lint error

The JSON linter flagged an empty editor as a parse error — a red dot on line 1 of
nothing. A blank editor is an invitation, not a mistake; the linter now answers no
diagnostics for a zero-length document and stays exactly as strict the moment content
appears. Consumers no longer need to toggle `lint` off for the empty state — which
also recreated the editor mid-typing, since `lint` participates in the setup effect.
