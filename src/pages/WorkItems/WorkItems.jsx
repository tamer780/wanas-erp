import { Link } from "react-router-dom";
import { Hammer } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const WorkItems = () => {
  return (
    <PageScaffold
      title="Work Items"
      description="Track construction work items and progress."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Work Items" },
      ]}
      actions={
        <Link
          to="/work-items/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Work Item
        </Link>
      }
    >
      <EmptyState
        icon={Hammer}
        title="No Work Items Found"
        description="Work Items will appear here once they are created."
        actionLabel="Create Work Item"
        actionTo="/work-items/create"
      />
    </PageScaffold>
  );
};

export default WorkItems;
