import { UserCog } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const UserDetails = () => {
  return (
    <PageScaffold
      title="User Details"
      description="View detailed information for this user."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Users", to: "/users" },
        { label: "Details" },
      ]}
    >
      <EmptyState
        icon={UserCog}
        title="User Details"
        description="User details will appear here once data is connected."
      />
    </PageScaffold>
  );
};

export default UserDetails;
