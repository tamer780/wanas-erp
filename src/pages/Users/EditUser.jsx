import { UserCog } from "lucide-react";
import PageScaffold from "../../components/common/PageScaffold";
import EmptyState from "../../components/common/EmptyState";

const EditUser = () => {
  return (
    <PageScaffold
      title="Edit User"
      description="Update user information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Users", to: "/users" },
        { label: "Edit" },
      ]}
    >
      <EmptyState
        icon={UserCog}
        title="Edit User"
        description="The edit form will appear here."
      />
    </PageScaffold>
  );
};

export default EditUser;
