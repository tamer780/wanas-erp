import { Loader2 } from "lucide-react";

const variants = {
  primary: `
    bg-wanas-600 text-white
    hover:bg-wanas-700
    disabled:hover:bg-wanas-600
  `,
  outline: `
    border border-border bg-surface text-text-primary
    hover:bg-surface-soft
    disabled:hover:bg-surface
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:bg-surface-soft hover:text-text-primary
  `,
  danger: `
    bg-danger-600 text-white
    hover:bg-danger-700
    disabled:hover:bg-danger-600
  `,
};

const sizes = {
  default: "h-14 w-full rounded-xl px-6 text-base",
  md: "h-11 w-auto rounded-xl px-5 text-sm",
  sm: "h-9 w-auto rounded-lg px-3 text-sm",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "default",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex cursor-pointer items-center justify-center gap-2
        font-semibold
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${sizes[size] ?? sizes.default}
        ${variants[variant] ?? variants.primary}
        ${className}
      `.trim()}
      {...props}
    >
      {loading && (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export default Button;
