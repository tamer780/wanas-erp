import { Link } from "react-router-dom";
import { Map } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Lands = () => {
  return (
    <PageScaffold
      title="Lands"
      description="Manage land parcels and property sites."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Lands" },
      ]}
      actions={
        <Link
          to="/lands/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Land
        </Link>
      }
    >
      <EmptyState
        icon={Map}
        title="No Lands Found"
        description="Lands will appear here once they are created."
        actionLabel="Create Land"
        actionTo="/lands/create"
      />
    </PageScaffold>
  );
};

export default Lands;
