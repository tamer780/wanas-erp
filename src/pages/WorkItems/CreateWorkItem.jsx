import { Hammer } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateWorkItem = () => {
  return (
    <PageScaffold
      title="Create Work Item"
      description="Add a new work item to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Work Items", to: "/work-items" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Hammer}
        title="Create Work Item"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateWorkItem;
