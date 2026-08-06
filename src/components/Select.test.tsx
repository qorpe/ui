import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const OPTIONS = [{ value: "a" }, { value: "b", label: "bee" }];

describe("the family select (v1.2 §8.7, modernized — the family's OWN listbox)", () => {
  it("opens the family menu, walks it, and reports the chosen VALUE", async () => {
    const onChange = vi.fn();
    render(<Select aria-label="archive" value="a" onChange={onChange} options={OPTIONS} />);

    // The trigger is a combobox with an accessible name — not a platform popup.
    const trigger = screen.getByRole("combobox", { name: "archive" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Labels win over raw values; selection reports the VALUE and closes the list.
    await userEvent.click(await screen.findByRole("option", { name: "bee" }));
    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows the chosen option's LABEL on the closed trigger", () => {
    render(<Select aria-label="x" value="b" onChange={() => {}} options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("bee");
  });

  it("walks with the keyboard: arrows move, Enter chooses, Escape closes empty-handed", async () => {
    const onChange = vi.fn();
    render(<Select aria-label="k" value="a" onChange={onChange} options={OPTIONS} />);
    const trigger = screen.getByRole("combobox", { name: "k" });

    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");        // opens at the current value
    await userEvent.keyboard("{ArrowDown}");        // walks to "b"…
    // …and the walk is AUDIBLE: the button points at the highlighted option.
    expect(trigger.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "bee" }).id);
    await userEvent.keyboard("{Enter}");            // chooses it
    expect(onChange).toHaveBeenCalledWith("b");

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Escape}");           // closes without choosing again
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("B2 — the four completed gaps (long lists, viewport edges, disabled, live value)", () => {
  const MIXED = [{ value: "a" }, { value: "b", disabled: true }, { value: "c" }];

  it("skips disabled options on the walk and bounces the pointer off them", async () => {
    const onChange = vi.fn();
    render(<Select aria-label="mixed" value="a" onChange={onChange} options={MIXED} />);
    const trigger = screen.getByRole("combobox", { name: "mixed" });

    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");   // opens at "a"
    await userEvent.keyboard("{ArrowDown}");   // walks — and lands on "c", never "b"
    expect(trigger.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "c" }).id);

    // A pointer on the disabled option chooses nothing and the list stays open.
    await userEvent.click(screen.getByRole("option", { name: "b" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("End lands on the LAST ENABLED option when the tail is disabled", async () => {
    render(
      <Select aria-label="tail" value="a" onChange={() => {}}
        options={[{ value: "a" }, { value: "z", disabled: true }]} />,
    );
    const tail = screen.getByRole("combobox", { name: "tail" });
    tail.focus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{End}");
    expect(tail.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "a" }).id);
  });

  it("scrolls the highlighted option into view as the walk moves", async () => {
    const scrolled = vi.spyOn(Element.prototype, "scrollIntoView");
    render(<Select aria-label="long" value="a" onChange={() => {}} options={OPTIONS} />);
    screen.getByRole("combobox", { name: "long" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    expect(scrolled).toHaveBeenCalledWith({ block: "nearest" });
    scrolled.mockRestore();
  });

  it("flips upward when the viewport bottom would clip the list", async () => {
    const { container } = render(<Select aria-label="edge" value="a" onChange={() => {}} options={OPTIONS} />);
    const root = container.firstElementChild as HTMLElement;
    root.getBoundingClientRect = () =>
      ({ top: 700, bottom: 736, left: 0, right: 100, width: 100, height: 36, x: 0, y: 700, toJSON: () => ({}) }) as DOMRect;

    await userEvent.click(screen.getByRole("combobox", { name: "edge" }));
    expect(screen.getByRole("listbox").className).toContain("bottom-full");
  });

  it("keeps opening downward when there is room below", async () => {
    render(<Select aria-label="roomy" value="a" onChange={() => {}} options={OPTIONS} />);
    await userEvent.click(screen.getByRole("combobox", { name: "roomy" }));
    expect(screen.getByRole("listbox").className).toContain("top-full");
  });

  it("follows an external value change while the list is OPEN", async () => {
    const { rerender } = render(<Select aria-label="live" value="a" onChange={() => {}} options={MIXED} />);
    const trigger = screen.getByRole("combobox", { name: "live" });
    await userEvent.click(trigger);
    rerender(<Select aria-label="live" value="c" onChange={() => {}} options={MIXED} />);
    expect(trigger.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "c" }).id);
  });
});
