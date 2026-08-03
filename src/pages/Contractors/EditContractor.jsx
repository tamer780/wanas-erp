import { HardHat } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditContractor = () => {
  return (
    <PageScaffold
      title="Edit Contractor"
      description="Update contractor information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Contractors", to: "/contractors" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={HardHat}
        title="Edit Contractor"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditContractor;
