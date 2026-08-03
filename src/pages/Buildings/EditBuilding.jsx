import { Building2 } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditBuilding = () => {
  return (
    <PageScaffold
      title="Edit Building"
      description="Update building information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Buildings", to: "/buildings" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={Building2}
        title="Edit Building"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditBuilding;
