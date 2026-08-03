import { Package } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateMaterialPurchase = () => {
  return (
    <PageScaffold
      title="Create Material Purchase"
      description="Add a new material purchase to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Material Purchases", to: "/material-purchases" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Package}
        title="Create Material Purchase"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateMaterialPurchase;
