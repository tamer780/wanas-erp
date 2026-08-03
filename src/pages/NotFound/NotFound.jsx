import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  useEffect(() => {
    document.title = "Wanas Group | Page Not Found";
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app px-4 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface-soft text-wanas-600">
        <FileQuestion className="size-7" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-wanas-700">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-wanas-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
