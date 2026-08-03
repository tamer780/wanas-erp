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
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
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
        inline-flex h-14 w-full items-center justify-center gap-2
        rounded-xl px-6 text-base font-semibold
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${variants[variant] ?? variants.primary}
        ${className}
      `.trim()}
      {...props}
    >
      {loading && (
        <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export default Button;
