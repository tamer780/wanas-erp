import { Users } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateClient = () => {
  return (
    <PageScaffold
      title="Create Client"
      description="Add a new client to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Clients", to: "/clients" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Users}
        title="Create Client"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateClient;
