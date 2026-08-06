import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("the generic button (B4 promotion) — verbs stay VerbButtons", () => {
  it("defaults to the outline skin and keeps its accessible name", () => {
    render(<Button>save draft</Button>);
    const button = screen.getByRole("button", { name: "save draft" });
    expect(button.className).toContain("border-border");
  });

  it("wears the FAMILY's destructive tone — outlined danger, no hardcoded white", () => {
    render(<Button variant="danger">discard</Button>);
    const button = screen.getByRole("button", { name: "discard" });
    expect(button.className).toContain("border-danger-border");
    expect(button.className).toContain("text-danger");
    expect(button.className).not.toContain("text-white");
  });

  it("asChild lends the skin to another element", () => {
    render(
      <Button asChild>
        <a href="/docs">read the docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "read the docs" });
    expect(link.className).toContain("rounded-lg");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
