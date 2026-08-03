import { Building2 } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const BuildingDetails = () => {
  return (
    <PageScaffold
      title="Building Details"
      description="View detailed information for this building."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Buildings", to: "/buildings" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={Building2}
        title="Building Details"
        description="Building details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default BuildingDetails;
