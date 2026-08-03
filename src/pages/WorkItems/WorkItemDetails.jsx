import { Hammer } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const WorkItemDetails = () => {
  return (
    <PageScaffold
      title="Work Item Details"
      description="View detailed information for this work item."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Work Items", to: "/work-items" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={Hammer}
        title="Work Item Details"
        description="Work Item details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default WorkItemDetails;
