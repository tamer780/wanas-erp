import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

const ClientsErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-danger-100 bg-danger-50/40 px-4 py-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-danger-100 text-danger-600">
        <AlertTriangle className="size-7" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary">
        Unable to load clients
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-secondary">
        {message || "An unexpected error occurred while fetching clients."}
      </p>
      {onRetry ? (
        <Button type="button" size="md" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
};

export default ClientsErrorState;
