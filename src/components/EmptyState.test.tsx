import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("the empty state (B4 promotion) — a void reads as guidance", () => {
  it("renders title as a heading, with body and action", () => {
    render(
      <EmptyState
        title="No batches yet"
        body="Upload a file to start the first run."
        action={<button>upload</button>}
      />,
    );
    expect(screen.getByRole("heading", { name: "No batches yet" })).toBeInTheDocument();
    expect(screen.getByText("Upload a file to start the first run.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "upload" })).toBeInTheDocument();
  });

  it("body, art and action are all optional", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByRole("heading", { name: "Nothing here" })).toBeInTheDocument();
  });
});
