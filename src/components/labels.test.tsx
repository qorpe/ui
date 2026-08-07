import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuditBlock } from "./AuditBlock";
import { CodeBlock } from "./Detail";
import { Dialog } from "./Dialog";
import { FacetFilter } from "./FacetFilter";
import { KeysetTable } from "./KeysetTable";
import { RunProgress } from "./RunProgress";
import { SearchBox } from "./SearchBox";
import { VerbButton } from "./VerbButton";

/**
 * RFC D5: every user-facing literal is an overridable prop with an English default.
 * The DEFAULTS are pinned by each component's own tests (unchanged by the sweep);
 * this file proves the OVERRIDES flow — a Turkish console never shows English chrome.
 */
describe("strings-as-props (RFC D5) — the overrides actually flow", () => {
  it("SearchBox clear button takes its name from the caller", () => {
    render(<SearchBox value="x" onCommit={() => {}} label="ara" clearLabel="aramayı temizle" />);
    expect(screen.getByRole("button", { name: "aramayı temizle" })).toBeInTheDocument();
  });

  it("Dialog's close button speaks the caller's language", async () => {
    render(
      <Dialog open onOpenChange={() => {}} title="Başlık" closeLabel="kapat">
        içerik
      </Dialog>,
    );
    expect(screen.getByRole("button", { name: "kapat" })).toBeInTheDocument();
  });

  it("CodeBlock's copy action renames both states", async () => {
    Object.assign(navigator, { clipboard: { writeText: async () => {} } });
    render(<CodeBlock text="{}" copyLabel="Kopyala" copiedLabel="Kopyalandı" />);
    await userEvent.click(screen.getByRole("button", { name: "Kopyala" }));
    expect(await screen.findByRole("button", { name: "Kopyalandı" })).toBeInTheDocument();
  });

  it("FacetFilter's clear row is a prop", async () => {
    render(
      <FacetFilter label="durum" options={[{ value: "açık" }]} selected={new Set(["açık"])}
        onToggle={() => {}} onClear={() => {}} clearLabel="temizle" />,
    );
    await userEvent.click(screen.getByRole("button", { name: /durum/ }));
    expect(await screen.findByText("temizle")).toBeInTheDocument();
  });

  it("VerbButton's machine copy — audited hint and cancel — is overridable", async () => {
    render(
      <VerbButton label="onayla" confirm="Emin misiniz?"
        execute={async () => ({ kind: "ok", message: "tamam" })}
        labels={{ audited: "· denetlenir", cancel: "vazgeç", confirmName: (l) => `${l} onayı` }} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "onayla" }));
    expect(screen.getByRole("alertdialog", { name: "onayla onayı" })).toBeInTheDocument();
    expect(screen.getByText("· denetlenir")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "vazgeç" })).toBeInTheDocument();
  });

  it("KeysetTable's footer and load-more compose from label functions", async () => {
    render(
      <KeysetTable
        columns={[{ header: "ad", cell: (r: { id: string }) => r.id }]}
        rowKey={(r: { id: string }) => r.id}
        loadPage={async () => ({ items: [{ id: "bir" }], nextCursor: "daha" })}
        labels={{ loadMore: "daha yükle", loaded: (n) => `${n} kayıt yüklendi` }}
      />,
    );
    expect(await screen.findByText("1 kayıt yüklendi")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "daha yükle" })).toBeInTheDocument();
  });

  it("RunProgress verdicts and counters speak the caller's language", () => {
    render(
      <RunProgress
        run={{ status: "Running", startedAt: "2026-08-06T10:00:00Z", deadlineAt: "2026-08-06T12:00:00Z",
          totalChunks: 10, completedChunks: 5, failedChunks: 1, itemFailures: 2 }}
        now={new Date("2026-08-06T10:30:00Z")}
        labels={{ chunks: (d, t) => `${d}/${t} parça`, failed: (n) => `${n} başarısız`,
          inRepair: (n) => `${n} onarımda`, onTrack: "yolunda" }}
      />,
    );
    expect(screen.getByText("5/10 parça")).toBeInTheDocument();
    expect(screen.getByText("1 başarısız")).toBeInTheDocument();
    expect(screen.getByText("2 onarımda")).toBeInTheDocument();
    expect(screen.getByText("yolunda")).toBeInTheDocument();
  });

  it("AuditBlock's system actor and classified tag are props", () => {
    render(
      <AuditBlock
        classified={["iban"]}
        labels={{ system: "sistem", classifiedTag: "(gizli)" }}
        entries={[{ id: "1", timestamp: "2026-08-06T10:00:00Z", entityType: "Client", entityKey: "42",
          action: "Update", propertyName: "iban", oldValue: "a", newValue: "b" }]}
      />,
    );
    expect(screen.getByText("sistem")).toBeInTheDocument();
    expect(screen.getByText("(gizli)")).toBeInTheDocument();
  });
});

