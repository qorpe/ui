import { cloneElement, isValidElement, useId } from "react";
import type { ReactElement, ReactNode } from "react";

/** The family text input: the `.control` skin, nothing more — Field adds the wiring. */
export function Input({ className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`control w-full ${className}`} {...rest} />;
}

/** The family textarea on the same `.control` skin. */
export function Textarea({ className = "", ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`control w-full ${className}`} {...rest} />;
}

export interface FieldProps {
  /** The visible field name — labels are not optional in a form. */
  label: string;
  /** Guidance shown under the control; read to AT via aria-describedby. */
  description?: string;
  /** The error text. Its presence marks the control aria-invalid. */
  error?: string;
  /** Marks the label; validation itself belongs to the form layer. */
  required?: boolean;
  id?: string;
  className?: string;
  /** Exactly ONE control (Input, Textarea, Select, Checkbox, a Controller render…). */
  children: ReactNode;
}

/**
 * The form field wrapper (RFC D4): label + description + error in one anatomy, with
 * the ARIA wiring done ONCE — the control is cloned with `id`, `aria-labelledby`,
 * `aria-describedby` (description and error, when present) and `aria-invalid`.
 * Works controlled and under react-hook-form's Controller; native controls also
 * accept a spread `register()` since the cloned props are plain DOM attributes.
 */
export function Field({ label, description, error, required, id, className = "", children }: FieldProps) {
  const autoId = useId();
  const fieldId = id ?? `field-${autoId}`;
  const labelId = `${fieldId}-label`;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: fieldId,
        "aria-labelledby": labelId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })
    : children;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label id={labelId} htmlFor={fieldId} className="control-label font-medium text-foreground">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger">
            {" *"}
          </span>
        )}
      </label>
      {control}
      {description && (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
