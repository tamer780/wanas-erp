import { Link } from "react-router-dom";
import { Banknote } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const PayablePayments = () => {
  return (
    <PageScaffold
      title="Payable Payments"
      description="Manage outgoing payable payments."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Payable Payments" },
      ]}
      actions={
        <Link
          to="/payable-payments/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Payable Payment
        </Link>
      }
    >
      <EmptyState
        icon={Banknote}
        title="No Payable Payments Found"
        description="Payable payments will appear here once they are created."
        actionLabel="Create Payable Payment"
        actionTo="/payable-payments/create"
      />
    </PageScaffold>
  );
};

export default PayablePayments;
