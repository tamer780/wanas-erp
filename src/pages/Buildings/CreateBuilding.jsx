import { Building2 } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateBuilding = () => {
  return (
    <PageScaffold
      title="Create Building"
      description="Add a new building to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Buildings", to: "/buildings" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Building2}
        title="Create Building"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateBuilding;
