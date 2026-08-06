// The demo registry: one renderer per docs-map entry. gallery.test.tsx renders each
// (G3 axe pass) and main.tsx composes the living docs page from the same source —
// a demo that exists only on paper cannot pass, a page that drifts cannot build.
import { useState, type ReactElement } from "react";
import { Home, Package, Settings } from "lucide-react";
import { AppShell, PageHeader } from "../src/components/AppShell";
import { AuditBlock } from "../src/components/AuditBlock";
import { Banner } from "../src/components/Banner";
import { Button } from "../src/components/Button";
import { Checkbox } from "../src/components/Checkbox";
import { CommandPalette } from "../src/components/CommandPalette";
import { DensityProvider, DensityToggle } from "../src/components/Density";
import { CodeBlock, DetailSection, KeyValueRows } from "../src/components/Detail";
import { Dialog } from "../src/components/Dialog";
import {
  DropdownMenu,
  DropdownMenuCheckItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../src/components/DropdownMenu";
import { EmptyState } from "../src/components/EmptyState";
import { FacetFilter } from "../src/components/FacetFilter";
import { Field, Input, Textarea } from "../src/components/Field";
import { IconAction } from "../src/components/IconAction";
import { KeysetTable } from "../src/components/KeysetTable";
import { RunProgress } from "../src/components/RunProgress";
import { SearchBox } from "../src/components/SearchBox";
import { Select } from "../src/components/Select";
import { Sheet } from "../src/components/Sheet";
import { StatCard } from "../src/components/StatCard";
import { StateBadge } from "../src/components/StateBadge";
import { Switch } from "../src/components/Switch";
import { Table } from "../src/components/Table";
import { TabPanel, TabStrip } from "../src/components/TabStrip";
import { Tooltip } from "../src/components/Tooltip";
import { VerbButton } from "../src/components/VerbButton";
import { KNOWN_STATES } from "../src/status";
import { humanizeSeconds } from "../src/duration";
import { shortStamp } from "../src/stamp";

interface Row {
  id: string;
  job: string;
  state: string;
}

const ROWS: Row[] = [
  { id: "run-01", job: "eod-reconciliation", state: "Completed" },
  { id: "run-02", job: "payment-fanout", state: "Running" },
  { id: "run-03", job: "bulk-import", state: "Failed" },
];

function TabsDemo(): ReactElement {
  const [active, setActive] = useState("summary");
  return (
    <div>
      <TabStrip
        scope="docs"
        label="run detail"
        activeId={active}
        onSelect={setActive}
        items={[
          { id: "summary", label: "Summary" },
          { id: "failures", label: "Failures", hint: "3" },
        ]}
      />
      <TabPanel scope="docs" id="summary" activeId={active}>
        the summary body
      </TabPanel>
      <TabPanel scope="docs" id="failures" activeId={active}>
        the failures body
      </TabPanel>
    </div>
  );
}

function SelectionDemo(): ReactElement {
  const [kind, setKind] = useState("csv");
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select
        aria-label="export kind"
        value={kind}
        onChange={setKind}
        options={[{ value: "csv" }, { value: "json", label: "JSON" }, { value: "xml", disabled: true }]}
      />
      <Checkbox checked={checked} onChange={setChecked} label="include archived" />
      <Switch aria-label="dry run" checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function OverlaysDemo(): ReactElement {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div className="flex gap-3">
      <Button onClick={() => setSheetOpen(true)}>open the sheet</Button>
      <Button onClick={() => setDialogOpen(true)}>open the dialog</Button>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="run-02" description="payment-fanout">
        entity detail lives here
      </Sheet>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Add a calendar">
        forms and decisions live here
      </Dialog>
    </div>
  );
}

function FiltersDemo(): ReactElement {
  const [selected, setSelected] = useState(new Set(["Failed"]));
  const [query, setQuery] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchBox label="search runs" value={query} onCommit={setQuery} placeholder="batch id…" />
      <FacetFilter
        label="state"
        options={[
          { value: "Completed", count: 41 },
          { value: "Failed", count: 3 },
        ]}
        selected={selected}
        onToggle={(value) =>
          setSelected((current) => {
            const next = new Set(current);
            if (next.has(value)) next.delete(value);
            else next.add(value);
            return next;
          })
        }
        onClear={() => setSelected(new Set())}
      />
    </div>
  );
}

