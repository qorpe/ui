// The living docs page: composed from gallery/docs-map.json + gallery/demos.tsx —
// the SAME source gallery.test.tsx verifies (G2 1:1, G3 axe). Theme and direction
// toggles exercise class-driven dark mode and the logical-properties rule live.
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "../src/tokens/tokens.css";
import docsMap from "./docs-map.json";
import { DEMO_RENDERERS } from "./demos";

function DocsPage() {
  const [dark, setDark] = useState(false);
  const [rtl, setRtl] = useState(false);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.dir = rtl ? "rtl" : "ltr";

  return (
    // The shell owns scrolling in real consoles (body overflow is hidden by the
    // tokens); the docs page IS its own shell, so it owns its scroll surface.
    <div className="scroll-area h-screen overflow-y-auto bg-app p-8 text-foreground">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">@qorpe/ui — the living docs</h1>
            <p className="text-sm text-muted-foreground">
              Every export, one home ({docsMap.demos.length} demos) — gate G2 fails the build on a missing entry.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-quiet" onClick={() => setDark((value) => !value)}>
              {dark ? "light" : "dark"}
            </button>
            <button className="btn-quiet" onClick={() => setRtl((value) => !value)}>
              {rtl ? "ltr" : "rtl"}
            </button>
          </div>
        </header>

        {docsMap.demos.map((entry) => {
          const Demo = DEMO_RENDERERS[entry.demo];
          return (
            <section key={entry.demo} id={entry.demo} className="card space-y-3">
              <div>
                <h2 className="text-base font-semibold">{entry.title}</h2>
                <p className="text-sm text-muted-foreground">{entry.notes}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {entry.covers.map((name) => (
                  <code key={name} className="chip">{name}</code>
                ))}
              </div>
              <div className="pt-1">
                <Demo />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DocsPage />
  </StrictMode>,
);
