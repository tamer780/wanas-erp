import { Truck } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditSupplier = () => {
  return (
    <PageScaffold
      title="Edit Supplier"
      description="Update supplier information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Suppliers", to: "/suppliers" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={Truck}
        title="Edit Supplier"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditSupplier;
