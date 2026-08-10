import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Sheet } from "./Sheet";
import { Table } from "./Table";

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>open it</button>
      <Sheet open={open} onOpenChange={setOpen} title="Run run-9f21" description="One run, in full.">
        <p>the detail body</p>
      </Sheet>
    </>
  );
}

describe("Sheet (v1.1 §7.4)", () => {
  it("opens as a titled dialog and closes from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "open it" }));

    const dialog = await screen.findByRole("dialog", { name: "Run run-9f21" });
    expect(dialog).toHaveTextContent("the detail body");
    expect(dialog).toHaveTextContent("One run, in full.");

    // An operator who opened it by mistake leaves the way they came — Escape.
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("a custom header replaces what is SEEN and keeps the accessible name", async () => {
    // mockifyr's message and journal panels build interactive headers — a hover-to-copy
    // subject, a metadata row that changes shape per channel. A plain string title cannot
    // carry those, and a dialog with no accessible name cannot be announced. Both, then.
    function Custom() {
      const [open, setOpen] = useState(true);
      return (
        <Sheet
          open={open}
          onOpenChange={setOpen}
          title="Run run-9f21"
          description="One run, in full."
          header={<button>copy subject</button>}
        >
          <p>body</p>
        </Sheet>
      );
    }
    render(<Custom />);

    // Announced by the title even though the title is not drawn.
    const dialog = await screen.findByRole("dialog", { name: "Run run-9f21" });
    expect(await screen.findByRole("button", { name: "copy subject" })).toBeInTheDocument();

    // The default block is hidden rather than removed: Radix requires a Title, and omitting
    // one trades a visual choice for a broken a11y tree.
    expect(dialog.querySelector("h2")).toHaveClass("sr-only");
    expect(screen.getByText("One run, in full.")).toHaveClass("sr-only");
  });

  it("without a header the title and description are drawn as before", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "open it" }));

    const dialog = await screen.findByRole("dialog", { name: "Run run-9f21" });
    expect(dialog.querySelector("h2")).not.toHaveClass("sr-only");
    expect(screen.getByText("One run, in full.")).not.toHaveClass("sr-only");
  });

  it("a bleed body hands padding AND scrolling to the child", async () => {
    // A detail panel whose tabs scroll their own panes must not sit inside a second scroller;
    // two scrollbars racing each other make both feel broken. Same choice AppShell offers for
    // its content surface, and for the same reason.
    function Bleeding() {
      const [open, setOpen] = useState(true);
      return (
        <Sheet open={open} onOpenChange={setOpen} title="Run run-9f21" body="bleed">
          <p>body</p>
        </Sheet>
      );
    }
    render(<Bleeding />);

    const shell = await screen.findByTestId("sheet-body");
    expect(shell).toHaveAttribute("data-body", "bleed");
    expect(shell.className).not.toContain("overflow-y-auto");
    expect(shell.className).not.toContain("px-6");
  });

  it("the body is padded and scrolls by default — nothing existing changes", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "open it" }));

    const shell = await screen.findByTestId("sheet-body");
    expect(shell).toHaveAttribute("data-body", "padded");
    expect(shell.className).toContain("overflow-y-auto");
    expect(shell.className).toContain("px-6");
  });

  it("the close button is a named control, not a bare ×", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "open it" }));

    await user.click(await screen.findByRole("button", { name: "close" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});

describe("Table (v1.1 §7.4)", () => {
  const rows = [{ id: "a", name: "eod" }, { id: "b", name: "sweep" }];

  it("is a REAL table — column semantics for free", () => {
    render(<Table columns={[{ header: "Name", cell: (r: (typeof rows)[0]) => r.name }]} rows={rows} rowKey={(r) => r.id} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);   // header + 2
  });

  it("a row click hands over the ROW, and emptiness says so in words", async () => {
    const user = userEvent.setup();
    const clicked: string[] = [];
    const { rerender } = render(
      <Table columns={[{ header: "Name", cell: (r: (typeof rows)[0]) => r.name }]} rows={rows} rowKey={(r) => r.id} onRowClick={(r) => clicked.push(r.id)} />,
    );

    await user.click(screen.getByText("sweep"));
    expect(clicked).toEqual(["b"]);

    rerender(<Table columns={[{ header: "Name", cell: (r: (typeof rows)[0]) => r.name }]} rows={[]} rowKey={(r: (typeof rows)[0]) => r.id} emptyMessage="No calendars." />);
    // The empty state is one ROW spanning every column — the reference's structure,
    // not a <p> floating outside the table's semantics.
    const emptyCell = screen.getByText("No calendars.").closest("td")!;
    expect(emptyCell).toHaveAttribute("colspan", "1");
    expect(screen.getByText("No calendars.")).toBeInTheDocument();
  });
});
