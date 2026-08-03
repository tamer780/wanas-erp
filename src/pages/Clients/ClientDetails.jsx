import { Users } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const ClientDetails = () => {
  return (
    <PageScaffold
      title="Client Details"
      description="View detailed information for this client."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Clients", to: "/clients" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={Users}
        title="Client Details"
        description="Client details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default ClientDetails;
