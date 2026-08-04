const Textarea = ({
  id,
  label,
  error,
  disabled = false,
  className = "",
  rows = 3,
  ...props
}) => {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-text-primary"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`
          w-full resize-y rounded-xl border bg-surface px-4 py-3 text-base text-text-primary
          placeholder:text-text-muted
          transition-[border-color,box-shadow] duration-200
          focus:outline-none focus:ring-2 focus:ring-wanas-600/20 focus:border-wanas-600
          disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-disabled
          ${error ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20" : "border-border"}
        `.trim()}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
