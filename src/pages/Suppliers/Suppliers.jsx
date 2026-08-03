import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const Suppliers = () => {
  return (
    <PageScaffold
      title="Suppliers"
      description="Manage suppliers and vendor relationships."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Suppliers" },
      ]}
      actions={
        <Link
          to="/suppliers/create"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-wanas-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-wanas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 focus-visible:ring-offset-2"
        >
          Create Supplier
        </Link>
      }
    >
      <EmptyState
        icon={Truck}
        title="No Suppliers Found"
        description="Suppliers will appear here once they are created."
        actionLabel="Create Supplier"
        actionTo="/suppliers/create"
      />
    </PageScaffold>
  );
};

export default Suppliers;
