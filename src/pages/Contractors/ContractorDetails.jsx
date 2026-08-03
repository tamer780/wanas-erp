import { HardHat } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const ContractorDetails = () => {
  return (
    <PageScaffold
      title="Contractor Details"
      description="View detailed information for this contractor."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Contractors", to: "/contractors" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={HardHat}
        title="Contractor Details"
        description="Contractor details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default ContractorDetails;
