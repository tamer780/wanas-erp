import { Link } from "react-router-dom";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}) => {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-4 py-12 text-center">
      {Icon ? (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface-soft text-wanas-600">
          <Icon className="size-7" aria-hidden="true" />
        </div>
      ) : null}
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-text-secondary">{description}</p>
      ) : null}
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-wanas-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
