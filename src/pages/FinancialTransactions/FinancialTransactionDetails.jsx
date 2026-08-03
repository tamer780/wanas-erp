import { Wallet } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const FinancialTransactionDetails = () => {
  return (
    <PageScaffold
      title="Financial Transaction Details"
      description="View detailed information for this transaction."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Financial Transactions", to: "/financial-transactions" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={Wallet}
        title="Financial Transaction Details"
        description="Transaction details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default FinancialTransactionDetails;
