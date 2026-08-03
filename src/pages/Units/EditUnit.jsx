import { DoorOpen } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditUnit = () => {
  return (
    <PageScaffold
      title="Edit Unit"
      description="Update unit information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Units", to: "/units" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={DoorOpen}
        title="Edit Unit"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditUnit;
