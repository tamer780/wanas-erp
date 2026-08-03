import { Handshake } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const UnitSaleDetails = () => {
  return (
    <PageScaffold
      title="Unit Sale Details"
      description="View detailed information for this unit sale."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Unit Sales", to: "/unit-sales" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={Handshake}
        title="Unit Sale Details"
        description="Unit Sale details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default UnitSaleDetails;
