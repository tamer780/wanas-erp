import { Package } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditMaterialPurchase = () => {
  return (
    <PageScaffold
      title="Edit Material Purchase"
      description="Update material purchase information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Material Purchases", to: "/material-purchases" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={Package}
        title="Edit Material Purchase"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditMaterialPurchase;
