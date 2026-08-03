import { Truck } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateSupplier = () => {
  return (
    <PageScaffold
      title="Create Supplier"
      description="Add a new supplier to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Suppliers", to: "/suppliers" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Truck}
        title="Create Supplier"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateSupplier;
