import { Package } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const MaterialPurchaseDetails = () => {
  return (
    <PageScaffold
      title="Material Purchase Details"
      description="View detailed information for this material purchase."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Material Purchases", to: "/material-purchases" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={Package}
        title="Material Purchase Details"
        description="Material Purchase details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default MaterialPurchaseDetails;
