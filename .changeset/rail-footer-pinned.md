---
"@qorpe/ui": patch
---

AppShell: only the nav LIST scrolls; the rail footer is pinned.

The whole rail was one scroller, so a console whose nav outgrew the viewport pushed its
footer below the fold. The footer is where the tenant/service switcher lives — the control
that scopes everything else on screen — and "scroll the sidebar to change tenant" is not a
thing anybody should have to discover.

Found adopting the shell in a console with twelve nav items across four groups: at a 720px
viewport the rail measured 832px and the switcher started at y=707.
