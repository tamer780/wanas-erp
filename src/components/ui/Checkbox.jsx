const Checkbox = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`.trim()}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="
          size-4 shrink-0 rounded border-border text-wanas-600 accent-wanas-600
          transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-60
        "
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium text-text-secondary select-none ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
