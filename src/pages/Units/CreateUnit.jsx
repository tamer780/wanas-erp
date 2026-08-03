import { DoorOpen } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateUnit = () => {
  return (
    <PageScaffold
      title="Create Unit"
      description="Add a new unit to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Units", to: "/units" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={DoorOpen}
        title="Create Unit"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateUnit;
