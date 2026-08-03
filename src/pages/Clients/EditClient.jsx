import { Users } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditClient = () => {
  return (
    <PageScaffold
      title="Edit Client"
      description="Update client information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Clients", to: "/clients" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={Users}
        title="Edit Client"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditClient;
