import { Link } from "react-router-dom";
import { HardHat } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Contractors = () => {
  return (
    <PageScaffold
      title="Contractors"
      description="Manage contractors and construction partners."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Contractors" },
      ]}
      actions={
        <Link
          to="/contractors/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Contractor
        </Link>
      }
    >
      <EmptyState
        icon={HardHat}
        title="No Contractors Found"
        description="Contractors will appear here once they are created."
        actionLabel="Create Contractor"
        actionTo="/contractors/create"
      />
    </PageScaffold>
  );
};

export default Contractors;
