import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const FinancialTransactions = () => {
  return (
    <PageScaffold
      title="Financial Transactions"
      description="Track income and expense transactions."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Financial Transactions" },
      ]}
      actions={
        <Link
          to="/financial-transactions/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Transaction
        </Link>
      }
    >
      <EmptyState
        icon={Wallet}
        title="No Financial Transactions Found"
        description="Financial transactions will appear here once they are created."
        actionLabel="Create Transaction"
        actionTo="/financial-transactions/create"
      />
    </PageScaffold>
  );
};

export default FinancialTransactions;
