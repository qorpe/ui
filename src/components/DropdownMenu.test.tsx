import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuCheckItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

function Menu({ checked = false, onSelect = () => {} }: { checked?: boolean; onSelect?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>preferences</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuCheckItem checked={checked}>English</DropdownMenuCheckItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSelect}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("the menu that STAYS a menu (B4 promotion, RFC D3)", () => {
  it("opens from its trigger and runs a plain item", async () => {
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "preferences" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Sign out" }));
    expect(onSelect).toHaveBeenCalled();
  });

  it("CheckItem is a REAL checkbox item now: role and aria-checked speak", async () => {
    render(<Menu checked />);
    await userEvent.click(screen.getByRole("button", { name: "preferences" }));
    const item = await screen.findByRole("menuitemcheckbox", { name: "English" });
    expect(item).toHaveAttribute("aria-checked", "true");
  });
});
