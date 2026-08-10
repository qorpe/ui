---
"@qorpe/ui": patch
---

AppShell: the rail's visible search label honours `labels.search`.

`labels.search` reached the collapsed button's tooltip and `aria-label`, while the
expanded rail printed a hardcoded `Search`. So the one word an operator actually reads
was the one word that could not be translated — in a kit whose stated rule is that
strings are props with English defaults.

A six-locale console would have shown "Search" in English on every one of them.