// B7 — the a11y closures, pinned.
import { Table } from "./Table";
import { TabPanel, TabStrip } from "./TabStrip";
import { vi as vitest } from "vitest";

describe("B7 a11y closures", () => {
  it("a clickable Table row is a KEYBOARD row: tab reaches it, Enter opens it", async () => {
    const onRowClick = vitest.fn();
    render(
      <Table
        columns={[{ header: "id", cell: (r: { id: string }) => r.id }]}
        rows={[{ id: "row-1" }]}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    const row = screen.getByText("row-1").closest("tr")!;
    expect(row).toHaveAttribute("tabindex", "0");
    row.focus();
    await userEvent.keyboard("{Enter}");
    expect(onRowClick).toHaveBeenCalledWith({ id: "row-1" });
  });

  it("KeysetTable says aria-busy while a page loads", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    render(
      <KeysetTable
        columns={[{ header: "id", cell: (r: { id: string }) => r.id }]}
        rowKey={(r: { id: string }) => r.id}
        loadPage={async () => {
          await gate;
          return { items: [{ id: "x" }], nextCursor: null };
        }}
      />,
    );
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    release();
    expect(await screen.findByText("x")).toBeInTheDocument();
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "false");
  });

  it("two TabStrips with the same item ids stay apart under scopes", () => {
    render(
      <>
        <TabStrip scope="left" label="left tabs" activeId="a" onSelect={() => {}} items={[{ id: "a", label: "A" }]} />
        <TabStrip scope="right" label="right tabs" activeId="a" onSelect={() => {}} items={[{ id: "a", label: "A" }]} />
        <TabPanel scope="left" id="a" activeId="a">left body</TabPanel>
      </>,
    );
    const [leftTab, rightTab] = screen.getAllByRole("tab", { name: "A" });
    expect(leftTab.id).toBe("tab-left-a");
    expect(rightTab.id).toBe("tab-right-a");
    // The pairing survives the prefix: the panel is labelled by ITS strip's tab.
    expect(screen.getByRole("tabpanel", { name: "A" }).id).toBe("panel-left-a");
  });
});

// 0.1.1 — the first adopter-feedback additions, pinned.
describe("0.1.1 adopter feedback (mockifyr)", () => {
  it("FacetFilter: compact shrinks the trigger and className passes through", () => {
    render(
      <FacetFilter label="method" compact className="w-full" options={[{ value: "GET" }]}
        selected={new Set()} onToggle={() => {}} onClear={() => {}} />,
    );
    const trigger = screen.getByRole("button", { name: /method/ });
    expect(trigger.className).toContain("h-8");
    expect(trigger.className).toContain("w-full");
  });

  it("SearchBox: className lands on the wrapper without touching the input", () => {
    render(<SearchBox value="" onCommit={() => {}} label="filter" className="flex-none" />);
    expect(screen.getByRole("textbox", { name: "filter" }).closest("label")!.className).toContain("flex-none");
  });
});

// 0.1.2 — Sheet width (adopter feedback #3, mockifyr M2).
import { Sheet } from "./Sheet";
describe("0.1.2 Sheet maxWidth", () => {
  it("defaults to 680 and takes the caller's ceiling", () => {
    const { rerender } = render(<Sheet open onOpenChange={() => {}} title="detay">gövde</Sheet>);
    expect(document.querySelector('[data-testid="sheet"]')).toHaveStyle({ maxWidth: "680px" });
    rerender(<Sheet open onOpenChange={() => {}} title="detay" maxWidth={720}>gövde</Sheet>);
    expect(document.querySelector('[data-testid="sheet"]')).toHaveStyle({ maxWidth: "720px" });
  });
});
