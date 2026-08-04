const Select = ({
  id,
  label,
  error,
  disabled = false,
  className = "",
  children,
  size = "default",
  ...props
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const heightClass = size === "sm" ? "h-11 text-sm" : "h-14 text-base";

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
      <select
        id={id}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`
          w-full rounded-xl border bg-surface px-4 text-text-primary
          transition-[border-color,box-shadow] duration-200
          focus:outline-none focus:ring-2 focus:ring-wanas-600/20 focus:border-wanas-600
          disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-disabled
          ${heightClass}
          ${error ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20" : "border-border"}
        `.trim()}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
