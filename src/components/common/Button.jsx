import { Link } from "react-router-dom";

const variants = {
  primary: `
    bg-wanas-600 text-white shadow-card
    hover:bg-wanas-700 hover:-translate-y-0.5 hover:shadow-card-hover
    focus-visible:ring-wanas-600
  `,
  outline: `
    border border-white/45 bg-transparent text-white
    hover:bg-white/10 hover:-translate-y-0.5
    focus-visible:ring-white
  `,
  ghost: `
    bg-transparent text-text-primary
    hover:bg-surface-soft hover:-translate-y-0.5
    focus-visible:ring-wanas-600
  `,
  gold: `
    bg-wanas-gold-500 text-wanas-dark shadow-card
    hover:bg-wanas-gold-600 hover:-translate-y-0.5 hover:shadow-card-hover
    focus-visible:ring-wanas-gold-500
  `,
};

const baseClass = `
  inline-flex items-center justify-center gap-2
  rounded-xl px-9 py-4
  text-sm font-semibold tracking-[0.08em] uppercase
  transition-all duration-300
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
`.trim();

const Button = ({
  children,
  variant = "primary",
  href,
  to,
  className = "",
  type = "button",
  ...props
}) => {
  const classes = `${baseClass} ${variants[variant] ?? variants.primary} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
