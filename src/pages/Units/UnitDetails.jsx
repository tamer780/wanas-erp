import { DoorOpen } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const UnitDetails = () => {
  return (
    <PageScaffold
      title="Unit Details"
      description="View detailed information for this unit."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Units", to: "/units" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={DoorOpen}
        title="Unit Details"
        description="Unit details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default UnitDetails;
