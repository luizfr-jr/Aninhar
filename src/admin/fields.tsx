import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
} from "react";
import "./editor-hcd.css";

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type ControlProps = {
  id?: string;
  value?: string | number | readonly string[];
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  onBlur?: (event: FocusEvent<Control>) => void;
  onChange?: (event: ChangeEvent<Control>) => void;
};

export function Field({
  label,
  help,
  children,
  required = false,
  validate,
}: {
  label: string;
  help?: string;
  children: ReactNode;
  required?: boolean;
  validate?: (value: string) => string | undefined;
}) {
  const generatedId = useId();
  const container = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string>();
  const control = isValidElement<ControlProps>(children) ? children : null;
  const controlId = control?.props.id ?? generatedId;
  const helpId = `${generatedId}-help`;
  const errorId = `${generatedId}-error`;
  const validateRef = useRef(validate);
  validateRef.current = validate;

  function checkField(element: Control) {
    const value = element.value.trim();
    if ((required || element.required) && !value) return "Preencha este campo.";
    if (value && element.validity.typeMismatch)
      return "Informe um endereço de e-mail válido.";
    return value ? validateRef.current?.(value) : undefined;
  }
  const checkRef = useRef(checkField);
  checkRef.current = checkField;
  const controlValue = control?.props.value;
  useEffect(() => {
    if (!touched) return;
    const element = container.current?.querySelector<Control>("input, textarea, select");
    if (element) setError(checkRef.current(element));
  }, [controlValue, touched]);
  useEffect(() => {
    function validateField() {
      const element = container.current?.querySelector<Control>("input, textarea, select");
      if (!element) return;
      setTouched(true);
      setError(checkRef.current(element));
    }
    window.addEventListener("aninhar:validate", validateField);
    return () => window.removeEventListener("aninhar:validate", validateField);
  }, []);

  return (
    <div className="adm-field" ref={container} data-validation-field={label}>
      <label htmlFor={controlId}>
        {label}
        {required && (
          <span className="adm-required" aria-hidden="true"> *</span>
        )}
      </label>
      {control
        ? cloneElement(control, {
            id: controlId,
            required: required || control.props.required,
            "aria-describedby": [control.props["aria-describedby"], help && helpId, error && errorId]
              .filter(Boolean).join(" ") || undefined,
            "aria-invalid": error ? true : undefined,
            onBlur: (event: FocusEvent<Control>) => {
              control.props.onBlur?.(event);
              setTouched(true);
              setError(checkField(event.currentTarget));
            },
            onChange: (event: ChangeEvent<Control>) => {
              control.props.onChange?.(event);
              if (touched) setError(checkField(event.currentTarget));
            },
          })
        : children}
      {help && <small id={helpId} className="adm-help">{help}</small>}
      {error && <small id={errorId} className="adm-field-error">{error}</small>}
    </div>
  );
}
