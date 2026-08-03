import { HardHat } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateContractor = () => {
  return (
    <PageScaffold
      title="Create Contractor"
      description="Add a new contractor to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Contractors", to: "/contractors" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={HardHat}
        title="Create Contractor"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateContractor;
