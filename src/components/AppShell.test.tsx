import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppShell, COLLAPSE_KEY, initialCollapsed, type ShellNavItem } from "./AppShell";

const nav = (over: Partial<ShellNavItem> = {}): ShellNavItem => ({
  id: "runs",
  label: "Runs",
  onSelect: vi.fn(),
  ...over,
});

describe("the app shell (ui-standard-v1 §3 — the surface scrolls, never the page)", () => {
  it("renders only the nav it is GIVEN — a missing capability is an absent item", () => {
    render(
      <AppShell title="CorPay" nav={[nav(), nav({ id: "bulk", label: "Bulk intake" })]} activeId="runs">
        <p>content</p>
      </AppShell>,
    );

    expect(screen.getByRole("button", { name: "Runs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bulk intake" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /campaign/i })).toBeNull();   // not given, not shown
  });

  it("marks the active section for assistive tech, not just visually", () => {
    render(
      <AppShell title="CorPay" nav={[nav(), nav({ id: "bulk", label: "Bulk intake" })]} activeId="bulk">
        <p>content</p>
      </AppShell>,
    );

    expect(screen.getByRole("button", { name: "Bulk intake" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Runs" })).not.toHaveAttribute("aria-current");
  });

  it("the CONTENT surface is the scroller — the shell frame never scrolls", () => {
    render(<AppShell title="CorPay" nav={[nav()]} activeId="runs"><p>content</p></AppShell>);

    expect(screen.getByTestId("app-shell").className).toContain("overflow-hidden");
    expect(screen.getByTestId("shell-surface").className).toContain("overflow-y-auto");
    expect(screen.getByTestId("shell-surface").className).toContain("scroll-area");
  });

  it("selecting a section calls its handler; the shell owns no routing", async () => {
    const onSelect = vi.fn();
    render(
      <AppShell title="CorPay" nav={[nav(), nav({ id: "bulk", label: "Bulk intake", onSelect })]} activeId="runs">
        <p>content</p>
      </AppShell>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Bulk intake" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("collapsing keeps every section reachable — labels survive as accessible names", async () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <AppShell title="CorPay" nav={[nav()]} activeId="runs" onToggleCollapsed={onToggle}>
        <p>content</p>
      </AppShell>,
    );

    await userEvent.click(screen.getByRole("button", { name: /collapse navigation/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(
      <AppShell title="CorPay" nav={[nav()]} activeId="runs" collapsed onToggleCollapsed={onToggle}>
        <p>content</p>
      </AppShell>,
    );
    expect(screen.getByRole("button", { name: "Runs" })).toBeInTheDocument();   // still reachable
    expect(screen.getByRole("button", { name: /expand navigation/i })).toHaveAttribute("aria-expanded", "false");
  });

  it("the service switcher appears only with a registry, and switching calls its entry", async () => {
    const onSelect = vi.fn();
    const { rerender } = render(<AppShell title="CorPay" nav={[nav()]} activeId="runs"><p>c</p></AppShell>);
    expect(screen.queryByRole("combobox", { name: "service" })).toBeNull();   // single-service console: no switcher

    rerender(
      <AppShell
        title="CorPay"
        nav={[nav()]}
        activeId="runs"
        services={[{ name: "api", onSelect: vi.fn() }, { name: "payments", onSelect }]}
        activeService="api"
      >
        <p>c</p>
      </AppShell>,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "service" }));
    await userEvent.click(await screen.findByRole("option", { name: "payments" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("the RAIL scrolls on its own once many capabilities are composed", () => {
    const many = Array.from({ length: 24 }, (_, i) => nav({ id: `cap-${i}`, label: `Capability ${i}` }));
    render(<AppShell title="CorPay" nav={many} activeId="cap-0"><p>c</p></AppShell>);

    // The frame stays put, but the rail must not clip what it was given. The scroller is the
    // nav LIST rather than the whole rail, so that a footer pinned beneath it survives a nav
    // this long — same guarantee, one element in.
    expect(screen.getByTestId("app-shell").className).toContain("overflow-hidden");
    expect(screen.getByTestId("shell-nav-scroll").className).toContain("overflow-y-auto");
    expect(screen.getByRole("button", { name: "Capability 23" })).toBeInTheDocument();
  });

  it("the footer learns the collapsed state so it can shrink with the rail", () => {
    const footer = (collapsed: boolean) => <span>{collapsed ? "T" : "theme"}</span>;
    const { rerender } = render(
      <AppShell title="CorPay" nav={[nav()]} activeId="runs" footer={footer}><p>c</p></AppShell>,
    );
    expect(screen.getByText("theme")).toBeInTheDocument();

    rerender(<AppShell title="CorPay" nav={[nav()]} activeId="runs" collapsed footer={footer}><p>c</p></AppShell>);
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("a badge shows a live count and stays silent at zero", () => {
    const { rerender } = render(
      <AppShell title="CorPay" nav={[nav({ badge: 3 })]} activeId="runs"><p>c</p></AppShell>,
    );
    expect(screen.getByText("3")).toBeInTheDocument();

    rerender(<AppShell title="CorPay" nav={[nav({ badge: 0 })]} activeId="runs"><p>c</p></AppShell>);
    expect(screen.queryByText("0")).toBeNull();
  });

  it("the service picker defaults to the first service and switches to the one chosen", async () => {
    const chosen: string[] = [];
    render(
      <AppShell
        title="Goldpath console"
        nav={[]}
        activeId=""
        services={[
          { name: "payments", onSelect: () => chosen.push("payments") },
          { name: "claims", onSelect: () => chosen.push("claims") },
        ]}
      >
        <p>body</p>
      </AppShell>,
    );

    // No activeService given: the picker shows the first, rather than an empty box.
    const picker = screen.getByRole("combobox", { name: "service" });
    expect(picker).toHaveTextContent("payments");

    await userEvent.click(picker);
    await userEvent.click(await screen.findByRole("option", { name: "claims" }));
    expect(chosen).toEqual(["claims"]);
  });
});

describe("the v1.1 rail (u7-b1)", () => {
  const item = (id: string, group?: string) => ({ id, label: id, group, icon: <svg data-icon={id} />, onSelect: () => {} });

  it("groups render in the order GIVEN, with their headings", () => {
    render(<AppShell title="t" nav={[item("a", "Execution"), item("b", "Intake"), item("c", "Execution")]} activeId="a">x</AppShell>);
    const rail = screen.getByTestId("shell-rail");
    const text = rail.textContent!;
    // One heading per group, and Execution precedes Intake because the caller said so.
    expect(text.indexOf("Execution")).toBeGreaterThan(-1);
    expect(text.indexOf("Execution")).toBeLessThan(text.indexOf("Intake"));
    expect(within(rail).getAllByText(/^Execution$/)).toHaveLength(1);
  });

  it("collapsed keeps the ICON as the item, and a REAL tooltip says its name (§8.5)", async () => {
    render(<AppShell title="t" nav={[item("runs", "Execution")]} activeId="runs" collapsed>x</AppShell>);
    const button = screen.getByRole("button", { name: "runs" });   // sr-only label keeps the name
    expect(button.querySelector("[data-icon=runs]")).not.toBeNull();
    // Focus opens the REAL tooltip — asserted on the tooltip role itself, because the
    // sr-only label always contains the name and would satisfy a bare text query.
    await userEvent.tab();
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("runs");
    expect(button).not.toHaveAttribute("title");   // the browser-delay tooltip retired
  });

  it("persists the rail state, and initialCollapsed reads it back", () => {
    localStorage.removeItem(COLLAPSE_KEY);
    expect(initialCollapsed()).toBe(false);
    render(<AppShell title="t" nav={[item("a")]} activeId="a" collapsed>x</AppShell>);
    expect(localStorage.getItem(COLLAPSE_KEY)).toBe("1");
    expect(initialCollapsed()).toBe(true);
  });

  it("the search trigger shows the field + ⌘K hint expanded, and calls onSearch", async () => {
    const onSearch = vi.fn();
    render(<AppShell title="t" nav={[item("a")]} activeId="a" onSearch={onSearch}>x</AppShell>);
    const trigger = screen.getByRole("button", { name: /Search/ });
    expect(trigger.textContent).toContain("⌘K");
    await userEvent.click(trigger);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("collapsed, the search trigger is an icon — the hint goes, the reach stays", async () => {
    const onSearch = vi.fn();
    render(<AppShell title="t" nav={[item("a")]} activeId="a" collapsed onSearch={onSearch}>x</AppShell>);
    const trigger = screen.getByRole("button", { name: "Search" });
    expect(trigger.textContent).not.toContain("⌘K");
    await userEvent.click(trigger);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("no onSearch, no trigger — a console without a palette shows no dead field", () => {
    render(<AppShell title="t" nav={[item("a")]} activeId="a">x</AppShell>);
    expect(screen.queryByRole("button", { name: /Search/ })).not.toBeInTheDocument();
  });

  it("the brand head is a BUTTON that goes home when the shell is told where home is", async () => {
    const onHome = vi.fn();
    render(<AppShell title="Goldpath Console" nav={[item("a")]} activeId="a" onHome={onHome}>x</AppShell>);
    await userEvent.click(screen.getByRole("button", { name: /Goldpath Console/ }));
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it("without onHome the brand stays plain text — nothing pretends to be clickable", () => {
    render(<AppShell title="Goldpath Console" nav={[item("a")]} activeId="a">x</AppShell>);
    expect(screen.queryByRole("button", { name: /Goldpath Console/ })).not.toBeInTheDocument();
  });

  it("the brand mark rides beside the words, and survives the collapse when they do not", () => {
    const mark = <svg data-testid="mark" />;
    const { rerender } = render(
      <AppShell brand={mark} title="Mockifyr" subtitle="Mock Platform" nav={[item("a")]} activeId="a">x</AppShell>,
    );
    expect(screen.getByTestId("mark")).toBeInTheDocument();
    expect(screen.getByText("Mockifyr")).toBeInTheDocument();

    // Collapsed the words go and the mark stays: a rail with neither is an anonymous gutter.
    rerender(<AppShell brand={mark} title="Mockifyr" nav={[item("a")]} activeId="a" collapsed>x</AppShell>);
    expect(screen.getByTestId("mark")).toBeInTheDocument();
    expect(screen.queryByText("Mockifyr")).not.toBeInTheDocument();
  });

  it("a brand mark inside the home button goes home with it", async () => {
    const onHome = vi.fn();
    render(
      <AppShell brand={<svg data-testid="mark" />} title="Mockifyr" nav={[item("a")]} activeId="a" onHome={onHome}>x</AppShell>,
    );
    await userEvent.click(screen.getByTestId("mark"));
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it("a count badge is NEUTRAL unless the console says it is alarming", () => {
    render(
      <AppShell
        title="t"
        activeId="a"
        nav={[
          { id: "a", label: "Stubs", badge: 12, onSelect: () => {} },
          { id: "b", label: "Failures", badge: 3, badgeTone: "danger", onSelect: () => {} },
        ]}
      >x</AppShell>,
    );

    // Red is a claim that something is wrong. A stub count is not.
    expect(screen.getByText("12").className).toContain("text-muted-foreground");
    expect(screen.getByText("3").className).toContain("text-danger");
  });

  it("a string badge prints verbatim — the console owns its own abbreviation", () => {
    render(
      <AppShell title="t" activeId="a" nav={[{ id: "a", label: "Journal", badge: "1.2k", onSelect: () => {} }]}>x</AppShell>,
    );
    expect(screen.getByText("1.2k")).toBeInTheDocument();
  });

  it("nothing to count shows nothing — zero and an empty string are both silence", () => {
    render(
      <AppShell
        title="t"
        activeId="a"
        nav={[
          { id: "a", label: "Zero", badge: 0, onSelect: () => {} },
          { id: "b", label: "Empty", badge: "", onSelect: () => {} },
        ]}
      >x</AppShell>,
    );
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    // A pill with no number in it is worse than no pill: it reads as a rendering fault.
    expect(screen.queryAllByTestId("nav-badge")).toHaveLength(0);
  });

  it("a bleed surface hands padding AND scrolling to the child", () => {
    const { rerender } = render(<AppShell title="t" nav={[item("a")]} activeId="a">x</AppShell>);
    expect(screen.getByTestId("shell-surface").className).toContain("p-6");
    expect(screen.getByTestId("shell-surface").className).toContain("overflow-y-auto");

    // A workspace that scrolls its own panes must not sit inside a second scroller —
    // nested scroll areas make both feel broken.
    rerender(<AppShell title="t" nav={[item("a")]} activeId="a" surface="bleed">x</AppShell>);
    expect(screen.getByTestId("shell-surface").className).not.toContain("p-6");
    expect(screen.getByTestId("shell-surface").className).toContain("overflow-hidden");
  });

  it("an href makes the item a real link — a console is for watching two screens at once", async () => {
    const onSelect = vi.fn();
    render(
      <AppShell title="t" activeId="a" nav={[{ id: "a", label: "Journal", href: "/journal", onSelect }]}>x</AppShell>,
    );

    const link = screen.getByRole("link", { name: "Journal" });
    expect(link).toHaveAttribute("href", "/journal");
    expect(link).toHaveAttribute("aria-current", "page");

    // The router still gets its callback, so it can preventDefault and push state instead
    // of letting the browser reload the document.
    await userEvent.click(link);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("without an href the item stays a button — nothing existing changes shape", () => {
    render(<AppShell title="t" activeId="a" nav={[item("a")]}>x</AppShell>);

    expect(screen.getByRole("button", { name: /a/ })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("a link and a button item are styled identically — navigating is not a visual question", () => {
    render(
      <AppShell
        title="t"
        activeId="neither"
        nav={[
          { id: "a", label: "Linked", href: "/x", onSelect: () => {} },
          { id: "b", label: "Plain", onSelect: () => {} },
        ]}
      >x</AppShell>,
    );

    // Both inactive on purpose: the active state legitimately changes the classes, so
    // comparing an active link against an inactive button would prove nothing.
    const linked = screen.getByRole("link", { name: "Linked" });
    const plain = screen.getByRole("button", { name: "Plain" });
    expect(linked.className).toBe(plain.className);
  });

  it("the VISIBLE search label is translatable, not just the tooltip", () => {
    // The kit ships no i18n framework precisely because strings are props (README, "rules
    // of the house"). A label that only reached the tooltip left the one word an operator
    // actually reads stuck in English.
    render(
      <AppShell title="t" nav={[item("a")]} activeId="a" onSearch={() => {}} labels={{ search: "Ara" }}>x</AppShell>,
    );

    expect(screen.getByRole("button", { name: /Ara/ })).toBeInTheDocument();
    expect(screen.queryByText("Search")).not.toBeInTheDocument();
  });

  it("the footer is pinned OUTSIDE the scrolling list — a long nav must not hide the switcher", () => {
    // The footer holds the tenant/service switcher, the control that scopes everything on
    // screen. A console whose nav has outgrown the viewport would otherwise push it below
    // the fold, and scrolling to change tenant is not a thing anybody should have to learn.
    render(
      <AppShell title="t" nav={[item("a")]} activeId="a" footer={() => <div data-testid="foot">switcher</div>}>x</AppShell>,
    );

    const scroller = screen.getByTestId("shell-nav-scroll");
    expect(scroller.className).toContain("overflow-y-auto");
    expect(scroller).not.toContainElement(screen.getByTestId("foot"));

    // And the rail itself no longer scrolls as a whole, or the pin would be undone by it.
    expect(screen.getByTestId("shell-rail").className).toContain("overflow-hidden");
  });

  it("a throwing localStorage never breaks the shell", () => {
    const real = Storage.prototype.getItem;
    Storage.prototype.getItem = () => { throw new Error("private mode"); };
    try {
      expect(initialCollapsed()).toBe(false);   // falls back rather than crashing the app
    } finally {
      Storage.prototype.getItem = real;
    }
  });
});
