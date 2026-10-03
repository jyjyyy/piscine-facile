import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-eau-500 focus:outline-none focus:ring-2 focus:ring-eau-200";

interface FieldWrapperProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

/** Enveloppe commune : label + aide + message d'erreur */
function FieldWrapper({ id, label, hint, error, required, children }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
        {required && (
          <span className="text-red-700" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Unité affichée à droite du champ (ex : "m³") */
  unit?: string;
};

/** Champ texte / nombre avec label accessible */
export function Input({ id, label, hint, error, unit, required, className, ...props }: InputProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <input
          id={id}
          name={props.name ?? id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(inputClass, unit && "pr-14", className)}
          {...props}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-3.5 mt-1.5 flex items-center text-sm text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}

type SelectProps = Omit<ComponentProps<"select">, "id"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
};

/** Liste déroulante avec label accessible */
export function Select({ id, label, hint, error, options, required, className, ...props }: SelectProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        name={props.name ?? id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(inputClass, className)}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

type TextareaProps = Omit<ComponentProps<"textarea">, "id"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

/** Zone de texte multiligne */
export function Textarea({ id, label, hint, error, required, className, ...props }: TextareaProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        name={props.name ?? id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(inputClass, "min-h-32", className)}
        {...props}
      />
    </FieldWrapper>
  );
}
