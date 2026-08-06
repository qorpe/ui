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
