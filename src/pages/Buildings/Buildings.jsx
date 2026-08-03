import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Buildings = () => {
  return (
    <PageScaffold
      title="Buildings"
      description="Manage buildings across development projects."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Buildings" },
      ]}
      actions={
        <Link
          to="/buildings/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Building
        </Link>
      }
    >
      <EmptyState
        icon={Building2}
        title="No Buildings Found"
        description="Buildings will appear here once they are created."
        actionLabel="Create Building"
        actionTo="/buildings/create"
      />
    </PageScaffold>
  );
};

export default Buildings;
