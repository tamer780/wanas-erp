import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Reports = () => {
  return (
    <PageScaffold
      title="Reports"
      description="Access financial and operational reports."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Reports" },
      ]}
      actions={
        <Link
          to="/reports/income-expense"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Income & Expense
        </Link>
      }
    >
      <EmptyState
        icon={BarChart3}
        title="Reports"
        description="Report modules will appear here."
        actionLabel="Income & Expense"
        actionTo="/reports/income-expense"
      />
    </PageScaffold>
  );
};

export default Reports;
