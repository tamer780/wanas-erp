import { Hammer } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditWorkItem = () => {
  return (
    <PageScaffold
      title="Edit Work Item"
      description="Update work item information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Work Items", to: "/work-items" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={Hammer}
        title="Edit Work Item"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditWorkItem;
