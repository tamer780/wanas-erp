import { Link } from "react-router-dom";
import { DoorOpen } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Units = () => {
  return (
    <PageScaffold
      title="Units"
      description="Manage residential and commercial units."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Units" },
      ]}
      actions={
        <Link
          to="/units/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Unit
        </Link>
      }
    >
      <EmptyState
        icon={DoorOpen}
        title="No Units Found"
        description="Units will appear here once they are created."
        actionLabel="Create Unit"
        actionTo="/units/create"
      />
    </PageScaffold>
  );
};

export default Units;
