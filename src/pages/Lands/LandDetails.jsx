import { Map } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const LandDetails = () => {
  return (
    <PageScaffold
      title="Land Details"
      description="View detailed information for this land."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Lands", to: "/lands" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={Map}
        title="Land Details"
        description="Land details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default LandDetails;
