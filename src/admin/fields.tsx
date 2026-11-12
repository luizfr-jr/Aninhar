import type { ReactNode } from "react";

export function Field({
  label,
  help,
  children,
  required = false,
}: {
  label: string;
  help?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="adm-field">
      <span>
        {label}
        {required && (
          <span className="adm-required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </span>
      {children}
      {help && <small className="adm-help">{help}</small>}
    </label>
  );
}
