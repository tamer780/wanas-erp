import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Wanas Group | Dashboard";
  }, []);

  return (
    <div className="w-full">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <span className="font-medium text-text-primary" aria-current="page">
              Dashboard
            </span>
          </li>
        </ol>
      </nav>

      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Dashboard
        </h1>
        <p className="max-w-2xl text-sm text-text-secondary sm:text-base">
          This page will contain the ERP overview and KPI widgets.
        </p>
      </div>

      <div className="flex min-h-72 items-center justify-center px-4 py-12 text-center">
        <p className="max-w-md text-sm text-text-muted">
          Dashboard design will be completed after all other pages are ready.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
