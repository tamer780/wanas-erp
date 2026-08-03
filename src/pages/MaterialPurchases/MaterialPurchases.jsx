import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const MaterialPurchases = () => {
  return (
    <PageScaffold
      title="Material Purchases"
      description="Manage material purchase orders and records."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Material Purchases" },
      ]}
      actions={
        <Link
          to="/material-purchases/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Material Purchase
        </Link>
      }
    >
      <EmptyState
        icon={Package}
        title="No Material Purchases Found"
        description="Material Purchases will appear here once they are created."
        actionLabel="Create Material Purchase"
        actionTo="/material-purchases/create"
      />
    </PageScaffold>
  );
};

export default MaterialPurchases;
