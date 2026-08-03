import { Truck } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const SupplierDetails = () => {
  return (
    <PageScaffold
      title="Supplier Details"
      description="View detailed information for this supplier."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Suppliers", to: "/suppliers" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={Truck}
        title="Supplier Details"
        description="Supplier details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default SupplierDetails;
