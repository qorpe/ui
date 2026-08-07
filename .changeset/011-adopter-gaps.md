---
"@qorpe/ui": patch
---

The first adopter-feedback release: `FacetFilter` gains `compact` (the smaller
trigger for dense toolbars) and trigger `className` passthrough; `SearchBox`
gains wrapper `className` passthrough — both straight from mockifyr's M1
migration (its method facet and toolbar layouts), fed back as issues instead
of forks. Layout concerns stay the caller's; behavior is untouched.
