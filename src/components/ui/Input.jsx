const Input = ({
  id,
  label,
  type = "text",
  error,
  leadingIcon: LeadingIcon,
  trailing,
  disabled = false,
  className = "",
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
      <div className="relative">
        {LeadingIcon && (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted"
            aria-hidden="true"
          >
            <LeadingIcon className="size-5" />
          </span>
        )}
        <input
          id={id}
          type={type}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`
            h-14 w-full rounded-xl border bg-surface text-base text-text-primary
            placeholder:text-text-muted
            transition-[border-color,box-shadow] duration-200
            focus:outline-none focus:ring-2 focus:ring-wanas-600/20 focus:border-wanas-600
            disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-disabled
            ${LeadingIcon ? "pl-12" : "pl-4"}
            ${trailing ? "pr-12" : "pr-4"}
            ${error ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20" : "border-border"}
          `.trim()}
          {...props}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {trailing}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
