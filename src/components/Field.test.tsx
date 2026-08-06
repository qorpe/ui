import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Controller, useForm } from "react-hook-form";
import { Field, Input, Textarea } from "./Field";
import { Select } from "./Select";

describe("the form field (RFC D4) — label, description and error wired ONCE", () => {
  it("names the control by its label and describes it by description AND error", () => {
    render(
      <Field label="Client name" description="As registered." error="Required.">
        <Input defaultValue="" />
      </Field>,
    );
    const control = screen.getByRole("textbox", { name: "Client name" });
    expect(control).toHaveAccessibleDescription("As registered. Required.");
    expect(control).toHaveAttribute("aria-invalid", "true");
    // The error is real text, not a colour: both paragraphs are in the tree.
    expect(screen.getByText("Required.")).toBeInTheDocument();
  });

  it("stays aria-valid with no error, and the required marker is decoration only", () => {
    render(
      <Field label="IBAN" required>
        <Textarea />
      </Field>,
    );
    const control = screen.getByRole("textbox", { name: "IBAN" });
    expect(control).not.toHaveAttribute("aria-invalid");
    expect(control).not.toHaveAttribute("aria-describedby");
    expect(screen.getByText("IBAN")).toHaveTextContent("IBAN *");
  });

  it("carries a spread register() — native controls need no adapter", async () => {
    const submitted = vi.fn();
    function Form() {
      const { register, handleSubmit, formState } = useForm<{ name: string }>({ mode: "onSubmit" });
      return (
        <form onSubmit={handleSubmit(submitted)}>
          <Field label="Name" error={formState.errors.name?.message}>
            <Input {...register("name", { required: "Name is required." })} />
          </Field>
          <button type="submit">save</button>
        </form>
      );
    }
    render(<Form />);
    await userEvent.click(screen.getByRole("button", { name: "save" }));
    // The RHF error lands in the Field and marks the control invalid.
    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("aria-invalid", "true");

    await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "Acme");
    await userEvent.click(screen.getByRole("button", { name: "save" }));
    expect(submitted).toHaveBeenCalledWith(expect.objectContaining({ name: "Acme" }), expect.anything());
  });

  it("drives the family Select through a Controller — the D4 proof", async () => {
    const submitted = vi.fn();
    function Form() {
      const { control, handleSubmit } = useForm<{ kind: string }>({ defaultValues: { kind: "a" } });
      return (
        <form onSubmit={handleSubmit(submitted)}>
          <Field label="Kind">
            <Controller
              control={control}
              name="kind"
              render={({ field }) => (
                <Select aria-label="Kind" value={field.value} onChange={field.onChange}
                  options={[{ value: "a" }, { value: "b", label: "bee" }]} />
              )}
            />
          </Field>
          <button type="submit">save</button>
        </form>
      );
    }
    render(<Form />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: "bee" }));
    await userEvent.click(screen.getByRole("button", { name: "save" }));
    expect(submitted).toHaveBeenCalledWith(expect.objectContaining({ kind: "b" }), expect.anything());
  });
});
