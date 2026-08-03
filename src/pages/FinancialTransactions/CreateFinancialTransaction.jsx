import { Wallet } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateFinancialTransaction = () => {
  return (
    <PageScaffold
      title="Create Financial Transaction"
      description="Add a new financial transaction."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Financial Transactions", to: "/financial-transactions" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Wallet}
        title="Create Financial Transaction"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateFinancialTransaction;
