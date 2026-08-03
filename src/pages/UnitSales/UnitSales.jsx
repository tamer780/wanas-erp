import { Link } from "react-router-dom";
import { Handshake } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const UnitSales = () => {
  return (
    <PageScaffold
      title="Unit Sales"
      description="Manage unit sales and reservation records."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Unit Sales" },
      ]}
      actions={
        <Link
          to="/unit-sales/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Unit Sale
        </Link>
      }
    >
      <EmptyState
        icon={Handshake}
        title="No Unit Sales Found"
        description="Unit Sales will appear here once they are created."
        actionLabel="Create Unit Sale"
        actionTo="/unit-sales/create"
      />
    </PageScaffold>
  );
};

export default UnitSales;
