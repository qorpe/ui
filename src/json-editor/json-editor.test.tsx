import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JsonEditor, JsonField } from "./index";

describe("the json editor subpath (RFC D6) — CodeMirror stays out of the main bundle", () => {
  it("JsonEditor mounts a CodeMirror view with the document", () => {
    const { container } = render(<JsonEditor value='{"a":1}' />);
    expect(container.querySelector(".cm-editor")).toBeTruthy();
    expect(container.textContent).toContain('"a"');
  });

  it("reconciles an EXTERNAL value change into the view", () => {
    const { container, rerender } = render(<JsonEditor value='{"a":1}' />);
    rerender(<JsonEditor value='{"b":2}' />);
    expect(container.textContent).toContain('"b"');
    expect(container.textContent).not.toContain('"a"');
  });

  it("Beautify pretty-prints valid JSON and leaves templated bodies untouched", async () => {
    const onChange = vi.fn();
    render(<JsonField value='{"a":1}' onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Beautify" }));
    expect(onChange).toHaveBeenCalledWith('{\n  "a": 1\n}');

    onChange.mockClear();
    render(<JsonField value="{{template}}" onChange={onChange} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Beautify" })[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Copy flips to the copied state and the labels are props", async () => {
    Object.assign(navigator, { clipboard: { writeText: async () => {} } });
    render(<JsonField value="{}" labels={{ copy: "Kopyala", copied: "Kopyalandı" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Kopyala" }));
    expect(await screen.findByRole("button", { name: "Kopyalandı" })).toBeInTheDocument();
  });

  it("readOnly hides Beautify; onUpload shows Upload", () => {
    render(<JsonField value="{}" readOnly onUpload={() => {}} />);
    expect(screen.queryByRole("button", { name: "Beautify" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });
});
