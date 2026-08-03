import { BarChart3 } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const IncomeExpense = () => {
  return (
    <PageScaffold
      title="Income & Expense"
      description="Review income and expense summaries."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Reports", to: "/reports" },
        { label: "Income & Expense" },
      ]}
    >
      <EmptyState
        icon={BarChart3}
        title="Income & Expense Report"
        description="This report will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default IncomeExpense;
