import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Clients = () => {
  return (
    <PageScaffold
      title="Clients"
      description="Manage client profiles and relationships."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Clients" },
      ]}
      actions={
        <Link
          to="/clients/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Client
        </Link>
      }
    >
      <EmptyState
        icon={Users}
        title="No Clients Found"
        description="Clients will appear here once they are created."
        actionLabel="Create Client"
        actionTo="/clients/create"
      />
    </PageScaffold>
  );
};

export default Clients;
