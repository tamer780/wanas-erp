import { Handshake } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const CreateUnitSale = () => {
  return (
    <PageScaffold
      title="Create Unit Sale"
      description="Add a new unit sale to the system."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Unit Sales", to: "/unit-sales" },
        { label: "Create" },
      ]}
    >
      <EmptyState
        icon={Handshake}
        title="Create Unit Sale"
        description="The create form will appear here."
      />
    </PageScaffold>
  );
};

export default CreateUnitSale;
