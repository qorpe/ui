import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

describe("the family switch (B4 promotion)", () => {
  it("is a real switch: role, state, and a click flips it", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="dark mode" checked={false} onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch", { name: "dark mode" });
    expect(control).toHaveAttribute("aria-checked", "false");
    await userEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("the thumb rides the token ramp — no hardcoded thumb colours", () => {
    const { container } = render(<Switch aria-label="x" />);
    expect(container.innerHTML).toContain("bg-background");
    expect(container.innerHTML).not.toContain("bg-white");
    expect(container.innerHTML).not.toContain("#18181b");
  });
});
