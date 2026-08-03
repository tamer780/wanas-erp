import { Handshake } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditUnitSale = () => {
  return (
    <PageScaffold
      title="Edit Unit Sale"
      description="Update unit sale information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Unit Sales", to: "/unit-sales" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={Handshake}
        title="Edit Unit Sale"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditUnitSale;
