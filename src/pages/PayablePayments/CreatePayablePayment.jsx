import { Banknote } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreatePayablePayment = () => {
  return (
    <PageScaffold
      title="Create Payable Payment"
      description="Record a new payable payment."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Payable Payments", to: "/payable-payments" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Banknote}
        title="Create Payable Payment"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreatePayablePayment;
