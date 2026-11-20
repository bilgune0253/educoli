
function Field({ label, id, error, children }) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
}

export function Input({
  label, id, error, className = "", ...props
}) {
  return (
    <Field label={label} id={id} error={error}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={`ui-input ${className}`}
        {...props}
      />
    </Field>
  );
}

export function Textarea({
  label, id, error, className = "", ...props
}) {
  return (
    <Field label={label} id={id} error={error}>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={`ui-input min-h-28 resize-y ${className}`}
        {...props}
      />
    </Field>
  );
}

export function Select({
  label, id, error, children, className = "", ...props
}) {
  return (
    <Field label={label} id={id} error={error}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={`ui-input ${className}`}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}