export const DEMO_RENDERERS: Record<string, () => ReactElement> = {
  "status-language": () => (
    <div className="flex flex-wrap gap-2">
      {[...KNOWN_STATES.slice(0, 8), "SomethingUnknown"].map((state) => (
        <StateBadge key={state} state={state} />
      ))}
    </div>
  ),
  banners: () => (
    <div className="space-y-2">
      <Banner tone="success" live="status">the batch was approved</Banner>
      <Banner tone="danger">approval refused: the batch has 3 unresolved failures</Banner>
      <Banner tone="info" dense>17 rows skipped as duplicates</Banner>
    </div>
  ),
  table: () => (
    <Table
      columns={[
        { header: "run", cell: (row: Row) => row.id },
        { header: "job", cell: (row: Row) => row.job },
        { header: "state", cell: (row: Row) => <StateBadge state={row.state} /> },
      ]}
      rows={ROWS}
      rowKey={(row) => row.id}
      onRowClick={() => {}}
    />
  ),
  "keyset-table": () => (
    <KeysetTable
      columns={[
        { header: "run", cell: (row: Row) => row.id },
        { header: "state", cell: (row: Row) => <StateBadge state={row.state} /> },
      ]}
      rowKey={(row: Row) => row.id}
      loadPage={async () => ({ items: ROWS, nextCursor: null })}
    />
  ),
  verbs: () => (
    <div className="flex gap-3">
      <VerbButton
        label="approve"
        confirm="Approve batch 7 (41,250 rows)?"
        execute={async () => ({ kind: "ok", message: "batch 7 approved" })}
      />
      <VerbButton
        label="reject"
        destructive
        confirm="Reject batch 7?"
        note={{ label: "reason", required: true }}
        execute={async () => ({ kind: "refused", message: "the batch is already approved" })}
      />
    </div>
  ),
  "run-progress": () => (
    <RunProgress
      run={{
        status: "Running",
        startedAt: "2026-08-06T10:00:00Z",
        deadlineAt: "2026-08-06T12:00:00Z",
        totalChunks: 84,
        completedChunks: 52,
        failedChunks: 1,
        itemFailures: 12,
        totalItems: 41250,
      }}
      now={new Date("2026-08-06T10:40:00Z")}
    />
  ),
  audit: () => (
    <AuditBlock
      classified={["iban"]}
      entries={[
        { id: "1", timestamp: "2026-08-06T09:58:12Z", user: "o.celik", entityType: "Client", entityKey: "42", action: "Update", propertyName: "iban", oldValue: "x", newValue: "y" },
        { id: "2", timestamp: "2026-08-06T09:59:03Z", user: null, entityType: "Client", entityKey: "42", action: "Update", propertyName: "status", oldValue: "Pending", newValue: "Approved" },
      ]}
    />
  ),
  overlays: OverlaysDemo,
  "filters-search": FiltersDemo,
  tabs: TabsDemo,
  shell: () => (
    <div className="h-72 overflow-hidden rounded-xl border border-border">
      <AppShell
        title="qorpe console"
        subtitle="docs"
        activeId="runs"
        nav={[
          { id: "home", label: "Today", icon: <Home size={16} />, onSelect: () => {} },
          { id: "runs", label: "Runs", icon: <Package size={16} />, group: "Operations", badge: 3, onSelect: () => {} },
          { id: "settings", label: "Settings", icon: <Settings size={16} />, group: "System", onSelect: () => {} },
        ]}
      >
        <PageHeader title="Runs" purpose="Every run the fleet executed, newest first." />
      </AppShell>
    </div>
  ),
  palette: () => (
    <div>
      <p className="text-sm text-muted-foreground">⌘K / Ctrl-K opens it anywhere; `openCommand()` opens it from code.</p>
      <CommandPalette groups={[{ heading: "Go to", items: [{ id: "runs", label: "Runs", run: () => {} }] }]} />
    </div>
  ),
  "stat-cards": () => (
    <div className="flex gap-3">
      <StatCard label="runs today" value="1,204" />
      <StatCard label="failures" value="3" tone="danger" onClick={() => {}} />
    </div>
  ),
  selection: SelectionDemo,
  form: () => (
    <div className="max-w-md space-y-4">
      <Field label="Client name" description="As registered with the bank." required>
        <Input placeholder="Acme Ltd." />
      </Field>
      <Field label="Notes" error="Keep it under 200 characters.">
        <Textarea rows={2} />
      </Field>
    </div>
  ),
  buttons: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">save</Button>
      <Button>secondary</Button>
      <Button variant="danger">discard</Button>
      <IconAction icon={<Settings size={16} />} label="Settings" onClick={() => {}} />
      <Tooltip label="tooltips ride hover AND focus">
        <Button variant="ghost">hover me</Button>
      </Tooltip>
    </div>
  ),
  menus: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>preferences</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuCheckItem checked>English</DropdownMenuCheckItem>
        <DropdownMenuCheckItem checked={false}>Türkçe</DropdownMenuCheckItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  "empty-state": () => (
    <EmptyState
      title="No batches yet"
      body="Upload a file to start the first run."
      action={<Button variant="primary">upload</Button>}
    />
  ),
  detail: () => (
    <DetailSection title="Delivery">
      <KeyValueRows
        rows={[
          { key: "channel", value: "email" },
          { key: "message id", value: "msg_9f21", mono: true },
        ]}
      />
      <CodeBlock text={'{\n  "to": "ops@example.test"\n}'} />
    </DetailSection>
  ),
  density: () => (
    <DensityProvider>
      <div className="flex items-center gap-3">
        <DensityToggle />
        <span className="text-sm text-muted-foreground">flips every family table between the two rhythms</span>
      </div>
    </DensityProvider>
  ),
  helpers: () => (
    <KeyValueRows
      rows={[
        { key: "humanizeSeconds(5400)", value: humanizeSeconds(5400), mono: true },
        { key: "shortStamp(…)", value: shortStamp("2026-08-06T10:40:12.532Z"), mono: true },
      ]}
    />
  ),
};
